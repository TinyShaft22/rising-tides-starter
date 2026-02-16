"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-t border-[#2a2a3a] py-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-amber-500 text-2xl">~</span>
            <span>Rising Tides</span>
          </div>

          <div className="flex items-center gap-6 text-gray-400">
            <a
              href="https://www.skool.com/rising-tides-9034"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Community
            </a>
            <a
              href="https://github.com/SunsetSystemsAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:nick@sunsetsystems.co"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="text-gray-500 text-sm">
            &copy; 2026 Rising Tides. Built with Claude Code, naturally.
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
