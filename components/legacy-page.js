'use client';

import Script from 'next/script';

export default function LegacyPage({ page }) {
  return (
    <>
      {page.linkTags.map((tag, index) => {
        const attrs = Object.fromEntries(
          Object.entries(tag.props || {}).map(([key, value]) => [key === 'crossorigin' ? 'crossOrigin' : key, value]),
        );
        return <link key={`${page.slug}-link-${index}`} {...attrs} />;
      })}

      {page.styles.map((style, index) => (
        <style key={`${page.slug}-style-${index}`} dangerouslySetInnerHTML={{ __html: style }} />
      ))}

      <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />

      {page.externalScripts.map((src, index) => (
        <Script key={`${page.slug}-external-${index}`} src={src} strategy="afterInteractive" />
      ))}

      {page.inlineScripts.map((script, index) => (
        <Script
          key={`${page.slug}-inline-${index}`}
          id={`${page.slug}-inline-${index}`}
          strategy="afterInteractive"
          type="module"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      ))}
    </>
  );
}
