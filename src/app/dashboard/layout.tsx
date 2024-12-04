"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navigationItems = [
  { path: "/dashboard", name: "Daily Word", icon: "📚" },
  { path: "/dashboard/quiz", name: "Quiz", icon: "✍️" },
  { path: "/dashboard/vocabulary", name: "My Vocabulary", icon: "📖" },
  { path: "/dashboard/progress", name: "Progress", icon: "📊" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                WordWise
              </Link>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all">
                Upgrade to WordWise+
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session?.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-600">
                    {session?.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  px-4 py-4 text-sm font-medium border-b-2 -mb-px flex items-center gap-2
                  ${
                    pathname === item.path
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-gray-500 text-sm">
              © 2024 WordWise. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Unlock advanced features with{" "}
              <span className="text-indigo-600 font-semibold">WordWise+</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
