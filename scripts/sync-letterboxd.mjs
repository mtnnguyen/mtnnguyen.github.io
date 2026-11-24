// Pull recent diary entries from a Letterboxd RSS feed into assets/data/letterboxd.json.
// Usage: LETTERBOXD_USER=yourname node scripts/sync-letterboxd.mjs
// Runs daily from .github/workflows/letterboxd.yml. No dependencies.
import { readFile, writeFile } from "node:fs/promises";

const user = (process.env.LETTERBOXD_USER || "").trim();
const out = new URL("../assets/data/letterboxd.json", import.meta.url);

if (!user) {
  console.log("LETTERBOXD_USER is not set; leaving letterboxd.json unchanged.");
  process.exit(0);
}

const res = await fetch(`https://letterboxd.com/${encodeURIComponent(user)}/rss/`, {
  headers: { "User-Agent": "portfolio-letterboxd-sync" },
});
if (!res.ok) throw new Error(`Letterboxd feed returned ${res.status}`);
const xml = await res.text();

const tag = (s, name) => {
  const m = s.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : "";
};
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ");

const films = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  .map(([, item]) => {
    const title = decode(tag(item, "letterboxd:filmTitle"));
    if (!title) return null; // lists and other non-diary items
    const html = tag(item, "description");
    const poster = (html.match(/<img src="([^"]+)"/) || [])[1] || "";
    // The review is every paragraph after the poster, as plain text.
    const review = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)]
      .map(([, p]) => decode(p.replace(/<[^>]+>/g, "")).trim())
      .filter((p) => p && !p.startsWith("Watched on"))
      .join(" ");
    return {
      title,
      year: tag(item, "letterboxd:filmYear"),
      rating: Number(tag(item, "letterboxd:memberRating")) || null,
      watched: tag(item, "letterboxd:watchedDate"),
      url: tag(item, "link"),
      poster,
      review,
    };
  })
  .filter(Boolean)
  .slice(0, 8);

const next = { user, updated: new Date().toISOString().slice(0, 10), films };

// Only rewrite the file when the films changed, so the workflow commits nothing on quiet days.
const prev = JSON.parse(await readFile(out, "utf8").catch(() => "{}"));
if (JSON.stringify(prev.films) === JSON.stringify(films) && prev.user === user) {
  console.log("No new films.");
} else {
  await writeFile(out, JSON.stringify(next, null, 2) + "\n");
  console.log(`Wrote ${films.length} films.`);
}
