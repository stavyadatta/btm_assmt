import { useEffect, useRef } from "react";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function useFloatingHearts(enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let stop = false;

    function spawn() {
      if (stop) return;
      const d = document.createElement("div");
      d.className = "absolute w-3 h-3";
      const size = 8 + Math.random() * 20;
      d.style.width = `${size}px`;
      d.style.height = `${size}px`;
      d.style.left = `${Math.random() * 100}%`;
      d.style.bottom = `-20px`;
      d.style.transform = "rotate(45deg)";
      const hue = 330 + Math.random() * 30;
      d.style.background = `hsl(${Math.floor(hue)} 90% 65%)`;
      d.style.opacity = "0.9";
      d.style.borderRadius = "2px";
      const before = document.createElement("div");
      const after = document.createElement("div");
      [before, after].forEach((o) => {
        o.style.position = "absolute";
        o.style.width = `${size}px`;
        o.style.height = `${size}px`;
        o.style.background = d.style.background;
        o.style.borderRadius = "50%";
      });
      before.style.left = `-${size / 2}px`;
      after.style.top = `-${size / 2}px`;
      d.appendChild(before);
      d.appendChild(after);
      el.appendChild(d);

      const dur = 7000 + Math.random() * 5000;
      const start = performance.now();
      function anim(t: number) {
        const k = clamp((t - start) / dur, 0, 1);
        d.style.transform = `translateY(${-k * 110}vh) rotate(45deg)`;
        d.style.opacity = `${1 - k}`;
        if (k < 1 && !stop) requestAnimationFrame(anim);
        else d.remove();
      }
      requestAnimationFrame(anim);
      setTimeout(spawn, 450 + Math.random() * 400);
    }

    spawn();
    return () => {
      stop = true;
      if (el) el.innerHTML = "";
    };
  }, [enabled]);

  return ref;
}

