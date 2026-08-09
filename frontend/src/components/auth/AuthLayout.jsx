import AuthSidePanel from "./AuthSidePanel";
export default function AuthLayout({ children }) { return <main className="min-h-screen bg-zinc-50 p-4 lg:p-6"><div className="mx-auto grid min-h-[calc(100vh-32px)] max-w-7xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 lg:grid-cols-2">{children}<AuthSidePanel /></div></main>; }
