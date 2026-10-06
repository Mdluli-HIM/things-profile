"use client";

import NextImage, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = Pick<ImageProps,
  "alt" | "fill" | "sizes" | "className" | "loading"
> & { src: string };

const vertex = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
precision mediump float;
uniform sampler2D photo;
uniform vec2 pointer;
uniform vec2 cover;
uniform float aspect;
uniform float time;
uniform float strength;
varying vec2 uv;
void main() {
  vec2 delta = (uv - pointer) * vec2(aspect, 1.0);
  float distance = length(delta);
  float wave = sin(distance * 44.0 - time * 5.0);
  float falloff = exp(-distance * 8.0);
  vec2 direction = delta / max(distance, 0.001);
  vec2 offset = direction * wave * falloff * strength * 0.012;
  offset.x /= aspect;
  vec2 sampleUv = (uv + offset - 0.5) * cover + 0.5;
  gl_FragColor = texture2D(photo, clamp(sampleUv, 0.001, 0.999));
}`;

export function WaterImage(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = canvas?.closest<HTMLElement>(".things-category-card");

    if (!canvas || !card || reduce ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    const gl = canvas.getContext("webgl", {
      alpha: false, antialias: false, depth: false
    });
    if (!gl) return;

    const shaders: WebGLShader[] = [];

    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)
        ? shader : null;
    }

    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();

    if (!vs || !fs || !program) {
      shaders.forEach(shader => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();

    if (!buffer || !texture) {
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const uniforms = Object.fromEntries(
      ["photo", "pointer", "cover", "aspect", "time", "strength"]
        .map(name => [name, gl.getUniformLocation(program, name)])
    );
    gl.uniform1i(uniforms.photo, 0);

    const photo = new window.Image();
    let ready = false, disposed = false;
    let hovered = false, requested = false;
    let frame = 0, previous = 0, strength = 0;
    let x = 0.5, y = 0.5, targetX = 0.5, targetY = 0.5;

    function resize() {
      const bounds = card!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas!.height = Math.max(1, Math.round(bounds.height * ratio));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);

      const aspect = canvas!.width / canvas!.height;
      const imageAspect = photo.naturalWidth / (photo.naturalHeight || 1);

      gl!.uniform1f(uniforms.aspect, aspect);
      gl!.uniform2f(uniforms.cover,
        imageAspect > aspect ? aspect / imageAspect : 1,
        imageAspect > aspect ? 1 : imageAspect / aspect
      );
    }

    function render(now: number) {
      frame = 0;
      if (disposed || !ready) return;

      const dt = Math.min((now - (previous || now - 16)) / 1000, 0.05);
      previous = now;
      const ease = 1 - Math.exp(-dt * 9);

      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      strength += ((hovered ? 1 : 0) - strength) * ease;

      gl!.uniform2f(uniforms.pointer, x, y);
      gl!.uniform1f(uniforms.time, (now / 1000) % (Math.PI * 2 / 5));
      gl!.uniform1f(uniforms.strength, strength);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      canvas!.style.opacity = hovered ? "1" : "0";
      if (hovered || strength > 0.001) {
        frame = requestAnimationFrame(render);
      }
    }

    function start() {
      if (ready && !frame && !disposed) {
        previous = 0;
        frame = requestAnimationFrame(render);
      }
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const bounds = card!.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width;
      targetY = 1 - (event.clientY - bounds.top) / bounds.height;
    }

    function enter(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      move(event);
      x = targetX;
      y = targetY;
      hovered = true;
      if (!requested) {
        requested = true;
        photo.src = props.src;
      }
      start();
    }

    function leave() {
      hovered = false;
      start();
    }

    function lost(event: Event) {
      event.preventDefault();
      disposed = true;
      cancelAnimationFrame(frame);
      canvas!.style.opacity = "0";
    }

    photo.onload = () => {
      if (disposed) return;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, photo);
      ready = true;
      resize();
      start();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(card);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("pointercancel", leave);
    window.addEventListener("blur", leave);
    canvas.addEventListener("webglcontextlost", lost);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      photo.onload = null;
      canvas.style.opacity = "0";
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
      canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
    };
  }, [props.src, reduce]);

  return <span className="things-water-image" aria-hidden="true" style={{ position: "absolute", inset: 0, display: "block" }}>
    <NextImage {...props} />
    <canvas ref={canvasRef} className="things-water-canvas" />
  </span>;
}
