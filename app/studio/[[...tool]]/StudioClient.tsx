"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Client boundary for the embedded Studio. Keeping the `sanity` / `next-sanity`
 * imports here (rather than in the server `page.tsx`) prevents the client-only
 * Studio bundle from being evaluated in the server runtime at build time.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
