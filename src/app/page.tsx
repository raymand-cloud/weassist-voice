"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const scenarios = [
  {
    id: "ops",
    label: "Ops HQ",
    summary: "Turn scattered updates into one crisp brief.",
    userPrompt:
      "Can you thread the ops chatter and give me a one-page briefing before stand-up?",
    assistantCore:
      "I pulled the key threads, highlighted blockers for RevOps, and lined up follow-up owners for you. The one-page brief is waiting in Notion with inline context from Slack and Asana.",
    highlights: [
      "Synthesized 48 Slack updates",
      "Flagged 3 risks + owners",
      "Brief hits your inbox 8:15a",
    ],
  },
  {
    id: "travel",
    label: "Executive travel",
    summary: "Plan complex routes without calendar chaos.",
    userPrompt:
      "Rework next week's NYC + Austin loop so I can host the client dinner and still make the board prep.",
    assistantCore:
      "Everything syncs to your calendar with realistic buffer time. Drivers, board decks, and the client dinner seating chart are attached, plus weather-ready packing notes.",
    highlights: [
      "Protected 6hrs of focus time",
      "Coordinated 4 teams + travel",
      "Shared daily SMS brief",
    ],
  },
  {
    id: "product",
    label: "Product rituals",
    summary: "Keep launches on track and calm.",
    userPrompt:
      "Can you keep the beta rollout on rails and surface anything that needs my call today?",
    assistantCore:
      "Launch tracker stays green. I nudged owners for the red cards, condensed customer notes, and drafted the Loom for tomorrow's update.",
    highlights: [
      "4 blockers resolved async",
      "Customer intel clipped to Notion",
      "Next update drafted",
    ],
  },
]

const toneModes = [
  {
    id: "warm",
    label: "Warm & steady",
    lead: "On it.",
    close: "I'll keep you posted before anything lands on your plate.",
    mood: "Calm confidence",
  },
  {
    id: "bright",
    label: "Bright energy",
    lead: "Absolutely — already moving.",
    close: "Expect check-ins on Slack with quick Loom clips when anything shifts.",
    mood: "Upbeat momentum",
  },
  {
    id: "direct",
    label: "Direct & crisp",
    lead: "Handled.",
    close: "You're only looped on decisions that truly need you.",
    mood: "Zero-fluff",
  },
]

const defaultContact = { name: "", email: "", request: "" }

type ContactState = "idle" | "sending" | "sent"

type Scenario = (typeof scenarios)[number]

type Tone = (typeof toneModes)[number]

const composeAssistantMessage = (scenario: Scenario, tone: Tone) => {
  return `${tone.lead} ${scenario.assistantCore} ${tone.close}`
}

