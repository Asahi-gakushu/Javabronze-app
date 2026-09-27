// AdSense にはパブリッシャーIDを記載した /ads.txt が必要。ビルド時に環境変数から書き出す。
import { writeFileSync, rmSync } from "node:fs";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const path = new URL("../public/ads.txt", import.meta.url);

if (client.startsWith("ca-pub-")) {
  const pub = client.replace(/^ca-/, "");
  writeFileSync(path, `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
  console.log("ads.txt を書き出しました:", pub);
} else {
  rmSync(path, { force: true });
}
