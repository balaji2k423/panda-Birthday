import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const usePartyPoppers = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    color: string; size: number; alpha: number; spin: number; spinV: number; shape: number;
  }>>([]);
  const rafRef = useRef<number | null>(null);

  const fire = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#ff8fc7","#c8b6ff","#ffd27a","#7ee8fa","#ff6b6b","#fff","#f9ca24","#6c5ce7","#fd79a8","#55efc4"];
    const newParticles: typeof particlesRef.current = [];
    const spawnPopper = (fromX: number, angle: number) => {
      for (let i = 0; i < 80; i++) {
        const a = angle + (Math.random() - 0.5) * 0.9;
        const speed = 8 + Math.random() * 14;
        newParticles.push({ x: fromX, y: canvas.height * 0.65, vx: Math.cos(a)*speed, vy: Math.sin(a)*speed,
          color: colors[Math.floor(Math.random()*colors.length)], size: 4+Math.random()*7, alpha: 1,
          spin: Math.random()*Math.PI*2, spinV: (Math.random()-0.5)*0.3, shape: Math.floor(Math.random()*3) });
      }
    };
    spawnPopper(canvas.width*0.05, -Math.PI/4);
    spawnPopper(canvas.width*0.95, -Math.PI*3/4);
    for (let i = 0; i < 60; i++) {
      const a = Math.random()*Math.PI*2, speed = 5+Math.random()*18;
      newParticles.push({ x: canvas.width/2, y: canvas.height*0.4, vx: Math.cos(a)*speed, vy: Math.sin(a)*speed-4,
        color: colors[Math.floor(Math.random()*colors.length)], size: 3+Math.random()*8, alpha: 1,
        spin: Math.random()*Math.PI*2, spinV: (Math.random()-0.5)*0.4, shape: Math.floor(Math.random()*3) });
    }
    particlesRef.current = newParticles;
    const ctx = canvas.getContext("2d")!;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particlesRef.current) {
        if (p.alpha <= 0) continue;
        alive = true;
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.spin += p.spinV; p.alpha -= 0.012;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha); ctx.translate(p.x, p.y); ctx.rotate(p.spin); ctx.fillStyle = p.color;
        if (p.shape===0) ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
        else if (p.shape===1) { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
        else ctx.fillRect(-p.size/3, -p.size/2, p.size*0.6, p.size);
        ctx.restore();
      }
      if (alive) rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
  };
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);
  return { canvasRef, fire };
};

const playCelebrationSound = () => {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);
    const now = ctx.currentTime;
    [523.25,659.25,783.99,1046.5,1318.51].forEach((freq,i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now+i*0.18);
      gain.gain.linearRampToValueAtTime(0.22, now+i*0.18+0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now+i*0.18+1.1);
      osc.connect(gain).connect(master); osc.start(now+i*0.18); osc.stop(now+i*0.18+1.2);
    });
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      const t = now+0.05+Math.random()*1.2;
      osc.type = "sine"; osc.frequency.value = 2000+Math.random()*2000;
      gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(0.06,t+0.01); gain.gain.exponentialRampToValueAtTime(0.001,t+0.35);
      osc.connect(gain).connect(master); osc.start(t); osc.stop(t+0.4);
    }
    const pad = ctx.createOscillator(), padGain = ctx.createGain();
    pad.type = "triangle"; pad.frequency.value = 261.63;
    padGain.gain.setValueAtTime(0,now); padGain.gain.linearRampToValueAtTime(0.08,now+0.1); padGain.gain.exponentialRampToValueAtTime(0.001,now+1.8);
    pad.connect(padGain).connect(master); pad.start(now); pad.stop(now+2);
    setTimeout(() => ctx.close(), 2500);
  } catch {}
};

