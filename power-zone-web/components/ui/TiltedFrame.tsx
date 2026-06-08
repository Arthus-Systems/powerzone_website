'use client';

/* -----------------------------------------------------------------------------
 * TiltedFrame — generic 3D-tilt wrapper for ANY content (iframe, map,
 * card body, etc). Reuses the same spring-driven tilt math as TiltedCard
 * (components/ui/TiltedCard.tsx) but accepts arbitrary children rather
 * than requiring an `imageSrc`. Use TiltedCard when the primary content
 * is an image; use TiltedFrame for everything else (Footer map, custom
 * card bodies, etc.).
 * -------------------------------------------------------------------------- */

import { useRef } from 'react';
import type { SpringOptions } from 'framer-motion';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TiltedFrameProps {
  children: React.ReactNode;
  /** Class names applied to the OUTER perspective wrapper. Use this to
   *  size the frame (h/w) or position it within a parent. */
  className?: string;
  /** Max degrees of tilt at the edges of the frame. Lower = subtler. */
  rotateAmplitude?: number;
  /** Scale at hover. 1.0 = no scale. */
  scaleOnHover?: number;
  /** Perspective in px. Higher = subtler 3D depth, lower = more dramatic. */
  perspective?: number;
}

const springValues: SpringOptions = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedFrame({
  children,
  className = '',
  rotateAmplitude = 10,
  scaleOnHover = 1.03,
  perspective = 1000,
}: TiltedFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: `${perspective}px` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="h-full w-full"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
