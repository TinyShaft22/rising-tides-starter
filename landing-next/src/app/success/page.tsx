"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          You're in!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-400 mb-12"
        >
          Welcome to Rising Tides. Here's what happens next.
        </motion.p>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-12"
        >
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-500 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Receipt on the way</h3>
              <p className="text-gray-400 text-sm">
                Stripe will send your receipt within a few minutes. Check your inbox (and spam folder).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-500 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Check your email for your license key</h3>
              <p className="text-gray-400 text-sm">
                Your welcome email with license key and setup instructions is on the way from{" "}
                <span className="text-white">nick@sunsetsystems.co</span>. Check your spam folder if you don't see it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 text-left">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-green-500 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Accept your GitHub invite</h3>
              <p className="text-gray-400 text-sm">
                You'll also receive a repo invite from <span className="text-white">github.com</span>. Accept it to access the private Rising Tides repo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Done-With-You bonus</h3>
              <p className="text-gray-400 text-sm">
                Purchased Done-With-You? Your email includes a Calendly link to book your 30-minute setup call with Nick.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://www.skool.com/rising-tides-9034"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-all"
          >
            Join the Community
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#2a2a3a] hover:border-amber-500/50 rounded-xl transition-all"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 rounded-xl bg-[#1a1a2e] border border-[#2a2a3a]"
        >
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">Didn't get your GitHub invite within 24 hours?</span>
            {" "}Email{" "}
            <a href="mailto:nick@sunsetsystems.co" className="text-amber-500 hover:underline">
              nick@sunsetsystems.co
            </a>
            {" "}with your order confirmation and GitHub username — we'll get you access right away.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
