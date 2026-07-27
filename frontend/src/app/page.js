import AppLayout from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <div className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl font-bold">
          Welcome to MeetMind 🚀
        </h1>

        <p className="mt-3 text-muted-foreground">
          Your AI meeting intelligence platform is coming to life.
        </p>
      </div>
    </AppLayout>
  );
}