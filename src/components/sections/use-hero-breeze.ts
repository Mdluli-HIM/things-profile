"use client";

import { useEffect, type RefObject } from "react";

export function useHeroBreeze(
  sectionRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const section = sectionRef.current;
    const image = section?.querySelector<HTMLImageElement>(
      "img.things-hero-artwork"
    );

    if (!section || !image) return;

    const motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let disposed = false;
    let stop = () => {};

    async function start() {
      if (motion.matches || disposed) return;

      try {
        await image!.decode();
        if (disposed || motion.matches) return;

        const THREE = await import("three");
        if (disposed || motion.matches) return;

        const canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        canvas.className = "things-hero-breeze";

        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: false,
            powerPreference: "low-power"
          });
        } catch {
          return;
        }

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0xffffff, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
        camera.position.z = 1;

        const texture = new THREE.TextureLoader().load(
          image!.currentSrc || image!.src,
          () => {
            if (disposed) return;
            loaded = true;
            syncSize();
            updateLoop();
          },
          undefined,
          () => teardown()
        );
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const uniforms = {
          artwork: { value: texture },
          time: { value: 0 },
          strength: { value: 0.0035 }
        };

        const material = new THREE.ShaderMaterial({
          uniforms,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
          vertexShader: `
            varying vec2 imageUV;
            void main() {
              imageUV = uv;
              gl_Position = vec4(position.xy, 0.0, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D artwork;
            uniform float time;
            uniform float strength;
            varying vec2 imageUV;

            float canopyMask(vec2 p, vec2 centre, vec2 radius) {
              float distanceFromCentre = length((p - centre) / radius);
              return 1.0 - smoothstep(0.5, 1.0, distanceFromCentre);
            }

            void main() {
              // Coordinates measured from the artwork's top-left.
              vec2 p = vec2(imageUV.x, 1.0 - imageUV.y);

              float canopy = max(
                canopyMask(p, vec2(0.12, 0.25), vec2(0.18, 0.16)),
                canopyMask(p, vec2(0.28, 0.36), vec2(0.12, 0.15))
              );

              // Stop before the people and the lower landscape.
              canopy *= 1.0 - smoothstep(0.46, 0.53, p.y);

              // Anchor the left edge of the image.
              canopy *= smoothstep(0.0, 0.035, p.x);

              float gust = 0.72 + 0.28 * sin(time * 0.37);
              float sway = sin(time * 0.85 + p.x * 9.0 + p.y * 4.0);
              float flutter = sin(time * 2.1 + p.x * 65.0 + p.y * 37.0);

              vec2 offset = vec2(
                sway + flutter * 0.20,
                sin(time * 0.95 + p.x * 15.0) * 0.28
              ) * canopy * gust * strength;

              // Clouds: gentle drift within the distant sky band.
              float cloudArea =
                smoothstep(0.39, 0.44, p.x) *
                smoothstep(0.50, 0.56, p.y) *
                (1.0 - smoothstep(0.59, 0.62, p.y));

              vec2 cloudMovement = vec2(
                sin(time * 0.28 + p.x * 5.0) * 0.0040,
                sin(time * 0.23 + p.x * 8.0) * 0.0005
              );

              // Small foreground areas between the people and rocks.
              float flowerArea = max(
                canopyMask(p, vec2(0.045, 0.825), vec2(0.045, 0.065)),
                canopyMask(p, vec2(0.175, 0.885), vec2(0.055, 0.050))
              );
              flowerArea = max(
                flowerArea,
                canopyMask(p, vec2(0.285, 0.955), vec2(0.080, 0.040))
              );
              flowerArea = max(
                flowerArea,
                canopyMask(p, vec2(0.700, 0.950), vec2(0.050, 0.040))
              );

              // Anchor the frame edges.
              flowerArea *=
                smoothstep(0.0, 0.025, p.x) *
                (1.0 - smoothstep(0.975, 1.0, p.x)) *
                (1.0 - smoothstep(0.975, 1.0, p.y));

              float flowerSway =
                sin(time * 1.25 + p.x * 24.0) +
                0.22 * sin(time * 2.4 + p.x * 71.0);

              vec2 flowerMovement = vec2(
                flowerSway * 0.0030,
                sin(time * 1.5 + p.x * 32.0) * 0.0008
              );

              offset += cloudMovement * cloudArea;
              offset += flowerMovement * flowerArea * gust;

              vec2 sampleUV = clamp(
                imageUV + offset,
                vec2(0.001),
                vec2(0.999)
              );

              gl_FragColor = texture2D(artwork, sampleUV);
              #include <colorspace_fragment>
            }
          `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        scene.add(new THREE.Mesh(geometry, material));

        let loaded = false;
        let visible = false;
        let frame = 0;
        let previous = 0;
        let elapsed = 0;
        let tornDown = false;

        const oldVisibility = image!.style.visibility;
        const oldPriority = image!.style.getPropertyPriority("visibility");

        canvas.style.cssText = [
          "position:absolute",
          "display:block",
          "pointer-events:none",
          "margin:0",
          "padding:0",
          "border:0",
          "visibility:hidden"
        ].join(";");

        image!.insertAdjacentElement("afterend", canvas);

        function restoreImage() {
          if (oldVisibility) {
            image!.style.setProperty(
              "visibility", oldVisibility, oldPriority
            );
          } else {
            image!.style.removeProperty("visibility");
          }
          canvas.style.visibility = "hidden";
        }

        function syncSize() {
          if (tornDown) return;

          const styles = getComputedStyle(image!);
          const width = image!.offsetWidth;
          const height = image!.offsetHeight;

          canvas.style.left = image!.offsetLeft + "px";
          canvas.style.top = image!.offsetTop + "px";
          canvas.style.width = width + "px";
          canvas.style.height = height + "px";

          for (const property of [
            "z-index", "transform", "transform-origin",
            "filter", "opacity", "mix-blend-mode",
            "mask-image", "mask-size", "mask-position",
            "mask-repeat", "-webkit-mask-image",
            "-webkit-mask-size", "-webkit-mask-position"
          ]) {
            canvas.style.setProperty(
              property, styles.getPropertyValue(property)
            );
          }

          const mobile = window.innerWidth < 768;
          const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            mobile ? 1 : 1.5,
            2048 / Math.max(width, 1)
          );

          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(
            Math.max(1, width), Math.max(1, height), false
          );

          if (loaded && width > 0 && height > 0 && !motion.matches) {
            renderer.render(scene, camera);
            canvas.style.visibility = "visible";
            image!.style.setProperty("visibility", "hidden");
          }
        }

        function tick(now: number) {
          frame = 0;
          if (tornDown || !visible || document.hidden || motion.matches) {
            previous = 0;
            return;
          }

          // Render at approximately 30fps.
          if (!previous || now - previous >= 1000 / 30) {
            elapsed += previous ? Math.min((now - previous) / 1000, 0.1) : 0;
            previous = now;
            uniforms.time.value = elapsed;
            renderer.render(scene, camera);
          }

          frame = requestAnimationFrame(tick);
        }

        function updateLoop() {
          cancelAnimationFrame(frame);
          frame = 0;
          previous = 0;

          if (motion.matches) {
            restoreImage();
            return;
          }

          if (loaded && visible && !document.hidden && !tornDown) {
            syncSize();
            frame = requestAnimationFrame(tick);
          }
        }

        const resize = new ResizeObserver(syncSize);
        resize.observe(section!);
        resize.observe(image!);

        const intersection = new IntersectionObserver(entries => {
          visible = entries[0]?.isIntersecting ?? false;
          updateLoop();
        });
        intersection.observe(image!);

        function teardown() {
          if (tornDown) return;
          tornDown = true;
          cancelAnimationFrame(frame);
          resize.disconnect();
          intersection.disconnect();
          window.removeEventListener("resize", syncSize);
          document.removeEventListener("visibilitychange", updateLoop);
          motion.removeEventListener("change", updateLoop);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          restoreImage();
          canvas.remove();
          geometry.dispose();
          material.dispose();
          texture.dispose();
          renderer.dispose();
        }

        function onContextLost(event: Event) {
          event.preventDefault();
          teardown();
        }

        window.addEventListener("resize", syncSize);
        document.addEventListener("visibilitychange", updateLoop);
        motion.addEventListener("change", updateLoop);
        canvas.addEventListener("webglcontextlost", onContextLost);

        stop = teardown;
        syncSize();

        if (disposed) teardown();
      } catch {
        // The original image remains the fallback.
        stop();
      }
    }

    void start();

    return () => {
      disposed = true;
      stop();
    };
  }, [sectionRef]);
}
