"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthShowcase() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl shadow-lg p-8">
      {session ? (
        <>
          <div className="text-gray-900 dark:text-white text-lg font-semibold">Welcome, {session.user?.name || session.user?.email}!</div>
          <button
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <div className="text-gray-900 dark:text-white text-lg font-semibold">Sign in to access your dashboard</div>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
}
