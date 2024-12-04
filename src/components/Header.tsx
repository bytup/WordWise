"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold text-white">
              WordWise
            </Link>
            <div className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-xs text-white">
              AI-Powered
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-gray-300">{session.user?.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
