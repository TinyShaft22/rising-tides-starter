"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download, MessageSquare, Wand2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Download,
    title: "Install",
    description: "One command installs Node.js, Git, Claude Code — everything. Already set up? It skips what you have and updates the rest.",
  },
  {
    number: "2",
    icon: MessageSquare,
    title: "Describe your task",
    description: '"Help me set up Stripe payments" or "Build a React dashboard" — just talk to Claude like normal.',
  },
  {
    number: "3",
    icon: Wand2,
    title: "Claude handles the rest",
    description: "The right skills activate automatically. Best practices, CLI commands, MCP tools — all loaded on demand.",
  },
];

export function HowItWorks() {
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
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">How It Works</span>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1 md:flex-none p-8 rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 backdrop-blur-sm text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold font-mono text-amber-500">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.15 }}
                  className="hidden md:flex items-center justify-center w-10"
                >
                  <ArrowRight className="w-6 h-6 text-amber-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
