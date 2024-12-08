"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";

export default function Home() {
  const { data: session } = useSession();

  const handleGetStarted = () => {
    if (session) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/auth/signin";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Master Your Vocabulary with
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                {" "}
                AI-Powered Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              WordWise uses advanced AI to personalize your vocabulary learning
              journey. Learn faster, remember longer, and express yourself
              better.
            </p>
            <div className="flex gap-4 justify-center mb-12">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              >
                {session ? "Go to Dashboard" : "Start Learning Free"}
              </button>
              <Link
                href="/game"
                className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Play Word Game
              </Link>
              <Link
                href="/demo"
                className="bg-white text-gray-600 border border-gray-200 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-all shadow-lg"
              >
                Watch Demo
              </Link>
            </div>
            <div className="flex justify-center gap-8 text-gray-400 text-sm">
              <div>✨ No Credit Card Required</div>
              <div>🎯 Personalized Learning</div>
              <div>🤖 AI-Powered</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              Advanced Features Powered by AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Daily AI-Curated Words
                </h3>
                <p className="text-gray-600">
                  Get personalized word recommendations based on your learning
                  progress and interests.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Smart Quizzes
                </h3>
                <p className="text-gray-600">
                  Adaptive quizzes that evolve with your learning, focusing on
                  areas that need improvement.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Gamified Learning
                </h3>
                <p className="text-gray-600">
                  Earn badges, maintain streaks, and compete on leaderboards
                  while expanding your vocabulary.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Audio Pronunciation
                </h3>
                <p className="text-gray-600">
                  Perfect your pronunciation with AI-generated audio for every
                  word in multiple accents.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Detailed analytics and insights about your learning journey
                  and vocabulary growth.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  WordWise+
                </h3>
                <p className="text-gray-600">
                  Unlock advanced features like etymology insights, usage
                  patterns, and personalized study plans.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Start Your Vocabulary Journey Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of learners who are already expanding their
              vocabulary with WordWise.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-block bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-all shadow-lg"
            >
              {session ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <p className="text-sm text-gray-600 mt-4">
              No credit card required • Free plan available • Cancel anytime
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wordwise-plus"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    WordWise+
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-gray-800">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-gray-800">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-gray-600 hover:text-gray-800">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p> 2024 WordWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
