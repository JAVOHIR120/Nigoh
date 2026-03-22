import { notFound } from 'next/navigation';
import LegacyPage from '@/components/legacy-page';
import { getAllSlugs, getPageConfig, linkTagToProps } from '@/lib/legacy-pages';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().filter((slug) => slug !== 'home').map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const page = getPageConfig(params.slug);
  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.metas.keywords,
    authors: page.metas.author ? [{ name: page.metas.author }] : undefined,
  };
}

export default function LegacyRoutePage({ params }) {
  const page = getPageConfig(params.slug);
  if (!page) {
    notFound();
  }

  return <LegacyPage page={{ ...page, linkTags: page.linkTags.map((tag) => ({ props: linkTagToProps(tag) })) }} />;
}
