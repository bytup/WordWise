"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const getErrorMessage = (errorType: string | null) => {
    if (!errorType) return null;

    switch (errorType) {
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in using your original authentication method.";
      case "AccessDenied":
        return "Access denied. Please try again.";
      case "Verification":
        return "The verification link has expired or has already been used.";
      default:
        return "An error occurred during sign in. Please try again.";
    }
  };

  const errorMessage = getErrorMessage(error || null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to WordWise
          </h1>
          <p className="text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Image
            src="/google.svg"
            alt="Google logo"
            width={20}
            height={20}
            priority
          />
          Continue with Google
        </button>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our</p>
          <div className="flex justify-center gap-2 mt-1">
            <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>
            <span>&</span>
            <a
              href="/privacy"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
