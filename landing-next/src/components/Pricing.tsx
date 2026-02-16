"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Users, Video, Star } from "lucide-react";
import { SKILLS_COUNT, PLUGINS_COUNT, CLIS_COUNT } from "@/lib/config";

const plans = [
  {
    name: "Pro",
    price: "$99",
    description: "Everything you need to supercharge Claude Code",
    features: [
      `All ${SKILLS_COUNT} production-ready skills`,
      `${PLUGINS_COUNT} MCP plugin bundles`,
      `${CLIS_COUNT} CLI integration guides`,
      "One-command setup (installs Claude Code + all prerequisites)",
      "Private GitHub repo access",
      "Lifetime updates",
      "Community access",
    ],
    cta: "Get Pro",
    href: "https://buy.stripe.com/3cI00j5eQcfh6el3qnf3a04",
    highlight: false,
    icon: null,
  },
  {
    name: "Done-With-You",
    price: "$399",
    originalPrice: "$499",
    limitedTime: true,
    description: "Get set up on a call with Nick, creator of Rising Tides Pack",
    badge: "Most Popular",
    features: [
      "Everything in Pro",
      "45-minute 1:1 setup call",
      "Full installation on your machine",
      "MCP + memory configuration",
      "First project walkthrough",
      "Tips, tricks & best practices",
      "Priority community access",
    ],
    cta: "Book the Call",
    href: "https://buy.stripe.com/5kQeVd7mYgvx5ah6Czf3a06",
    highlight: true,
    icon: Video,
  },
  {
    name: "Team",
    price: "$399",
    originalPrice: "$495",
    priceNote: "up to 5 seats",
    savings: "Save $96 vs 5× Pro",
    description: "For teams building with Claude Code",
    features: [
      "Everything in Pro",
      "5 GitHub account access",
      "Consolidated team billing",
      "Priority community access",
      "Team onboarding guide",
      "Slack support channel",
    ],
    cta: "Get Team Access",
    href: "https://buy.stripe.com/9B64gzgXy4MP8mtaSPf3a05",
    highlight: false,
    icon: Users,
  },
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">One purchase. Lifetime access.</h2>
          <p className="text-gray-400 text-lg">No subscriptions. No recurring fees. Pay once, use forever.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border backdrop-blur-sm ${
                plan.highlight
                  ? "border-amber-500 bg-gradient-to-br from-amber-500/10 to-purple-500/10"
                  : "border-[#2a2a3a] bg-[#151520]/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 rounded-full text-black text-sm font-medium">
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {plan.icon && <plan.icon className="w-5 h-5 text-amber-500" />}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  {plan.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">{plan.originalPrice}</span>
                  )}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceNote && <span className="text-gray-500 text-sm">{plan.priceNote}</span>}
                  {plan.limitedTime && (
                    <span className="text-xs text-amber-500 font-medium uppercase tracking-wide">Limited time</span>
                  )}
                  {plan.savings && (
                    <span className="text-xs text-green-500 font-medium">{plan.savings}</span>
                  )}
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {feature.includes("community access") ? (
                      <span className="text-gray-300">
                        {feature.replace("community access", "")}
                        <a
                          href="https://www.skool.com/rising-tides-9034/about"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          community access
                        </a>
                      </span>
                    ) : (
                      <span className="text-gray-300">{feature}</span>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full py-3 px-6 rounded-xl font-medium text-center transition-all ${
                  plan.highlight
                    ? "bg-amber-500 hover:bg-amber-600 text-black glow-amber hover:scale-105"
                    : "border border-[#2a2a3a] hover:border-amber-500/50 hover:bg-[#1a1a25]"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            Secure checkout via Stripe • Instant repo access • Lifetime updates
          </p>
        </motion.div>
      </div>
    </section>
  );
}
