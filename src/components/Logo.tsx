"use client";

import React from "react";

interface LogoProps {
  variant?: "dark" | "white" | "icon";
  className?: string;
  showSubtitle?: boolean;
}

export function Logo({
  variant = "dark",
  className = "h-11",
  showSubtitle = true,
}: LogoProps) {
  const isWhite = variant === "white";
  const isIcon = variant === "icon";

  if (isIcon) {
    return (
      <svg
        viewBox="0 0 112 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="aethelGreenIco" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15532d" />
            <stop offset="100%" stopColor="#0b3119" />
          </linearGradient>

          <linearGradient id="solarNavyIco" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#122d47" />
            <stop offset="100%" stopColor="#08192a" />
          </linearGradient>

          <pattern id="gridLeftIco" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
            <rect width="10" height="8" fill="#0c2237" rx="0.5" />
            <line x1="0" y1="4" x2="10" y2="4" stroke="#3b6d92" strokeWidth="0.5" opacity="0.75" />
            <line x1="5" y1="0" x2="5" y2="8" stroke="#3b6d92" strokeWidth="0.5" opacity="0.75" />
          </pattern>

          <pattern id="gridRightIco" width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
            <rect width="10" height="8" fill="#0c2237" rx="0.5" />
            <line x1="0" y1="4" x2="10" y2="4" stroke="#3b6d92" strokeWidth="0.5" opacity="0.75" />
            <line x1="5" y1="0" x2="5" y2="8" stroke="#3b6d92" strokeWidth="0.5" opacity="0.75" />
          </pattern>

          <clipPath id="clipLegLeftIco">
            <polygon points="47,12 36,42 6,98 34,98 48,65 52,42" />
          </clipPath>
          <clipPath id="clipLegRightIco">
            <polygon points="63,12 74,42 104,98 76,98 62,65 58,42" />
          </clipPath>
        </defs>

        <polygon points="47,12 36,42 6,98 34,98 48,65 52,42" fill="url(#solarNavyIco)" />
        <rect x="0" y="0" width="112" height="110" fill="url(#gridLeftIco)" clipPath="url(#clipLegLeftIco)" />

        <polygon points="63,12 74,42 104,98 76,98 62,65 58,42" fill="url(#solarNavyIco)" />
        <rect x="0" y="0" width="112" height="110" fill="url(#gridRightIco)" clipPath="url(#clipLegRightIco)" />

        <polygon points="47,12 63,12 74,42 36,42" fill="url(#aethelGreenIco)" />
        <polygon points="47,12 63,12 104,98 76,98 62,65 48,65 34,98 6,98" fill="none" stroke="#0d341c" strokeWidth="1.5" strokeLinejoin="round" />

        <path d="M 55,27 C 38,46 38,68 55,80 C 72,68 72,46 55,27 Z" fill="#ffffff" stroke="#0f3f22" strokeWidth="4.5" strokeLinejoin="round" />
        <polygon points="56.5,37 48,53 54.5,53 53,72 63.5,50 57,50" fill="#0f3f22" />
        <line x1="55" y1="80" x2="55" y2="98" stroke="#0f3f22" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 368 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={isWhite ? "greenApexW" : "greenApexD"} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? "#22c55e" : "#15532d"} />
          <stop offset="100%" stopColor={isWhite ? "#15803d" : "#0b3119"} />
        </linearGradient>

        <linearGradient id={isWhite ? "solarLegW" : "solarLegD"} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? "#1e3a5f" : "#122d47"} />
          <stop offset="100%" stopColor={isWhite ? "#0d2238" : "#08192a"} />
        </linearGradient>

        <pattern id={isWhite ? "solarGridLeftW" : "solarGridLeftD"} width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="10" height="8" fill={isWhite ? "#12283d" : "#0c2237"} rx="0.5" />
          <line x1="0" y1="4" x2="10" y2="4" stroke={isWhite ? "#5a8bb3" : "#3b6d92"} strokeWidth="0.5" opacity="0.75" />
          <line x1="5" y1="0" x2="5" y2="8" stroke={isWhite ? "#5a8bb3" : "#3b6d92"} strokeWidth="0.5" opacity="0.75" />
        </pattern>

        <pattern id={isWhite ? "solarGridRightW" : "solarGridRightD"} width="11" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <rect width="10" height="8" fill={isWhite ? "#12283d" : "#0c2237"} rx="0.5" />
          <line x1="0" y1="4" x2="10" y2="4" stroke={isWhite ? "#5a8bb3" : "#3b6d92"} strokeWidth="0.5" opacity="0.75" />
          <line x1="5" y1="0" x2="5" y2="8" stroke={isWhite ? "#5a8bb3" : "#3b6d92"} strokeWidth="0.5" opacity="0.75" />
        </pattern>

        <clipPath id={isWhite ? "clipL_W" : "clipL_D"}>
          <polygon points="47,12 36,42 6,98 34,98 48,65 52,42" />
        </clipPath>
        <clipPath id={isWhite ? "clipR_W" : "clipR_D"}>
          <polygon points="63,12 74,42 104,98 76,98 62,65 58,42" />
        </clipPath>
      </defs>

      <g transform="translate(2, 0)">
        <polygon points="47,12 36,42 6,98 34,98 48,65 52,42" fill={`url(#${isWhite ? "solarLegW" : "solarLegD"})`} />
        <rect x="0" y="0" width="112" height="110" fill={`url(#${isWhite ? "solarGridLeftW" : "solarGridLeftD"})`} clipPath={`url(#${isWhite ? "clipL_W" : "clipL_D"})`} />

        <polygon points="63,12 74,42 104,98 76,98 62,65 58,42" fill={`url(#${isWhite ? "solarLegW" : "solarLegD"})`} />
        <rect x="0" y="0" width="112" height="110" fill={`url(#${isWhite ? "solarGridRightW" : "solarGridRightD"})`} clipPath={`url(#${isWhite ? "clipR_W" : "clipR_D"})`} />

        <polygon points="47,12 63,12 74,42 36,42" fill={`url(#${isWhite ? "greenApexW" : "greenApexD"})`} />
        <polygon points="47,12 63,12 104,98 76,98 62,65 48,65 34,98 6,98" fill="none" stroke={isWhite ? "#34d399" : "#0d341c"} strokeWidth={isWhite ? "1.2" : "1.5"} strokeLinejoin="round" opacity={isWhite ? 0.7 : 1} />

        <path
          d="M 55,27 C 38,46 38,68 55,80 C 72,68 72,46 55,27 Z"
          fill="#ffffff"
          stroke={isWhite ? "#22c55e" : "#0f3f22"}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        <polygon
          points="56.5,37 48,53 54.5,53 53,72 63.5,50 57,50"
          fill="#0f3f22"
        />

        <line
          x1="55"
          y1="80"
          x2="55"
          y2="98"
          stroke={isWhite ? "#22c55e" : "#0f3f22"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <g transform="translate(122, 0)">
        <text
          x="0"
          y="63"
          fontFamily="'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="55"
          fill={isWhite ? "#ffffff" : "#0e291b"}
          letterSpacing="4"
        >
          AETHEL
        </text>

        {showSubtitle && (
          <>
            {/* Left Accent Rule: starts exactly aligned with AETHEL */}
            <line
              x1="2"
              y1="85"
              x2="34"
              y2="85"
              stroke={isWhite ? "#34d399" : "#114524"}
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Subtitle Text: Centered between rules */}
            <text
              x="43"
              y="90"
              fontFamily="'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="700"
              fontSize="14"
              fill={isWhite ? "#a7f3d0" : "#114524"}
              letterSpacing="5.8"
            >
              RENEWABLES
            </text>

            {/* Right Accent Rule: ends exactly aligned with end of AETHEL */}
            <line
              x1="202"
              y1="85"
              x2="234"
              y2="85"
              stroke={isWhite ? "#34d399" : "#114524"}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
    </svg>
  );
}
