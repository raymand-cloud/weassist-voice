import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-gray-900 flex items-center justify-center">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          WeAssist — your friendly executive assistant.
        </h1>

        <p className="text-lg md:text-xl text-gray-600">
          Warm-professional, human-centered, AI-powered. We help you do more, calmly.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button size="lg">Talk to us</Button>
          <Button size="lg" variant="outline">
            How it works
          </Button>
        </div>
      </section>
    </main>
  );
}
