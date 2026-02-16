"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SKILLS_COUNT, CATEGORIES_COUNT } from "@/lib/config";

const categories = [
  { count: 16, name: "Marketing & SEO" },
  { count: 11, name: "Documentation" },
  { count: 11, name: "Workflow" },
  { count: 9, name: "Utilities" },
  { count: 7, name: "Backend" },
  { count: 7, name: "Frontend" },
  { count: 7, name: "CRO" },
  { count: 6, name: "Architecture" },
  { count: 6, name: "Design" },
  { count: 5, name: "Integrations" },
  { count: 4, name: "Communication" },
  { count: 4, name: "Deployment" },
  { count: 1, name: "Payments" },
];

export function Categories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">What&apos;s Inside</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4">{SKILLS_COUNT} skills across {CATEGORIES_COUNT} categories</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className="px-4 py-2 rounded-full border border-[#2a2a3a] bg-[#151520]/50 backdrop-blur-sm hover:border-amber-500/50 transition-colors"
            >
              <span className="text-amber-500 font-mono font-bold mr-2">{category.count}</span>
              <span className="text-gray-300">{category.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
