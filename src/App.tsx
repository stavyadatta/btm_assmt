import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFloatingHearts } from "@/hooks/useFloatingHearts";
import { confetti } from "@/lib/confetti";
import { bunnyOutline, clamp, easeInOut, heartPoints, lerpPoints, ringPoints } from "@/lib/shapes";
import { BlockPhoto, type GalleryItem } from "@/components/BlockPhoto";
import { Mascot } from "@/components/Mascot";

export default function App() {
  const YELLOW = "#FFD84D";
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [heartsOn, setHeartsOn] = useState(true);
  const [shape, setShape] = useState(0);
  useEffect(() => {
	  const interval = setInterval(() => {
	    setShape((prev) => (prev === 0 ? 1 : 0));
  }, 1000);
  return () => clearInterval(interval);
}, []);

  const [shuffleKey, setShuffleKey] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setShuffleKey((k) => k + 1);
  }, 60000); // <-- 15000ms = 15 seconds; make 60000 for 1 minute, etc.
  return () => clearInterval(interval);
}, []);
  const heartLayerRef = useFloatingHearts(heartsOn);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);

  // Anniversary start date
  const startDate = useMemo(() => new Date("2022-12-11:00:00+11:00"), []);
  const [daysTogether, setDaysTogether] = useState(0);
  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - startDate.getTime();
      setDaysTogether(Math.floor(diff / (1000 * 60 * 60 * 24)));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [startDate]);

  // Particle morph canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, DPR = 1;

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    const onR = () => resize();
    window.addEventListener("resize", onR);

    const baseHeart = heartPoints(700);
    const baseRing = ringPoints(700);
    const baseBunny = bunnyOutline(700);

    let current = baseHeart;
    let from = baseHeart;
    let to = baseBunny;
    let t = 0;

    let lastShape = shape;
    function syncTargets() {
      const idx = shape % 2;
      if (idx === 0) { from = current; to = baseHeart; }
      if (idx === 1) { from = current; to = baseBunny; }
      t = 0;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.7, H * 0.1, 30, W * 0.5, H * 0.2, Math.max(W, H));
      g.addColorStop(0, "#FFF6B0");
      g.addColorStop(0.4, YELLOW);
      g.addColorStop(1, "#F2A900");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 80; i++) {
        const x = ((i * 47) % 100) / 100 * W;
        const y = ((i * 89) % 100) / 100 * H;
        const r = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (shape !== lastShape) {
        lastShape = shape;
        syncTargets();
      }
      if (t < 1) t += 0.02;
      const k = easeInOut(clamp(t, 0, 1));
      current = lerpPoints(from, to, k);

      const cx = W / 2, cy = H / 2, s = Math.min(W, H) * 0.7;
      ctx.fillStyle = "#FF5DA2";
      for (let i = 0; i < current.length; i += 2) {
        const [px, py] = current[i];
        const x = cx + (px - 0.5) * s;
        const y = cy + (py - 0.5) * s;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
    return () => window.removeEventListener("resize", onR);
  }, [shape]);

  const PASSWORD = "bunnylove";
  const handleUnlock = () => {
    if (pw.trim() === PASSWORD) {
      setUnlocked(true);
      if (confettiRef.current) confetti(confettiRef.current, 80);
    }
  };

  const photos: GalleryItem[] = [
  {
    id: 1,
    caption: "Our first day in Amsterdam!",
    title: "You look sooo pretty!!!",
    description: "Rob did so much effort to get the shot",
    image: "/images/gallery/amsterdam_nice.jpg",
  },
  {
    id: 2,
    caption: "When we learned how to REAADDDD",
    title: "Only one book in a year!!!",
    description: "Asli Gyann bunny popper",
    image: "/images/gallery/books_read.jpg",
  },
  {
    id: 3,
    caption: "When you came to my home for 2nd timee",
    title: "You were looking like a dreaaamm",
    description: "KITNA SAANS legi BUNNY POPPER, hey lord",
    image: "/images/gallery/first_dates.jpg",
  },
  {
    id: 4,
    caption: "When we discovered ambassadors",
    title: "KITNI KHUUSH THIII",
    description: "Ambassadors dekhne ki khushi",
    image: "/images/gallery/sunny_ambass.jpg",
  },
  {
    id: 5,
    caption: "Our besstt day in Europe!",
    title: "You were looking like....cartooon",
    description: "JOKE BUNNY POPPER MAZAAAKK YOU WERE LOOKING SO PUCHU",
    image: "/images/gallery/amsterdam_puchu.jpg",
  },
  {
    id: 6,
    caption: "TUU TOH ARTT HAI",
    title: "KAISE MIL GAYI ITNI PUCHU",
    description: "HUHHH, honestly......I MISS YOUUUUUU NOW",
    image: "/images/gallery/versailles.jpg",
  },
  {
    id: 7,
    caption: "Damn we look so young",
    title: "Somehow also innocent??",
    description: "TUNE MUJHE BIGAAD DIYAA",
    image: "/images/gallery/kasauli.jpg",
  },
  {
    id: 8,
    caption: "YOUU MY HOMEE",
    title: "IN OUR HEHEH mode",
    description: "DID I MENTION THAT I LOVE YOU LIKE A LOT LOT",
    image: "/images/gallery/at_home_puchu.jpg",
  },
];

  const orbitRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll("[data-orbit]"));
    items.forEach((it, idx) => {
      const delay = (idx * 0.7) % 7;
      (it as HTMLElement).animate(
        [
          { transform: "rotate(0deg) translateY(0)", offset: 0 },
          { transform: "rotate(3deg) translateY(-6px)", offset: 0.5 },
          { transform: "rotate(0deg) translateY(0)", offset: 1 },
        ],
        { duration: 4000 + idx * 120, delay: delay * 100000, iterations: Infinity, easing: "ease-in-out" }
      );
    });
  }, [shuffleKey]);

  const shuffledPhotos = useMemo(() => {
    const arr = [...photos];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [photos, shuffleKey]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(1200px_600px_at_70%_0%,#FFE88C_10%,#FFD84D_40%,#FFC947_60%,#F9B233_70%,#EFA828_80%,#E59B1C_88%,#D18900_100%),radial-gradient(200px_200px_at_10%_20%,rgba(255,255,255,.35),transparent_60%),radial-gradient(400px_400px_at_90%_60%,rgba(255,255,255,.2),transparent_60%),linear-gradient(180deg,#FFEF9A_0%,#FFD84D_40%,#F2A900_100%)] text-[#2B2054]">
      <div ref={heartLayerRef} className="pointer-events-none fixed inset-0 z-10" />
      <canvas ref={confettiRef} className="pointer-events-none fixed inset-0 z-20" />

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#FFF8C4]/80 border-b-2 border-dashed border-black/5">
        <div className="py-3 text-center">
          <div className="font-extrabold text-[clamp(28px,6.2vw,38px)] leading-tight text-[#6B3A00] drop-shadow-[0_2px_0_rgba(255,255,255,.7)]">
            BUNNY TWEETY MULTIVERSE
          </div>
          <div className="text-xs text-[#7a4b00] -mt-1">Because YOU IS A VERY BIG UNIVERSE UNIVERSE TO MEEEEE</div>
        </div>
      </header>

      <section className="relative z-0">
        <div className="relative w-full h-[46vh]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              className="px-4 py-2 rounded-full bg-white/70 border-2 border-yellow-300 font-extrabold text-[#6B3A00]"
            >
	    HAPPY BIRTHDAYYYY BUNNY POOPYYY POOOPPEEERRRR
            </motion.div>
            <div className="mt-2 text-sm text-[#6B3A00]">ITSSSS BEEN {daysTogether} days since I FIRSSSTT EVER SAWWW YOUUUU</div>
            <div className="mt-3 flex gap-2">
              <Button variant="pink" onClick={() => setShuffleKey((k) => k + 1)}>Shuffle Gallery</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-0 mt-4">
	  <Mascot name="BUNNY POOOPPOOOOOO" image="/images/bunny.jpg" />
      </section>

      <section className="px-3 mt-3">
        <div className="rounded-2xl border-2 border-yellow-400 bg-white/70 shadow-[0_6px_24px_rgba(150,95,0,.12)] p-3 flex items-center gap-2">
          <span className="text-xs font-extrabold px-2 py-1 rounded-full bg-[#FFF3CD] border-2 border-[#F2A900]">
            Because BUNNY POPPER IS THE BEST BUNNY BUNNY POPPER
          </span>
          <div className="text-sm leading-tight">TUUU NAAA MUJHE MILLL</div>
        </div>
      </section>

     <section className="px-3 mt-4 pb-28" ref={orbitRef}>
  <div className="columns-2 gap-2 [column-fill:balance] sm:columns-3 md:columns-4">
    {shuffledPhotos.map((p) => (
      <figure key={p.id} data-orbit className="break-inside-avoid mb-2">
        <BlockPhoto item={p} />
      </figure>
    ))}
  </div>
</section>

      <nav className="fixed bottom-2 left-0 right-0 z-40 flex justify-center">
        <div className="flex gap-2 bg-white/70 border-2 border-yellow-300 rounded-2xl px-2 py-2 shadow-xl backdrop-blur-md">
          <Button onClick={() => setShuffleKey((k) => k + 1)}>Shuffle</Button>
          <Button variant="pink" onClick={() => setHeartsOn((v) => !v)}>Hearts: {heartsOn ? "On" : "Off"}</Button>
          <Button variant="white" className="">Top</Button>
        </div>
      </nav>

      <AnimatePresence>
        {!unlocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center"
            style={{ background: "radial-gradient(120vw 120vh at 50% 20%, #FFF9D9, #FFE27A, #F2A900)" }}
          >
            <div className="w-[92vw] max-w-[420px] bg-[#fff9e6] border-4 border-dashed border-[#F2A900] rounded-3xl p-5 text-center shadow-2xl">
              <h1 className="text-2xl font-extrabold text-[#6B3A00]">🔐 Bunny Tweety Multiverse</h1>
              <p className="text-sm text-[#8a5a00] mt-1">Welcome! Please enter the secret password to enter. 🗝️</p>
              <div className="mt-3 flex gap-2 justify-center">
                <input
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-2/3 px-3 py-3 rounded-xl border-2 border-yellow-400 outline-none"
                />
                <Button onClick={handleUnlock}>Enter</Button>
              </div>
              <p className="text-[11px] opacity-70 mt-2">(Tip: change the password in code)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

