import * as React from "react";

export const SvgTiktokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="25"
    height="25"
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient
        id="tiktok-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#3352CC" />
        <stop offset="100%" stopColor="#1C2D70" />
      </linearGradient>
    </defs>
    <path
      d="M19.589 6.686a4.79 4.79 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.2 8.2 0 0 0 4.773 1.526V6.79a5 5 0 0 1-1.003-.104"
      fill="url(#tiktok-gradient)"
    />
  </svg>
);

export default SvgTiktokIcon;
