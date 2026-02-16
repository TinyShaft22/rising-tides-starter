"use client";

import { motion } from "framer-motion";

export function VideoHero() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[#2a2a3a] overflow-hidden bg-[#151520] shadow-2xl shadow-amber-500/10"
        >
          <video
            src="/video/rising-tides-promo.mp4"
            poster="/video/poster.png"
            preload="metadata"
            muted
            loop
            playsInline
            controls
            className="w-full aspect-video"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-gray-500 text-sm mt-4"
        >
          See the full skills pack in action
        </motion.p>
      </div>
    </section>
  );
}
