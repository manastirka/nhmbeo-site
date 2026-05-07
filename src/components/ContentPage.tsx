import PageHeader from './PageHeader';
import MarkdownBody from './MarkdownBody';
import Gallery from './Gallery';

export type ContentPageProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  body?: string;
  images?: string[];
  heroImage?: string;
  heroPosition?: 'top' | 'center' | 'bottom';
  galleryCaption?: string;
  children?: React.ReactNode;
};

export default function ContentPage({
  eyebrow,
  title,
  intro,
  body,
  images,
  heroImage,
  heroPosition,
  galleryCaption,
  children,
}: ContentPageProps) {
  // If the hero image is also the first gallery image, drop it from the
  // gallery to avoid duplication.
  const galleryImages = (images ?? []).filter((src) => src !== heroImage);

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        image={heroImage}
        imagePosition={heroPosition}
      />
      <section className="container-page py-12">
        {body && <MarkdownBody source={body} />}
        {children}
        {galleryImages.length > 0 && (
          <Gallery images={galleryImages} caption={galleryCaption} />
        )}
      </section>
    </>
  );
}
