import db from "@/lib/db";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug: slug, published: true },
  });

  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
        title: post.metaTitle,
        description: post.metaDescription,
        images: [
            {
                url: post.imageUrl,
            }
        ]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug: slug, published: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
      
      <div className="flex items-center text-gray-500 mb-6">
        <span>Por {post.author}</span>
        <span className="mx-2">•</span>
        <span>
          {new Date(post.createdAt).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="relative w-full h-80 md:h-96 mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

// Generate static paths for all published posts at build time
export async function generateStaticParams() {
    const posts = await db.blogPost.findMany({
        where: { published: true },
        select: { slug: true }
    });

    return posts.map(post => ({
        slug: post.slug
    }));
}
