import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("raw landing is English-first and client-facing", () => {
  assert.match(html, /<html lang="en" data-lang="en">/);
  assert.match(html, /Turn Goals Into Clear Next Steps/);
  assert.match(html, /progress you can see/);
  assert.doesNotMatch(html, /v75/);
  assert.doesNotMatch(html, /v81/);
  assert.match(html, /v82/);
});

test("English social metadata uses a cache-busted 1200x630 asset contract", async () => {
  assert.match(html, /og:locale" content="en_US"/);
  assert.match(html, /rel="canonical" href="https:\/\/yourpathway\.app\/"/);
  assert.match(html, /og:url" content="https:\/\/yourpathway\.app\/"/);
  assert.match(html, /og:image" content="[^"]+\/img\/og-v82-en\.jpg"/);
  assert.match(html, /og:image:width" content="1200"/);
  assert.match(html, /og:image:height" content="630"/);
  assert.ok((await stat(new URL("../img/og-v82-en.jpg", import.meta.url))).size > 10_000);
});

test("survey and waitlist prepare user-controlled email drafts", () => {
  assert.match(html, /id="survey"[^>]+action="mailto:info@yourpathway\.app"/);
  assert.match(html, /id="waitlist-form"[^>]+action="mailto:info@yourpathway\.app"/);
  assert.match(html, /id="survey-mailto" href="mailto:info@yourpathway\.app"/);
  assert.match(html, /id="mail-waitlist" href="mailto:info@yourpathway\.app"/);
  assert.doesNotMatch(html, /formsubmit\.co/i);
  assert.doesNotMatch(html, /FORM_ENDPOINT/);
  assert.doesNotMatch(html, /fetch\(FORM_ENDPOINT/);
  assert.match(html, /MAILTO_LIMIT=1800/);
  assert.match(html, /data-draft-mode/);
  assert.match(html, /enteredEmail/);
  assert.match(html, /testingAllowed/);
  assert.match(html, /window\.location\.href=link\.href/);
  for (let index = 1; index <= 5; index += 1) {
    assert.match(html, new RegExp(`name="q${index}"[^>]+required`));
  }
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /only if you want a reply to your feedback/);
  assert.doesNotMatch(html, /Thank you—your response was sent/);
  assert.doesNotMatch(html, /You’re on the update list/);
  assert.doesNotMatch(html, /return \{firstSeen:/);
});

test("campaign labels are allowlisted and passed to app CTAs", () => {
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    assert.match(html, new RegExp(`"${key}"`));
  }
  assert.match(html, /url\.searchParams\.set\("landing_cta"/);
  assert.match(html, /data-app-cta="hero"/);
  assert.doesNotMatch(html, /searchParams\.set\([^\n]+email/i);
});

test("privacy and crawl support are present", async () => {
  const privacy = await readFile(new URL("../privacy.html", import.meta.url), "utf8");
  const robots = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  assert.match(privacy, /User-controlled email delivery/);
  assert.doesNotMatch(privacy, /FormSubmit/i);
  assert.match(privacy, /does not transmit survey or signup data itself/);
  assert.match(privacy, /removeItem\("pathway-landing-attribution-v1"\)/);
  assert.doesNotMatch(privacy, /Clear this site's browser storage/);
  assert.match(privacy, /does not delete your Pathway goals or progress/);
  assert.match(privacy, /info@yourpathway\.app/);
  assert.match(robots, /Sitemap: https:\/\/yourpathway\.app\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/yourpathway\.app\/privacy\.html/);
  assert.match(sitemap, /<lastmod>2026-08-08<\/lastmod>/);
});
