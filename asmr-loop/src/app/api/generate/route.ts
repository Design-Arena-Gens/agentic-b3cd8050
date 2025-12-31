import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { interpretPrompt } from "@/lib/prompt";
import { synthesizeLoopAudio } from "@/lib/audio";
import {
  cleanupFrames,
  encodeVideoWithAudio,
  finalizePublicAssets,
  prepareGenerationPaths,
  removeGenerationTemp,
  renderVisualLoop,
} from "@/lib/video";
import { buildTikTokCaption, buildYouTubeCaption } from "@/lib/captions";
import { distributeToPlatforms } from "@/lib/posting";
import { GenerationResult } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const trimmedPrompt = prompt.trim();
    const interpretation = interpretPrompt(trimmedPrompt);
    const token = crypto.randomUUID();
    const paths = await prepareGenerationPaths(token);

    try {
      await renderVisualLoop(interpretation, paths);
      await synthesizeLoopAudio(interpretation, paths);
      await encodeVideoWithAudio(paths, interpretation);
      await cleanupFrames(paths);

      const { videoUrl, audioUrl, coverUrl } = await finalizePublicAssets(paths, token);

      const tikTokCaption = buildTikTokCaption(trimmedPrompt, interpretation);
      const youTubeCaption = buildYouTubeCaption(trimmedPrompt, interpretation);

      const posts = await distributeToPlatforms({
        videoPath: paths.videoPath,
        coverPath: paths.coverPath,
        interpretation,
        tikTokCaption,
        youTubeCaption,
      });

      const payload: GenerationResult = {
        prompt: trimmedPrompt,
        interpretation,
        videoUrl,
        audioUrl,
        coverUrl,
        durationSeconds: interpretation.durationSeconds,
        fps: interpretation.fps,
        tikTokCaption,
        youTubeCaption,
        posts,
      };

      return NextResponse.json(payload, { status: 200 });
    } finally {
      await removeGenerationTemp(paths);
    }
  } catch (error) {
    console.error("Generation failed", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
