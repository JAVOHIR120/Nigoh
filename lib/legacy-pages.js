import fs from 'fs';
import path from 'path';

const legacyDir = path.join(process.cwd(), 'legacy');

const pageMap = {
  home: 'index.html',
  login: 'login.html',
  signup: 'signup.html',
  register: 'register.html',
  admin: 'admin.html',
  profile: 'profile.html',
};

function extract(html, regex, fallback = '') {
  const match = html.match(regex);
  return match ? match[1].trim() : fallback;
}

function extractAll(html, regex) {
  return [...html.matchAll(regex)].map((match) => match[1].trim()).filter(Boolean);
}

function extractLinkTags(head) {
  return [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
}

function parseAttributes(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([:\w-]+)(?:=("([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    const [, key, , dquote, squote, bare] = match;
    if (key === 'link') continue;
    attrs[key] = dquote ?? squote ?? bare ?? true;
  }
  return attrs;
}

export function getPageConfig(slug = 'home') {
  const fileName = pageMap[slug];
  if (!fileName) return null;

  const html = fs.readFileSync(path.join(legacyDir, fileName), 'utf8');
  const head = extract(html, /<head[^>]*>([\s\S]*?)<\/head>/i);
  const body = extract(html, /<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    slug,
    fileName,
    title: extract(head, /<title>([\s\S]*?)<\/title>/i),
    description: extract(head, /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i),
    metas: {
      keywords: extract(head, /<meta[^>]+name=["']keywords["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i),
      author: extract(head, /<meta[^>]+name=["']author["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i),
      themeColor: extract(head, /<meta[^>]+name=["']theme-color["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i),
    },
    linkTags: extractLinkTags(head),
    styles: extractAll(head, /<style[^>]*>([\s\S]*?)<\/style>/gi),
    externalScripts: extractAll(head + body, /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi),
    inlineScripts: extractAll(head + body, /<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi),
    bodyHtml: body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').trim(),
  };
}

export function getAllSlugs() {
  return Object.keys(pageMap);
}

export function linkTagToProps(tag) {
  return parseAttributes(tag);
}
