"use client";
import React, { useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface SpotlightWrapperProps {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
  enableVerticalFade?: boolean;
  fadeStops?: {
    start: number;
    fadeInStart: number;
    fullIntensityStart: number;
    fullIntensityEnd: number;
    fadeOutEnd: number;
    end: number;
  };
}

const SpotlightWrapper: React.FC<SpotlightWrapperProps> = ({
  children,
  spotlightColor = "rgba(12, 185, 193, 0.25)",
  className = "",
  enableVerticalFade = true,
  fadeStops = {
    start: 0,
    fadeInStart: 10,
    fullIntensityStart: 40,
    fullIntensityEnd: 60,
    fadeOutEnd: 90,
    end: 100,
  },
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const maskImageStyle = enableVerticalFade
    ? {
        maskImage: `linear-gradient(to bottom, 
          transparent ${fadeStops.start}%, 
          rgba(0,0,0,0.1) ${fadeStops.fadeInStart}%, 
          rgba(0,0,0,0.8) 25%, 
          rgba(0,0,0,1) ${fadeStops.fullIntensityStart}%, 
          rgba(0,0,0,1) ${fadeStops.fullIntensityEnd}%, 
          rgba(0,0,0,0.8) 75%, 
          rgba(0,0,0,0.1) ${fadeStops.fadeOutEnd}%, 
          transparent ${fadeStops.end}%)`,
        WebkitMaskImage: `linear-gradient(to bottom, 
          transparent ${fadeStops.start}%, 
          rgba(0,0,0,0.1) ${fadeStops.fadeInStart}%, 
          rgba(0,0,0,0.8) 25%, 
          rgba(0,0,0,1) ${fadeStops.fullIntensityStart}%, 
          rgba(0,0,0,1) ${fadeStops.fullIntensityEnd}%, 
          rgba(0,0,0,0.8) 75%, 
          rgba(0,0,0,0.1) ${fadeStops.fadeOutEnd}%, 
          transparent ${fadeStops.end}%)`,
      }
    : {};

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          ...maskImageStyle,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightWrapper;
