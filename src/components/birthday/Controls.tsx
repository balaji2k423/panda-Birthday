import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const SoundToggle = ({ enabled, onToggle }: SoundToggleProps) => (
  <motion.button
    onClick={onToggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.92 }}
    aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
    className="fixed right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full glass text-foreground/90 hover:text-primary"
  >
    {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
  </motion.button>
);

interface ProgressDotsProps {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
}

export const ProgressDots = ({ total, current, onSelect }: ProgressDotsProps) => (
  <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
    {Array.from({ length: total }).map((_, i) => {
      const active = i === current;
      return (
        <button
          key={i}
          aria-label={`Go to section ${i + 1}`}
          onClick={() => onSelect?.(i)}
          className={`h-1.5 rounded-full transition-all ${
            active ? "w-6 bg-primary shadow-[0_0_10px_hsl(var(--primary-glow))]" : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
          }`}
        />
      );
    })}
  </div>
);