const CakeSVG = ({ blown }: { blown: boolean }) => (
  <svg viewBox="0 0 260 310" width="240" height="288" xmlns="http://www.w3.org/2000/svg"
    style={{ filter:"drop-shadow(0 20px 48px rgba(200,50,100,0.45))", overflow:"visible" }}>
    <defs>
      <radialGradient id="cFlame" cx="50%" cy="75%" r="55%">
        <stop offset="0%" stopColor="#fffde7"/><stop offset="30%" stopColor="#ffd740"/>
        <stop offset="65%" stopColor="#ff6d00"/><stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <radialGradient id="cFlameInner" cx="50%" cy="85%" r="40%">
        <stop offset="0%" stopColor="#b3e5fc" stopOpacity="0.9"/><stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <radialGradient id="cHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,200,60,0.55)"/><stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <linearGradient id="cBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(342 82% 62%)"/><stop offset="100%" stopColor="hsl(342 78% 50%)"/>
      </linearGradient>
      <linearGradient id="cMid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(330 72% 68%)"/><stop offset="100%" stopColor="hsl(330 68% 57%)"/>
      </linearGradient>
      <linearGradient id="cTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(318 65% 76%)"/><stop offset="100%" stopColor="hsl(318 62% 65%)"/>
      </linearGradient>
      <linearGradient id="cFrost" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff5f8"/><stop offset="100%" stopColor="#ffe0ec"/>
      </linearGradient>
      <linearGradient id="cCandle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff9c4"/><stop offset="50%" stopColor="#fff"/><stop offset="100%" stopColor="#ffe082"/>
      </linearGradient>
      <linearGradient id="cPlate" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fce4ec"/><stop offset="100%" stopColor="#f8bbd0"/>
      </linearGradient>
      <filter id="cBlur4"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="cBlur2"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    <ellipse cx="130" cy="282" rx="88" ry="8" fill="rgba(150,30,80,0.25)" filter="url(#cBlur4)"/>
    <ellipse cx="130" cy="276" rx="84" ry="9" fill="url(#cPlate)"/>
    <ellipse cx="130" cy="274" rx="76" ry="6" fill="#fce4ec" opacity="0.7"/>
    <rect x="36" y="210" width="188" height="64" rx="6" fill="url(#cBase)"/>
    <ellipse cx="130" cy="210" rx="94" ry="11" fill="url(#cFrost)"/>
    {[52,72,93,114,135,156,177,198].map((x,i)=>(
      <ellipse key={i} cx={x} cy={218+(i%2?10:6)} rx={5} ry={i%2?12:8} fill="#fff0f5" opacity="0.95"/>
    ))}
    <rect x="36" y="222" width="188" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="36" y="252" width="188" height="2" rx="1" fill="rgba(0,0,0,0.08)"/>
    {[65,108,151,194].map((x,i)=>(
      <g key={i} transform={`translate(${x},248)`}>
        {[0,1,2,3,4,5,6,7].map(j=>(
          <ellipse key={j} cx={Math.cos(j*Math.PI/4)*5.5} cy={Math.sin(j*Math.PI/4)*5.5}
            rx="4.5" ry="3" fill={`hsl(${350-j*4} 80% ${72+j*2}%)`} transform={`rotate(${j*45})`}/>
        ))}
        <circle r="4" fill="hsl(350 75% 80%)"/><circle r="2" fill="hsl(350 65% 88%)"/>
      </g>
    ))}
    {[86,130,173].map((x,i)=>(
      <ellipse key={i} cx={x} cy={248} rx={6} ry={2.5} fill="hsl(140 55% 48%)"
        transform={`rotate(${i%2?-25:25},${x},248)`} opacity="0.9"/>
    ))}
    <path d="M36,270 Q60,278 84,270 Q108,278 132,270 Q156,278 180,270 Q204,278 224,270"
      fill="none" stroke="hsl(40 90% 70%)" strokeWidth="2" opacity="0.6"/>
    <rect x="60" y="150" width="140" height="63" rx="5" fill="url(#cMid)"/>
    <ellipse cx="130" cy="150" rx="70" ry="9" fill="url(#cFrost)"/>
    {[72,91,110,130,150,169,188].map((x,i)=>(
      <ellipse key={i} cx={x} cy={158+(i%2?9:5)} rx={4} ry={i%2?10:6} fill="#fff0f5" opacity="0.9"/>
    ))}
    <rect x="60" y="163" width="140" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
    {Array.from({length:20}).map((_,i)=>{
      const sx=70+(i*8.3)%120, sy=170+(i*5.7)%36;
      return <rect key={i} x={sx} y={sy} width="2.5" height="7" rx="1.2"
        fill={["#ffd740","#f48fb1","#ce93d8","#80deea","#fff9c4","#ff8a65"][i%6]}
        transform={`rotate(${(i*47)%180},${sx+1.25},${sy+3.5})`} opacity="0.9"/>
    })}
    {[74,90,106,122,138,154,170,186].map((x,i)=>(
      <circle key={i} cx={x} cy={152} r="3" fill="white" opacity="0.8"/>
    ))}
    {[88,130,172].map((x,i)=>(
      <g key={i} transform={`translate(${x},190)`}>
        {[0,1,2,3,4,5].map(j=>(
          <ellipse key={j} cx={Math.cos(j*Math.PI/3)*4.5} cy={Math.sin(j*Math.PI/3)*4.5}
            rx="4" ry="2.5" fill={`hsl(${10-j*5} 80% ${70+j*3}%)`} transform={`rotate(${j*60})`}/>
        ))}
        <circle r="3" fill="hsl(10 75% 80%)"/><circle r="1.5" fill="hsl(10 60% 88%)"/>
      </g>
    ))}
    <rect x="84" y="96" width="92" height="57" rx="5" fill="url(#cTop)"/>
    <ellipse cx="130" cy="96" rx="46" ry="7.5" fill="url(#cFrost)"/>
    {[90,105,120,135,150,165,175].map((x,i)=>(
      <ellipse key={i} cx={x} cy={103+(i%2?7:4)} rx={3.5} ry={i%2?8:5} fill="#fff0f5" opacity="0.88"/>
    ))}
    {[90,103,116,130,144,157,170].map((x,i)=>(
      <circle key={i} cx={x} cy={97} r="2.5" fill="white" opacity="0.85"/>
    ))}
    {[100,130,160].map((x,i)=>(
      <g key={i} transform={`translate(${x},126)`}>
        {[0,1,2,3,4].map(j=>(
          <ellipse key={j} cx={Math.cos(j*Math.PI*2/5)*5} cy={Math.sin(j*Math.PI*2/5)*5}
            rx="3.5" ry="2" fill={`hsl(${290+j*15} 70% 78%)`} transform={`rotate(${j*72})`}/>
        ))}
        <circle r="2.5" fill="#ffd740"/>
      </g>
    ))}
    <ellipse cx="130" cy="149" rx="70" ry="9" fill="none" stroke="hsl(40 90% 70%)" strokeWidth="1.5" opacity="0.5"/>
    <rect x="123" y="60" width="14" height="38" rx="3.5" fill="url(#cCandle)"/>
    {[68,77,86].map((y,i)=>(
      <rect key={i} x="123" y={y} width="14" height="3" rx="1" fill="hsl(330 70% 80% / 0.5)"/>
    ))}
    <rect x="126" y="62" width="3" height="30" rx="1.5" fill="rgba(255,255,255,0.45)"/>
    <line x1="130" y1="60" x2="130" y2="55" stroke="#5d4037" strokeWidth="1.5" strokeLinecap="round"/>
    <AnimatePresence>
      {!blown && (
        <motion.g key="flame" exit={{opacity:0,y:-20}} transition={{duration:0.45}}>
          <ellipse cx="130" cy="38" rx="30" ry="30" fill="url(#cHalo)" filter="url(#cBlur4)"/>
          <motion.path
            d="M130,16 C121,25 117,34 119.5,43 C121.5,51 126,55.5 130,56.5 C134,55.5 138.5,51 140.5,43 C143,34 139,25 130,16Z"
            fill="url(#cFlame)"
            animate={{scaleX:[1,1.09,0.93,1.07,1],scaleY:[1,0.96,1.05,0.95,1]}}
            transition={{duration:0.85,repeat:Infinity,ease:"easeInOut"}}
            style={{transformOrigin:"130px 56px"}}/>
          <motion.ellipse cx="130" cy="48" rx="4" ry="7" fill="url(#cFlameInner)"
            animate={{scaleY:[1,1.18,0.88,1.12,1]}} transition={{duration:0.65,repeat:Infinity,ease:"easeInOut"}}/>
          <ellipse cx="130" cy="22" rx="2.5" ry="4" fill="#fffde7" opacity="0.8"/>
        </motion.g>
      )}
      {blown && (
        <motion.g key="smoke" initial={{opacity:0.8,y:0}} animate={{opacity:0,y:-50}} transition={{duration:2}}>
          <ellipse cx="130" cy="48" rx="3" ry="8" fill="rgba(200,200,220,0.5)" filter="url(#cBlur2)"/>
          <ellipse cx="129" cy="36" rx="5" ry="10" fill="rgba(200,200,220,0.3)" filter="url(#cBlur2)"/>
        </motion.g>
      )}
    </AnimatePresence>
  </svg>
);

