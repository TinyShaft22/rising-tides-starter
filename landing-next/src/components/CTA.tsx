"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { SKILLS_COUNT, PLUGINS_COUNT } from "@/lib/config";

export function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Stop cobbling together skills.
            <br />
            <span className="gradient-text">Start with a system that works.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            {SKILLS_COUNT} skills. {PLUGINS_COUNT} plugins. ~7% context. One command.
          </p>
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 px-10 py-5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl text-lg transition-all glow-amber hover:scale-105"
          >
            Get Rising Tides
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
