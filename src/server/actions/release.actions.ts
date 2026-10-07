"use server";

import { headers } from "next/headers";
import { releaseIntegrityService } from "@/server/services/release-integrity.service";

export async function verifyReleaseChecksumAction(artifactName: string, candidateHash: string) {
  const headerList = await headers();
  const requesterIp = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "unknown";

  return await releaseIntegrityService.verifyChecksum(artifactName, candidateHash, requesterIp);
}

export async function getRegisteredReleaseArtifactsAction() {
  return releaseIntegrityService.getRegisteredArtifacts();
}
