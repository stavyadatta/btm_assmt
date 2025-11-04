import React from "react";

interface MascotProps {
  name: string;
  image: string; // e.g. "/images/her.jpg"
}

export function Mascot({ name, image }: MascotProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6">
      {/* Big circular photo */}
      <div className="flex justify-center w-full">
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <div className="font-extrabold text-[#6B3A00] text-lg sm:text-xl">{name}</div>
        <div className="text-xs sm:text-sm text-[#7a4b00]">💛 our universe in one smile 💛</div>
      </div>
    </div>
  );
}

