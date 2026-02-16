"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Cpu, Clock } from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Scattered skills",
    description: "You find a skill on GitHub, another on Twitter, paste from a blog post. Nothing works together. No consistency.",
  },
  {
    icon: Cpu,
    title: "Context bloat",
    description: "Load a few skills and suddenly you've burned 30% of your context window before writing a single line of code.",
  },
  {
    icon: Clock,
    title: "Hours of setup",
    description: "Every new project means configuring MCPs, hunting for the right skill files, and debugging broken integrations.",
  },
];

export function Problem() {
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
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">The Problem</span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 backdrop-blur-sm card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-gray-400 leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
