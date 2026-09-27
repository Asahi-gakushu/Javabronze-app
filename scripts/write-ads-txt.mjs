// AdSense requires /ads.txt listing the publisher ID; write it at build time from the env var.
import { writeFileSync, rmSync } from "node:fs";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const path = new URL("../public/ads.txt", import.meta.url);

if (client.startsWith("ca-pub-")) {
  const pub = client.replace(/^ca-/, "");
  writeFileSync(path, `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
  console.log("ads.txt written for", pub);
} else {
  rmSync(path, { force: true });
}
