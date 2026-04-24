import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroSection } from "@/components/birthday/sections/IntroSection";
import { WishSection } from "@/components/birthday/sections/WishSection";
import { MemoriesSection } from "@/components/birthday/sections/MemoriesSection";
import { MessageSection } from "@/components/birthday/sections/MessageSection";
import { CakeSection } from "@/components/birthday/sections/CakeSection";
import { FinalSection } from "@/components/birthday/sections/FinalSection";
import { ProgressDots, SoundToggle } from "@/components/birthday/Controls";

const TOTAL = 6;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const Index = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sound, setSound] = useState(true);

  const goTo = useCallback((next: number) => {
    setDirection(next > page ? 1 : -1);
    setPage(Math.max(0, Math.min(TOTAL - 1, next)));
  }, [page]);

  const next = () => goTo(page + 1);
  const back = () => goTo(page - 1);
  const replay = () => {
    setDirection(-1);
    setPage(0);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <SoundToggle enabled={sound} onToggle={() => setSound((s) => !s)} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {page === 0 && <IntroSection onNext={next} />}
          {page === 1 && <WishSection onNext={next} onBack={back} />}
          {page === 2 && <MemoriesSection onNext={next} onBack={back} />}
          {page === 3 && <MessageSection onNext={next} onBack={back} />}
          {page === 4 && <CakeSection onNext={next} onBack={back} soundEnabled={sound} />}
          {page === 5 && <FinalSection onReplay={replay} onBack={back} />}
        </motion.div>
      </AnimatePresence>

      <ProgressDots total={TOTAL} current={page} onSelect={goTo} />
    </main>
  );
};

export default Index;
