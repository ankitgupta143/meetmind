import AuthSidePanel from "./AuthSidePanel";

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#080c14] p-4 lg:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Ambient glowing radial auras */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-slate-950/70 shadow-2xl backdrop-blur-2xl lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
          {children}
        </div>
        <AuthSidePanel />
      </div>
    </main>
  );
}
