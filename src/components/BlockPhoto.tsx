import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export type GalleryItem = {
  id: number;
  caption: string;         // short label under thumb
  title?: string;          // modal title
  description?: string;    // modal description
  image?: string;          // "/images/gallery/xxx.jpg"
};

type Props = { item: GalleryItem };

export function BlockPhoto({ item }: Props) {
  const [open, setOpen] = useState(false);
  const { caption, title, description, image } = item;

  // Optional: warn if image path missing
  useEffect(() => {
    if (!image) console.warn("BlockPhoto: missing image for", item);
  }, [image, item]);

  return (
    <>
      {/* Thumbnail */}
      <button
        onClick={() => setOpen(true)}
        className="relative block w-full h-40 sm:h-44 md:h-48 overflow-hidden rounded-2xl border-2 border-white/80 shadow-[0_8px_18px_rgba(120,80,0,.18)] bg-white"
      >
        {image ? (
          <img
            src={image}
            alt={caption}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.3"; }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.6),transparent_60%)]" />
        )}
        <div className="absolute bottom-0 left-0 right-0 text-white text-xs font-bold px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
          {caption}
        </div>
      </button>

      {/* Modal via portal so it always overlays */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full max-w-[560px] max-h-[90vh] rounded-2xl overflow-hidden bg-white"
                onClick={(e) => e.stopPropagation()} // don't close when clicking inside card
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 z-10 px-3 py-2 rounded-xl font-extrabold bg-white/90 text-[#6B3A00] border border-yellow-400"
                >
                  ✕
                </button>

                {image && (
                  <img
                    src={image}
                    alt={title || caption}
                    className="w-full h-[60vh] object-cover"
                  />
                )}

                <div className="p-4 text-center">
                  <h3 className="font-extrabold text-[#6B3A00]">
                    {title || caption}
                  </h3>
                  <p className="text-sm text-[#7a4b00] mt-1">
                    {description || "Our lovely memory 💛"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
