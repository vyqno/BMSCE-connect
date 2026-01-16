'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface BackgroundGlowProps {
  children?: React.ReactNode;
  className?: string;
}

export const BackgroundGlow = ({ children, className }: BackgroundGlowProps) => {
  return (
    <div className={cn("min-h-screen w-full relative bg-white overflow-hidden", className)}>
      {/* Soft Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, #FFF991 0%, transparent 70%)",
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
