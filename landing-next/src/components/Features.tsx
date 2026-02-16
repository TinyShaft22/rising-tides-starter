"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Gauge, Puzzle, Terminal, Zap, Layers } from "lucide-react";
import { SKILLS_COUNT, PLUGINS_COUNT, CLIS_COUNT } from "@/lib/config";

const features = [
  {
    number: "01",
    icon: Sparkles,
    title: "Auto-discovery",
    description: "Claude matches your request to the right skill using a lightweight index. No manual loading. No slash commands needed.",
    highlight: true,
  },
  {
    number: "02",
    icon: Gauge,
    title: "~7% context cost",
    description: `Access all ${SKILLS_COUNT} skills while using under 7% of your context window. Skills load on-demand, so your context stays free for actual work.`,
    highlight: false,
  },
  {
    number: "03",
    icon: Puzzle,
    title: `${PLUGINS_COUNT} MCP plugins`,
    description: "Pre-configured bundles for React, Playwright, Stripe, GitHub, video generation, and more. Zero-config MCP setup.",
    highlight: false,
  },
  {
    number: "04",
    icon: Terminal,
    title: `${CLIS_COUNT} CLI integrations`,
    description: "GitHub, Stripe, Vercel, Netlify, Firebase, Supabase, Google Cloud, Jira, Datadog — auth flows and workflows documented.",
    highlight: false,
  },
  {
    number: "05",
    icon: Zap,
    title: "One-command install",
    description: "Installs everything: Node.js, Git, Python, Claude Code, and the skills pack. Already have some? It skips what's installed and updates Claude Code to the latest version.",
    highlight: false,
  },
  {
    number: "06",
    icon: Layers,
    title: "Project-level control",
    description: "Pull only the skills you need per project with /recommend skills. Keep projects lean. No bloat.",
    highlight: false,
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">The Fix</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">One library. Everything works.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Rising Tides is a curated, tested, indexed collection of skills that Claude auto-discovers and loads on demand.
            You describe your task — Claude picks the right skill.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-2xl border bg-[#151520]/50 backdrop-blur-sm card-hover ${
                feature.highlight
                  ? "border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent"
                  : "border-[#2a2a3a]"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-amber-500 font-mono text-sm">{feature.number}</span>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
