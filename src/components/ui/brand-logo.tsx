import Image from "next/image";
import logo from "../../../public/images/brand/things-logo.png";
import "./brand-logo.css";

export function BrandLogo() {
  return (
    <Image
      src={logo}
      alt="Things"
      className="things-brand-logo" loading="eager"
    />
  );
}
