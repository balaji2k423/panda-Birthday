import { useState } from "react";
import { motion } from "framer-motion";
import { FloatingParticles, Typewriter } from "../Atmosphere";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
}

export const IntroSection = ({ onNext }: Props) => {
  const [showButton, setShowButton] = useState(false);

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-night px-6">
      <FloatingParticles count={42} />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <Typewriter
          lines={[
            "Hey Deva Darshini ❤️",
            "25th April… a beautiful day",
            "Because someone special was born today ✨",
          ]}
          className="space-y-5"
          lineClassName="font-serif text-3xl leading-snug text-foreground text-glow-rose md:text-5xl"
          onComplete={() => setShowButton(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={showButton ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlowButton onClick={onNext} disabled={!showButton}>
            Start ✨
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
};
