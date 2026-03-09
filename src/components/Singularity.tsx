import { motion, AnimatePresence } from 'motion/react';
import { useMemo } from 'react';

interface SingularityProps {
  mass: number;
  color: string;
  spin: number;
  isProcessing?: boolean;
  pulse?: number;
}

export function Singularity({ mass, color, spin, isProcessing, pulse }: SingularityProps) {
  const baseSize = 300;
  const currentSize = baseSize * mass;
  
  // Ensure spin is never exactly 0 to avoid division by zero in duration
  const safeSpin = spin === 0 ? 0.1 : spin;
  const spinDirection = safeSpin > 0 ? 1 : -1;

  const particles = useMemo(() => {
    if (!pulse || pulse === 0) return [];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      distance: 150 + Math.random() * 350,
      size: 2 + Math.random() * 5,
      duration: 0.8 + Math.random() * 1.2
    }));
  }, [pulse]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer Ambient Glow */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          width: currentSize * 3.5,
          height: currentSize * 3.5,
          boxShadow: `0 0 ${currentSize}px ${currentSize / 2}px ${color}`,
          scale: isProcessing ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: isProcessing ? [0.15, 0.25, 0.15] : [0.1, 0.15, 0.1],
        }}
        transition={{ 
          duration: isProcessing ? 1.5 : 4, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
        style={{ filter: 'blur(60px)' }}
      />
      
      {/* Impact Flash (Temporary intense glow on pulse) */}
      <AnimatePresence>
        {pulse && pulse > 0 && (
          <motion.div
            key={`flash-${pulse}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 2.5] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: currentSize * 4,
              height: currentSize * 4,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              zIndex: 0
            }}
          />
        )}
      </AnimatePresence>

      {/* Inner Intense Glow */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          width: currentSize * 2,
          height: currentSize * 2,
          boxShadow: `0 0 ${currentSize / 2}px ${currentSize / 4}px ${color}`,
          scale: isProcessing ? [1, 1.2, 1] : [1, 1.1, 1],
        }}
        transition={{ 
          duration: isProcessing ? 1 : 3, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
        style={{ opacity: 0.4, filter: 'blur(30px)' }}
      />

      {/* Accretion Disk 1 (Fast, inner) */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          rotate: 360 * spinDirection,
          width: currentSize * 1.8,
          height: currentSize * 1.8,
          scale: isProcessing ? [1, 1.05, 0.95, 1] : 1,
        }}
        transition={{
          rotate: { duration: (isProcessing ? 5 : 10) / Math.abs(safeSpin), repeat: Infinity, ease: "linear" },
          width: { duration: 2 },
          height: { duration: 2 },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}60, transparent, ${color}60, transparent)`,
          filter: 'blur(8px)',
          opacity: 0.8
        }}
      />

      {/* Accretion Disk 2 (Slow, outer, opposite spin) */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          rotate: -360 * spinDirection,
          width: currentSize * 2.5,
          height: currentSize * 2.5,
          skew: isProcessing ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          rotate: { duration: (isProcessing ? 10 : 20) / Math.abs(safeSpin), repeat: Infinity, ease: "linear" },
          width: { duration: 2 },
          height: { duration: 2 },
          skew: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          background: `conic-gradient(from 90deg, transparent, ${color}30, transparent, ${color}30, transparent)`,
          filter: 'blur(15px)',
          opacity: 0.6
        }}
      />
      
      {/* Accretion Disk 3 (Thin, sharp ring) */}
      <motion.div
        className="absolute rounded-full border border-white/20"
        animate={{
          rotate: 360 * spinDirection,
          width: currentSize * 1.4,
          height: currentSize * 1.4,
          borderColor: `${color}80`,
          scale: isProcessing ? [1, 1.1, 0.9, 1] : 1,
        }}
        transition={{
          rotate: { duration: (isProcessing ? 2.5 : 5) / Math.abs(safeSpin), repeat: Infinity, ease: "linear" },
          width: { duration: 2 },
          height: { duration: 2 },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          boxShadow: `0 0 15px ${color}`,
          filter: 'blur(1px)',
        }}
      />

      {/* The Event Horizon (Pure Black Center) */}
      <motion.div
        className="absolute bg-black rounded-full z-10"
        animate={{
          width: currentSize,
          height: currentSize,
          scale: isProcessing ? [1, 0.95, 1.05, 1] : [1, 1.02, 1],
        }}
        transition={{ 
          width: { duration: 2, ease: "easeInOut" },
          height: { duration: 2, ease: "easeInOut" },
          scale: { duration: isProcessing ? 0.5 : 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          boxShadow: `inset 0 0 20px rgba(255,255,255,0.05), 0 0 30px 2px ${color}80`,
        }}
      />

      {/* Absorption Ripple & Particles */}
      <AnimatePresence>
        {pulse && pulse > 0 && (
          <>
            <motion.div
              key={`ripple-${pulse}`}
              initial={{ width: currentSize, height: currentSize, opacity: 1, border: `2px solid ${color}` }}
              animate={{ width: currentSize * 6, height: currentSize * 6, opacity: 0, borderWidth: '0px' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute rounded-full pointer-events-none z-0"
            />
            {particles.map((p) => (
              <motion.div
                key={`particle-${pulse}-${p.id}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ 
                  x: Math.cos(p.angle) * p.distance, 
                  y: Math.sin(p.angle) * p.distance, 
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`,
                  zIndex: 5
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
