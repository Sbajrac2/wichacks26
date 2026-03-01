"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Ally Coach</h1>
        <p className="mt-4 text-slate-400">
          Train your voice. Strengthen your allyship.
        </p>
      </div>
    </main>
  );
}