"use client";

import { useState } from "react";
import type { GenerationResult, PlatformPostResult } from "@/lib/types";

interface ApiResponse extends GenerationResult {
  error?: string;
}

const PROMPT_EXAMPLES = [
  "Crunchy kinetic sand ASMR",
  "Iridescent slime stretch",
  "Fluid bubble pouring loop",
];

export default function Home() {
  const [prompt, setPrompt] = useState(PROMPT_EXAMPLES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError("Enter a prompt to generate");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-50px_rgba(56,189,248,0.35)] backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Loop ASMR Studio</h1>
          <p className="max-w-3xl text-base text-slate-300 sm:text-lg">
            Generate a loop-perfect, 9:16 ASMR short with raw sound, platform-ready captions, and deployment status from a single spark of inspiration.
          </p>
        </header>

        <main className="grid gap-8 lg:grid-cols-[ minmax(0,1fr)_minmax(0,1fr) ]">
          <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="prompt" className="text-sm font-medium uppercase tracking-[0.15em] text-sky-200/80">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Describe an ASMR trigger"
                  className="h-32 resize-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-slate-100 shadow-inner outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                {PROMPT_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 font-medium text-slate-200 transition hover:border-sky-500/50 hover:text-sky-100"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-sky-400/60 bg-sky-500/80 px-6 py-3 text-base font-semibold text-slate-950 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sky-300/70 via-white/70 to-transparent transition group-hover:translate-x-0" aria-hidden />
                {loading ? "Generating…" : "Generate Loop"}
              </button>
            </form>

            {error && (
              <div className="rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {result && (
              <div className="flex flex-col gap-5 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                <span className="font-semibold uppercase tracking-[0.2em] text-emerald-200/80">Generation Ready</span>
                <span>
                  {result.interpretation.title} — {result.durationSeconds}s @ {result.fps}fps
                </span>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            {!result && !loading && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-slate-400">
                <span className="text-xl font-medium text-slate-200">Output appears here</span>
                <p className="max-w-sm text-sm text-slate-400">
                  We build a seamless loop, synthesize raw ASMR sound, and craft captions tailored for TikTok and YouTube Shorts.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-400/30 border-t-transparent" aria-hidden />
                <p className="text-sm text-slate-300">Creating visual loop, mixing audio, encoding video…</p>
              </div>
            )}

            {result && !loading && (
              <div className="flex flex-col gap-6">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                  <video
                    src={result.videoUrl}
                    controls
                    loop
                    playsInline
                    preload="metadata"
                    className="h-[420px] w-full rounded-2xl border border-white/10 object-cover"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Video path: {result.videoUrl}</span>
                    <a
                      href={result.audioUrl}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-slate-200 transition hover:border-sky-400/50 hover:text-sky-100"
                    >
                      Download audio
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <CaptionCard
                    title="TikTok"
                    content={result.tikTokCaption}
                    posts={result.posts}
                    platformKey="tiktok"
                  />
                  <CaptionCard
                    title="YouTube Shorts"
                    content={result.youTubeCaption}
                    posts={result.posts}
                    platformKey="youtube"
                  />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/70">Interpretation</h3>
                  <dl className="mt-3 grid gap-2">
                    <DetailRow label="Trigger" value={result.interpretation.trigger.replace("_", " ")} />
                    <DetailRow label="Mood" value={result.interpretation.visualMood} />
                    <DetailRow label="Motion" value={result.interpretation.motionDescription} />
                    <DetailRow label="Palette" value={result.interpretation.palette.join(", ")} />
                  </dl>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function CaptionCard({
  title,
  content,
  posts,
  platformKey,
}: {
  title: string;
  content: string;
  posts: PlatformPostResult[];
  platformKey: PlatformPostResult["platform"];
}) {
  const status = posts.find((entry) => entry.platform === platformKey);
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-200/80">{title}</span>
        {status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              status.status === "success"
                ? "bg-emerald-500/20 text-emerald-200"
                : status.status === "failed"
                  ? "bg-rose-500/20 text-rose-200"
                  : "bg-amber-500/20 text-amber-200"
            }`}
          >
            {status.status}
          </span>
        )}
      </header>
      <textarea
        readOnly
        value={content}
        className="h-32 resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200"
      />
      {status && (
        <p className="text-xs text-slate-400">{status.detail}</p>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  );
}
