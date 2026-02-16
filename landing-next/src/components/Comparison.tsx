"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";
import { SKILLS_COUNT } from "@/lib/config";

const comparisons = [
  {
    feature: "Finding skills",
    diy: "Scattered across GitHub, blogs, Twitter",
    rt: `${SKILLS_COUNT} curated, tested, indexed`,
  },
  {
    feature: "Context cost",
    diy: "Unknown — often 20-40%",
    rt: "Under 7% — tested and measured",
  },
  {
    feature: "MCP setup",
    diy: "Manual JSON editing per project",
    rt: "Auto-configured via plugins",
  },
  {
    feature: "Discovery",
    diy: "Remember what you installed",
    rt: "Auto-matched by triggers",
  },
  {
    feature: "Setup time",
    diy: "Hours per project",
    rt: "One command, done",
  },
  {
    feature: "Security audit",
    diy: "None — trust random repos",
    rt: "1,000+ files scanned, verified safe",
  },
];

export function Comparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">Why This Exists</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4">DIY vs. Rising Tides</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#2a2a3a] overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-[#151520]">
            <div className="p-4 border-b border-r border-[#2a2a3a]"></div>
            <div className="p-4 border-b border-r border-[#2a2a3a] text-center">
              <span className="text-gray-400 font-medium">Do It Yourself</span>
            </div>
            <div className="p-4 border-b border-[#2a2a3a] text-center bg-amber-500/10">
              <span className="text-amber-500 font-medium">Rising Tides</span>
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="grid grid-cols-3"
            >
              <div className="p-4 border-b border-r border-[#2a2a3a] font-medium text-gray-300">
                {row.feature}
              </div>
              <div className="p-4 border-b border-r border-[#2a2a3a] text-gray-500 flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">{row.diy}</span>
              </div>
              <div className="p-4 border-b border-[#2a2a3a] text-gray-300 bg-amber-500/5 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm">{row.rt}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
