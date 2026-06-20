"use client";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";


import React from "react";
import Link from "next/link";
import {  HelpCircle, ShieldCheck, Globe, GitBranchPlus, TableRowsSplitIcon, Link2 } from "lucide-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Kanban Board", href: "#board" },
      { label: "Pricing Plan", href: "#pricing" },
      { label: "Roadmap", href: "#roadmap" },
    ],
    resources: [
      { label: "Documentation", href: "#docs" },
      { label: "Guides & Tutorials", href: "#guides" },
      { label: "API Reference", href: "#api" },
      { label: "System Status", href: "#status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Settings", href: "#cookies" },
      { label: "Security Profile", href: "#security" },
    ],
  };

  const faqs = [
    {
      q: "Is my personal dashboard data encrypted?",
      a: "Yes, all data streams are encrypted both at rest and in transit using enterprise-grade TLS 1.3 protocols.",
    },
    {
      q: "Can I collaborate with external users?",
      a: "Absolutely. Project owners can securely invite external members to specific boards using single-tenant access links.",
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto font-sans">
      {/* Top Multi-Column Matrix Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Core Brand Identity Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                P
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">ProjectWorkspace</span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 max-w-sm leading-relaxed font-medium">
              The next-generation centralized task hub engineered to streamline agile sprint planning, real-time workspace updates, and contextual asynchronous collaboration.
            </p>
            {/* Social Group Handles */}
            <div className="flex items-center gap-4 pt-2 text-slate-400">
              <Link href="#" target="_blank" className="hover:text-slate-600 transition-colors"><FaLinkedin  size={16} /></Link>
              <Link href="https://github.com/Ravijoshi28" className="hover:text-slate-600 transition-colors"><FaGithub  size={16} /></Link>
              <Link href="#" className="hover:text-slate-600 transition-colors"><FaTwitter  size={16} /></Link>
            </div>
          </div>

          {/* Column 2: Product Links Map */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links Map */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Separator Line */}
        <hr className="my-10 border-slate-100" />

        {/* Inline Compact FAQ Section */}
        <div className="bg-slate-50/50 rounded-2xl p-5 md:p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={16} className="text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs md:text-sm font-semibold text-slate-800 leading-snug">
                  {faq.q}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright Ribbon Block */}
      <div className="bg-slate-50 border-t border-slate-200/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] md:text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <span>&copy; {currentYear} ProjectWorkspace Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1 select-none">
              <Globe size={12} />
              <span>US-EAST Production Region</span>
            </div>
            <div className="flex items-center gap-1 select-none text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
              <ShieldCheck size={12} />
              <span>SOC2 Type II Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}