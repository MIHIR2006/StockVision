"use client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

export default function AuthShowcase() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] rounded-xl shadow-lg p-8">
      {session ? (
        <>
          <div className="text-white text-lg font-semibold">Welcome, {session.user?.name || session.user?.email}!</div>
          <button
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <div className="text-white text-lg font-semibold">Sign in to access your dashboard</div>
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
