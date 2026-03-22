import LegacyPage from '@/components/legacy-page';
import { getPageConfig, linkTagToProps } from '@/lib/legacy-pages';

export const dynamic = 'force-static';

export function generateMetadata() {
  const page = getPageConfig('home');
  return {
    title: page.title,
    description: page.description,
    keywords: page.metas.keywords,
    authors: page.metas.author ? [{ name: page.metas.author }] : undefined,
  };
}

export default function HomePage() {
  const page = getPageConfig('home');
  return <LegacyPage page={{ ...page, linkTags: page.linkTags.map((tag) => ({ props: linkTagToProps(tag) })) }} />;
}
