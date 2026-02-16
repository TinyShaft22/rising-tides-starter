"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SKILLS_COUNT } from "@/lib/config";

const faqs = [
  {
    question: 'What exactly is a "skill" for Claude Code?',
    answer:
      "A skill is a markdown file that teaches Claude workflows, patterns, and best practices for a specific domain — like React development, Stripe payments, or SEO auditing. Claude reads the skill and applies that knowledge to your tasks. No plugins or extensions needed.",
  },
  {
    question: "Do I need Claude Max or Pro?",
    answer:
      "You need a Claude Code subscription (Claude Max at $100/mo or Claude Pro at $20/mo with limited usage). The skills pack works on top of Claude Code — it's the knowledge layer, not a separate tool.",
  },
  {
    question: 'How does "~7% context cost" work?',
    answer:
      `Claude Code has a 200k token context window. Most skill collections burn 20-40% of that just loading. Rising Tides is architected so skills load on-demand — you get access to all ${SKILLS_COUNT} skills while using under 7% of your context. The rest stays free for actual work.`,
  },
  {
    question: "What if I only need a few skills?",
    answer:
      "Run /recommend skills in any project. It analyzes your codebase and recommends only the relevant skills to import. You pull what you need, nothing more.",
  },
  {
    question: "What OS do you support?",
    answer:
      "Mac, Linux, and Windows. Each platform has a dedicated setup script that installs everything — Node.js, Git, Python, Claude Code, and the skills pack. If you already have some prerequisites, it detects them and skips ahead. New users and existing Claude Code users run the same script.",
  },
  {
    question: "Do I get updates?",
    answer:
      "Yes. You get access to the private GitHub repo. Pull updates anytime. New skills are added regularly.",
  },
  {
    question: "What if I have trouble installing?",
    answer:
      "Drop the GitHub repo into Claude Desktop or paste it into Claude.ai and ask it to help you troubleshoot. The setup scripts handle most cases automatically, but Claude can walk you through any edge cases. That's the beauty of using an AI-powered tool — the documentation is self-helping.",
  },
  {
    question: "Can't I just install a bunch of skills myself?",
    answer:
      `You could, but you'd be trading hours of work for a $99 shortcut. Rising Tides isn't just a skill collection — it's ${SKILLS_COUNT} tools that have been security audited, tested for context efficiency, and organized for on-demand loading. If you install skills from random GitHub repos, you should be doing security audits on every skill, MCP, and plugin yourself. We've already done that work. This is a quality-of-life improvement that gives you vetted tools without the risk.`,
  },
  {
    question: "What happens after I buy?",
    answer:
      "You'll receive an email with an invite to the private GitHub repo and setup instructions. For Done-With-You, you'll also get a Cal.com link to book your 45-minute call.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-[#2a2a3a] last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-amber-500 transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-mono text-sm tracking-wider uppercase">FAQ</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#2a2a3a] bg-[#151520]/50 backdrop-blur-sm px-6"
        >
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} {...faq} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
