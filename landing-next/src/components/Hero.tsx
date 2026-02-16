"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Package } from "lucide-react";
import { SKILLS_COUNT, PLUGINS_COUNT, MCPS_COUNT } from "@/lib/config";

const stats = [
  { number: String(SKILLS_COUNT), label: "Skills", icon: Zap },
  { number: String(PLUGINS_COUNT), label: "Plugins", icon: Package },
  { number: "~7%", label: "Context Cost", icon: null },
  { number: "1", label: "Command Setup", icon: null },
];

export function Hero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
      {/* Animated glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a3a] bg-[#151520]/80 backdrop-blur-sm mb-8"
        >
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-300">Security Audited</span>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-amber-500 font-mono">{SKILLS_COUNT} skills • {PLUGINS_COUNT} plugins • {MCPS_COUNT} MCPs</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Stop building skills.
          <br />
          <span className="gradient-text">Start shipping code.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          A curated library of {SKILLS_COUNT} production-ready skills for Claude Code — from React patterns to Stripe integration,
          SEO audits to deployment pipelines. One install. ~7% context cost.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#pricing"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-all glow-amber hover:scale-105"
          >
            Get the Pack
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2a2a3a] hover:border-amber-500/50 rounded-xl transition-all hover:bg-[#151520]"
          >
            See It in Action
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-500">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
              {index < stats.length - 1 && (
                <div className="hidden sm:block w-px h-10 bg-[#2a2a3a]" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[#2a2a3a] flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-amber-500 rounded-full" />
        </motion.div>
      </motion.div>
    </header>
  );
}