const GlowButton = ({ children, onClick, disabled, variant }: {
  children: React.ReactNode; onClick?: ()=>void; disabled?: boolean; variant?: string;
}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding:"11px 28px", borderRadius:"999px",
    border: variant==="ghost" ? "1px solid hsl(330 60% 70%/0.35)" : "1px solid hsl(330 80% 75%/0.55)",
    background: variant==="ghost" ? "transparent" : disabled ? "hsl(330 30% 50%/0.2)"
      : "linear-gradient(135deg,hsl(330 80% 68%/0.9),hsl(308 70% 60%/0.9))",
    color: disabled ? "hsl(330 30% 70%)" : "hsl(330 100% 96%)",
    fontSize:"15px", fontFamily:"inherit", cursor: disabled?"not-allowed":"pointer",
    letterSpacing:"0.04em", backdropFilter:"blur(10px)", transition:"all 0.22s ease",
    boxShadow: disabled||variant==="ghost" ? "none" : "0 4px 28px hsl(330 80% 60%/0.4)",
  }}>{children}</button>
);

type MicState = "idle"|"requesting"|"listening"|"denied"|"unsupported";
interface Props { onNext:()=>void; onBack:()=>void; soundEnabled?:boolean; }

export const CakeSection = ({ onNext, onBack, soundEnabled=true }: Props) => {
  const [blown, setBlown] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  // Live RMS bar for visual feedback
  const [rmsLevel, setRmsLevel] = useState(0);
  const streamRef = useRef<MediaStream|null>(null);
  const ctxRef = useRef<AudioContext|null>(null);
  const rafRef = useRef<number|null>(null);
  const blownRef = useRef(false);
  const { canvasRef, fire: firePoppers } = usePartyPoppers();

  const stars = useMemo(()=>Array.from({length:24}).map((_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    r:0.5+Math.random()*1.5, dur:2+Math.random()*3, delay:Math.random()*4,
  })),[]);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current=null;
    streamRef.current?.getTracks().forEach(t=>t.stop());
    streamRef.current=null;
    ctxRef.current?.close().catch(()=>{});
    ctxRef.current=null;
  };

  const triggerBlow = () => {
    if (blownRef.current) return;
    blownRef.current=true;
    setBlown(true);
    setRmsLevel(0);
    firePoppers();
    if (soundEnabled) playCelebrationSound();
    cleanup();
  };

  const handleMicClick = () => {
    if (!navigator.mediaDevices?.getUserMedia) { setMicState("unsupported"); return; }
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    let ctx: AudioContext;
    try { ctx = new AC(); ctxRef.current = ctx; }
    catch { setMicState("unsupported"); return; }
    setMicState("requesting");
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(async (stream) => {
        streamRef.current = stream;
        if (ctx.state === "suspended") await ctx.resume();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        setMicState("listening");
        let sustained = 0;
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i=0;i<data.length;i++){const v=(data[i]-128)/128;sum+=v*v;}
          const rms = Math.sqrt(sum/data.length);

          // Update visual bar
          setRmsLevel(Math.min(1, rms * 8));

          // ── SENSITIVITY FIX: was rms>0.16 sustained>3, now much easier ──
          if (rms > 0.04) {
            sustained++;
            if (sustained > 2) { triggerBlow(); return; }
          } else {
            sustained = Math.max(0, sustained - 1);
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch(() => setMicState("denied"));
  };

  useEffect(() => () => cleanup(), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Jost:wght@300;400&display=swap');
        @keyframes twinkle{0%,100%{opacity:0.1}50%{opacity:0.9}}
        @keyframes floatCake{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes wishGlow{0%,100%{text-shadow:0 0 20px hsl(340 80% 70%/0.5),0 0 40px hsl(320 70% 60%/0.3)}50%{text-shadow:0 0 35px hsl(340 80% 78%/0.9),0 0 70px hsl(320 70% 65%/0.6)}}
        @keyframes micPulse{0%,100%{box-shadow:0 0 0 0 hsl(340 80% 65%/0.7)}60%{box-shadow:0 0 0 9px hsl(340 80% 65%/0)}}
        @keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
      `}</style>

      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}/>

      <section style={{
        position:"relative", display:"flex", minHeight:"100vh", width:"100%",
        flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden",
        background:"radial-gradient(ellipse 80% 70% at 50% 0%,hsl(295 60% 14%) 0%,hsl(330 50% 10%) 50%,hsl(340 55% 8%) 100%)",
        padding:"28px 20px 44px", fontFamily:"'Jost',sans-serif",
      }}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} preserveAspectRatio="none">
          {stars.map(s=>(
            <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
              style={{animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`}}/>
          ))}
        </svg>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",
          background:"radial-gradient(ellipse 60% 40% at 20% 80%,hsl(340 80% 30%/0.2) 0%,transparent 70%),radial-gradient(ellipse 50% 35% at 80% 20%,hsl(280 70% 30%/0.18) 0%,transparent 65%)"}}/>

        <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}
          style={{textAlign:"center",marginBottom:"4px"}}>
          <h2 style={{
            fontFamily:"'Playfair Display',serif", fontSize:"clamp(20px,5vw,32px)",
            fontWeight:400, fontStyle:"italic", color:"hsl(330 70% 92%)", margin:0,
            letterSpacing:"0.01em", textShadow:"0 0 30px hsl(330 80% 65%/0.45)",
          }}>Make a wish, Deva 🐼…</h2>
          <p style={{marginTop:"6px",fontSize:"13px",color:"hsl(330 45% 72%)",letterSpacing:"0.07em",textTransform:"uppercase"}}>
            blow out the candle
          </p>
        </motion.div>

        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{duration:1,delay:0.2,ease:[0.22,1,0.36,1]}}
          style={{animation:"floatCake 5s ease-in-out 1s infinite",marginTop:"4px"}}>
          <CakeSVG blown={blown}/>
        </motion.div>

        {/* Live breath meter shown while listening */}
        <AnimatePresence>
          {micState==="listening" && !blown && (
            <motion.div key="meter" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{marginTop:"12px",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
              <p style={{margin:0,fontSize:"12px",color:"hsl(330 50% 72%)",letterSpacing:"0.05em"}}>
                💨 blow gently…
              </p>
              <div style={{width:"140px",height:"8px",borderRadius:"999px",background:"hsl(330 40% 20%)",overflow:"hidden"}}>
                <div style={{
                  height:"100%", borderRadius:"999px",
                  width:`${Math.round(rmsLevel*100)}%`,
                  background:"linear-gradient(90deg,hsl(330 80% 65%),hsl(310 80% 70%))",
                  transition:"width 0.08s ease",
                }}/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {micState==="requesting" && (
            <motion.div key="r" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{marginTop:"10px",fontSize:"13px",color:"hsl(330 55% 75%)"}}>
              Requesting microphone…
            </motion.div>
          )}
          {(micState==="denied"||micState==="unsupported") && (
            <motion.div key="d" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{marginTop:"10px",fontSize:"13px",color:"hsl(340 60% 72%)",display:"flex",alignItems:"center",gap:"6px"}}>
              🎤 Mic unavailable — tap "Blow Candle" below
            </motion.div>
          )}
          {micState==="idle"&&!blown && (
            <motion.div key="i" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{marginTop:"10px",fontSize:"13px",color:"hsl(330 45% 68%)"}}>
              Tap 🎤 to blow via microphone
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.55,duration:0.7}}
          style={{marginTop:"14px",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap",justifyContent:"center"}}>
          <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
          {!blown ? (
            <>
              {micState==="idle" && <GlowButton onClick={handleMicClick}>🎤 Blow via Mic</GlowButton>}
              <GlowButton onClick={triggerBlow}>💨 Blow Candle</GlowButton>
            </>
          ) : (
            <GlowButton onClick={onNext}>Continue →</GlowButton>
          )}
        </motion.div>

        <AnimatePresence>
          {blown && (
            <motion.div initial={{opacity:0,y:22,scale:0.93}} animate={{opacity:1,y:0,scale:1}}
              transition={{delay:0.45,duration:0.95,ease:[0.16,1,0.3,1]}}
              style={{marginTop:"22px",textAlign:"center"}}>
              <p style={{
                fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                fontSize:"clamp(19px,4.5vw,27px)", color:"hsl(340 80% 90%)", margin:0,
                animation:"wishGlow 2.5s ease-in-out infinite",
              }}>May all your wishes come true ❤️</p>
              <p style={{marginTop:"7px",fontSize:"13px",color:"hsl(330 45% 68%)",letterSpacing:"0.05em"}}>
                Your wish is on its way to the stars ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default function Preview() {
  return <div style={{width:"100%",height:"100vh"}}><CakeSection onNext={()=>{}} onBack={()=>{}}/></div>;
}