export default function Page() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0])
  const [toneIndex, setToneIndex] = useState(0)
  const [contactOpen, setContactOpen] = useState(false)
  const [formState, setFormState] = useState<ContactState>("idle")
  const [formData, setFormData] = useState(defaultContact)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const tone = toneModes[toneIndex]
  const assistantMessage = useMemo(
    () => composeAssistantMessage(activeScenario, tone),
    [activeScenario, tone]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleScenarioChange = (scenario: Scenario) => {
    setActiveScenario(scenario)
  }

  const handleToneCycle = () => {
    setToneIndex((prev) => (prev + 1) % toneModes.length)
  }

  const handleDialogChange = (open: boolean) => {
    setContactOpen(open)
    if (!open) {
      setFormState("idle")
      setFormData(defaultContact)
    }
  }

  const handleContactChange = (
    field: keyof typeof defaultContact,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formState === "sent") {
      setFormState("idle")
    }
  }

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formState === "sending") return

    setFormState("sending")
    timeoutRef.current = setTimeout(() => {
      setFormState("sent")
      setFormData(defaultContact)
    }, 900)
  }

  return (
    <main className="min-h-dvh bg-white text-gray-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Human-level support, AI speed
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-6xl">
              WeAssist keeps your week calm, even when everything is on fire.
            </h1>
            <p className="text-lg text-gray-600 md:text-xl">
              Delegate the decisions, not just the tasks. Tap a workflow, choose a tone,
              and watch an executive-ready plan come together in real time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Dialog open={contactOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button size="lg">Talk to us</Button>
                </DialogTrigger>
                <DialogContent className="space-y-6">
                  <DialogHeader>
                    <DialogTitle>Let&apos;s tailor WeAssist to you</DialogTitle>
                    <DialogDescription>
                      Tell us how you&apos;d like your executive assistant to show up and we&apos;ll
                      follow up within one business day.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    <Input
                      required
                      placeholder="Name"
                      value={formData.name}
                      onChange={(event) =>
                        handleContactChange("name", event.target.value)
                      }
                    />
                    <Input
                      required
                      type="email"
                      placeholder="Work email"
                      value={formData.email}
                      onChange={(event) =>
                        handleContactChange("email", event.target.value)
                      }
                    />
                    <Textarea
                      required
                      rows={4}
                      placeholder="What would make your day feel lighter?"
                      value={formData.request}
                      onChange={(event) =>
                        handleContactChange("request", event.target.value)
                      }
                    />
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-gray-500">
                        {formState === "sent"
                          ? "Message received — we&apos;ll be in touch soon."
                          : "No spam. Just thoughtful support."}
                      </p>
                      <Button type="submit" disabled={formState === "sending"}>
                        {formState === "sent"
                          ? "Sent"
                          : formState === "sending"
                            ? "Sending..."
                            : "Share request"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline">
                How it works
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 lg:justify-start">
              <div>
                <span className="font-semibold text-gray-900">2,700+</span> hours given back
              </div>
              <span aria-hidden="true">•</span>
              <div>
                Avg. response time <span className="font-semibold text-gray-900">4m</span>
              </div>
            </div>
          </div>

          <Card className="border-gray-200 bg-gray-900 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                Live preview
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={handleToneCycle}
                >
                  Switch tone
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Currently showing <span className="font-semibold">{tone.label}</span> — {tone.mood}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-gray-800/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">You</p>
                <p className="text-base leading-relaxed text-white">
                  {activeScenario.userPrompt}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-50/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                  WeAssist
                </p>
                <p className="text-base leading-relaxed text-emerald-50">
                  {assistantMessage}
                </p>
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Highlights
              </div>
              <ul className="grid gap-3 text-sm text-gray-200">
                {activeScenario.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <span className="mt-1 size-2 rounded-full bg-emerald-300" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Try a workflow
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Pick what you need handled right now.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-3">
              {scenarios.map((scenario) => {
                const isActive = scenario.id === activeScenario.id

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleScenarioChange(scenario)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900",
                      isActive
                        ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                        : "border-gray-200 hover:border-gray-400/70"
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      {scenario.id === activeScenario.id ? "Selected" : "Preview"}
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-lg font-semibold",
                        isActive && "text-white"
                      )}
                    >
                      {scenario.label}
                    </p>
                    <p
                      className={cn(
                        "text-sm text-gray-600",
                        isActive && "text-gray-200"
                      )}
                    >
                      {scenario.summary}
                    </p>
                  </button>
                )}
              )}
            </div>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {activeScenario.label}
                </CardTitle>
                <CardDescription>{activeScenario.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-500">How we show up</p>
                  <p className="text-base text-gray-800">
                    {assistantMessage}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeScenario.highlights.map((detail) => (
                    <div
                      key={detail}
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setContactOpen(true)}
                >
                  Book this workflow
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {["Weekly calm brief", "Signal over noise", "People-first follow through"].map(
            (title, index) => (
              <Card key={title} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {title}
                  </CardTitle>
                  <CardDescription>
                    {[
                      "Every Sunday evening you get a color-coded plan with risks, opportunities, and suggested shifts.",
                      "We triage the inbox, wrangle Slack, and surface only what needs your call.",
                      "Thoughtful nudges, human check-ins, and tidy wrap-ups keep teams feeling supported.",
                    ][index]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold text-gray-900">
                    {[
                      "92%",
                      "<4m",
                      "37",
                    ][index]}
                  </div>
                  <p className="text-sm text-gray-500">
                    {[
                      "of founders feel more in-control after two weeks",
                      "average time-to-response across channels",
                      "specialists ready across ops, finance, and comms",
                    ][index]}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </section>
      </section>
    </main>
  )
}
