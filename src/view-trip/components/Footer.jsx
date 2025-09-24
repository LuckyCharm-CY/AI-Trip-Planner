import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:bg-neutral-950/60 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Top row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.svg" alt="Trip Planner" className="h-8 w-auto" />
            <span className="text-base font-semibold tracking-tight dark:text-neutral-100">
              Trip Planner
            </span>
          </Link>



          {/* Socials */}
          <div className="flex items-center gap-4 text-gray-600 dark:text-neutral-400">
            <a
              href="https://github.com/LuckyCharm-CY"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-gray-900 dark:hover:text-neutral-200"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/chewyeejing"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gray-900 dark:hover:text-neutral-200"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:chewyj.24@gmail.com"
              aria-label="Email"
              className="hover:text-gray-900 dark:hover:text-neutral-200"
            >
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row dark:text-neutral-500">
          <p>© {year} Chew Yee Jing. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-gray-700 dark:hover:text-neutral-300"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
