"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const terminalLines = [
  { type: "prompt", text: "> Help me set up Stripe payments" },
  { type: "response", text: "  ↳ Matched: ", highlight: "stripe-integration", suffix: " skill" },
  { type: "response", text: "  ↳ Loading CLI auth workflow..." },
  { type: "response", text: "  ↳ Configuring checkout, webhooks, products" },
  { type: "prompt", text: "> ", cursor: true },
];

export function Demo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= terminalLines.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section ref={ref} id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">See It In Action</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4">Skills activate automatically</h2>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#2a2a3a] bg-[#0d0d12] overflow-hidden mb-12"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#151520] border-b border-[#2a2a3a]">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-gray-500 text-sm font-mono">claude</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm sm:text-base">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={index < visibleLines ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3 }}
                className={`${index > 0 ? "mt-2" : ""} ${line.type === "prompt" ? "text-gray-300" : "text-gray-500"}`}
              >
                {line.type === "prompt" && (
                  <>
                    <span className="text-amber-500">{line.text.slice(0, 2)}</span>
                    <span className="text-white">{line.text.slice(2)}</span>
                    {line.cursor && <span className="terminal-cursor bg-amber-500 inline-block w-2 h-5 ml-1" />}
                  </>
                )}
                {line.type === "response" && (
                  <>
                    {line.text}
                    {line.highlight && <span className="text-amber-500">{line.highlight}</span>}
                    {line.suffix && <span>{line.suffix}</span>}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
