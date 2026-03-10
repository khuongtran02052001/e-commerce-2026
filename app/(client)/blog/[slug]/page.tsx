import Container from '@/components/Container';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllBlogs, getBlogCategories, getOthersBlog, getSingleBlog } from '@/data/server';
import { IBlogMock } from '@/mock-data';
import dayjs from 'dayjs';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  User,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, cache, type ReactNode } from 'react';

export const revalidate = 300;

const getSingleBlogCached = cache(getSingleBlog);

const buildDescriptionFromBody = (body?: RichTextNode, maxLength: number = 160) => {
  if (!body) return 'Read the latest insights and stories.';
  let text = '';
  const collectText = (node: RichTextNode) => {
    if (node.text) text += `${node.text} `;
    node.content?.forEach(collectText);
  };
  collectText(body);
  const description = text.trim();
  if (!description) return 'Read the latest insights and stories.';
  return description.length > maxLength
    ? `${description.slice(0, maxLength).trim()}...`
    : description;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getSingleBlogCached(slug);
  if (!blog) {
    return {
      title: 'Article not found',
      robots: { index: false, follow: false },
    };
  }

  const bodyNode =
    blog?.body && typeof blog.body === 'object' && 'type' in blog.body
      ? (blog.body as unknown as RichTextNode)
      : ((blog?.body as { content?: RichTextNode })?.content as RichTextNode | undefined);
  const description = buildDescriptionFromBody(bodyNode);
  const title = blog.title ? `${blog.title} | Blog` : 'Blog Article';

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: blog.mainImageUrl
        ? [{ url: blog.mainImageUrl, alt: blog.title || 'Blog image' }]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs(50);
  return (blogs || [])
    .map((blog) => blog?.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

type RichTextMark = {
  type: string;
  attrs?: {
    href?: string;
  };
};

type RichTextNode = {
  type: string;
  text?: string;
  content?: RichTextNode[];
  marks?: RichTextMark[];
  attrs?: {
    level?: number;
    src?: string;
    alt?: string;
  };
};

const SingleBlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blog = await getSingleBlogCached(slug);
  if (!blog) return notFound();

  // Calculate reading time based on content length
  const calculateReadingTime = (body?: RichTextNode) => {
    if (!body) return 5;
    let wordCount = 0;
    const countWords = (node: RichTextNode) => {
      if (node.text) {
        wordCount += node.text.split(/\s+/).filter(Boolean).length;
      }
      if (node.content) {
        node.content.forEach(countWords);
      }
    };
    countWords(body);
    return Math.ceil(wordCount / 200); // 200 words per minute
  };

  const bodyNode =
    blog?.body && typeof blog.body === 'object' && 'type' in blog.body
      ? (blog.body as unknown as RichTextNode)
      : ((blog?.body as { content?: RichTextNode })?.content as RichTextNode | undefined);

  const readingTime = calculateReadingTime(bodyNode);
  const description = buildDescriptionFromBody(bodyNode);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: blog.author?.name ? { '@type': 'Person', name: blog.author.name } : undefined,
    image: blog.mainImageUrl ? [blog.mainImageUrl] : undefined,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${blog.slug}`,
    },
  };

  function renderChildren(nodes?: RichTextNode[], keyPrefix: string = 'node') {
    return nodes?.map((node, index) => renderInline(node, `${keyPrefix}-${index}`)) || null;
  }

  function renderNode(node: RichTextNode, key: string) {
    switch (node.type) {
      case 'doc':
        return <Fragment key={key}>{renderChildren(node.content, key)}</Fragment>;
      case 'paragraph':
        return (
          <p
            key={key}
            className="my-6 text-base leading-relaxed text-gray-700 first:mt-0 last:mb-0"
          >
            {renderChildren(node.content, key)}
          </p>
        );
      case 'heading': {
        const level = node.attrs?.level || 2;
        const HeadingTag = level === 3 ? 'h3' : level === 4 ? 'h4' : 'h2';
        const headingClass =
          level === 4
            ? 'my-4 text-lg font-semibold text-shop_dark_green first:mt-0 last:mb-0'
            : level === 3
              ? 'my-6 text-xl sm:text-2xl font-semibold text-shop_dark_green first:mt-0 last:mb-0'
              : 'my-8 text-2xl sm:text-3xl font-bold text-shop_dark_green first:mt-0 last:mb-0';
        return (
          <HeadingTag key={key} className={headingClass}>
            {renderChildren(node.content, key)}
          </HeadingTag>
        );
      }
      case 'blockquote':
        return (
          <blockquote
            key={key}
            className="my-8 border-l-4 border-shop_light_green bg-shop_light_bg pl-6 py-4 text-base italic text-gray-700 first:mt-0 last:mb-0"
          >
            {renderChildren(node.content, key)}
          </blockquote>
        );
      case 'bulletList':
        return (
          <ul key={key} className="my-6 list-disc pl-6 space-y-2 text-gray-700">
            {renderChildren(node.content, key)}
          </ul>
        );
      case 'orderedList':
        return (
          <ol key={key} className="my-6 list-decimal pl-6 space-y-2 text-gray-700">
            {renderChildren(node.content, key)}
          </ol>
        );
      case 'listItem':
        return (
          <li key={key} className="pl-2">
            {renderChildren(node.content, key)}
          </li>
        );
      case 'image':
        if (!node.attrs?.src) return null;
        return (
          <div key={key} className="my-8 overflow-hidden rounded-lg shadow-md">
            <Image
              alt={node.attrs.alt || ''}
              src={node.attrs.src}
              className="w-full h-auto"
              width={800}
              height={600}
            />
          </div>
        );
      case 'hardBreak':
        return <br key={key} />;
      default:
        return null;
    }
  }

  function renderInline(node: RichTextNode, key: string) {
    if (node.type === 'text') {
      let content: ReactNode = node.text || '';
      if (node.marks?.length) {
        content = node.marks.reduce<ReactNode>((acc, mark) => {
          switch (mark.type) {
            case 'bold':
              return <strong className="font-semibold text-shop_dark_green">{acc}</strong>;
            case 'italic':
              return <em className="italic text-gray-700">{acc}</em>;
            case 'code':
              return (
                <code className="bg-shop_light_bg px-2 py-1 rounded text-sm font-mono text-shop_dark_green">
                  {acc}
                </code>
              );
            case 'link':
              return (
                <Link
                  href={mark.attrs?.href || '#'}
                  className="font-medium text-shop_light_green hover:text-shop_dark_green underline decoration-shop_light_green underline-offset-4 hover:decoration-shop_dark_green transition-colors"
                >
                  {acc}
                </Link>
              );
            default:
              return acc;
          }
        }, content);
      }
      return <Fragment key={key}>{content}</Fragment>;
    }

    return renderNode(node, key);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-shop_light_bg to-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <Container className="pt-6">
        <DynamicBreadcrumb
          customItems={[{ label: 'Blog', href: '/blog' }, { label: blog?.title || 'Article' }]}
        />
      </Container>

      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="space-y-8">
              {/* Article Header */}
              <div className="space-y-6">
                {/* Categories */}
                {blog?.categories && blog.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.categories.map(
                      (category: { title: string | null; slug: string | null }) => (
                        <Badge
                          key={category.slug || category.title}
                          className="bg-shop_dark_green hover:bg-shop_light_green"
                        >
                          <Link href={`/blog?category=${category.slug || ''}`}>
                            {category.title}
                          </Link>
                        </Badge>
                      ),
                    )}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shop_dark_green leading-tight">
                  {blog?.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  {blog?.author?.name && (
                    <div className="flex items-center gap-2">
                      {/* {blog?.author?.image && (
                        <Image
                          src={urlFor(blog.author.image).width(32).height(32).url()}
                          alt={blog.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )} */}
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span className="font-medium text-shop_dark_green">{blog.author.name}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <time>{dayjs(blog.publishedAt).format('MMMM D, YYYY')}</time>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{readingTime} min read</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>2.5K views</span>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-shop_dark_green text-shop_dark_green hover:bg-shop_dark_green hover:text-white"
                  >
                    <Heart size={16} className="mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-shop_dark_green text-shop_dark_green hover:bg-shop_dark_green hover:text-white"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Comment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-shop_dark_green text-shop_dark_green hover:bg-shop_dark_green hover:text-white"
                  >
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              {blog?.mainImageUrl && (
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={blog.mainImageUrl}
                    alt={blog.title || 'Blog Image'}
                    width={1200}
                    height={600}
                    className="w-full h-[400px] sm:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              {/* Article Content */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 sm:p-12">
                  <div className="prose prose-lg max-w-none">
                    {bodyNode && renderNode(bodyNode, 'blog-body')}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8 border-t border-gray-200">
                <Button
                  asChild
                  variant="outline"
                  className="border-shop_dark_green text-shop_dark_green hover:bg-shop_dark_green hover:text-white"
                >
                  <Link href="/blog" className="flex items-center gap-2">
                    <ChevronLeft size={16} />
                    Back to Blog
                  </Link>
                </Button>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Share this article:</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Twitter
                    </Button>
                    <Button size="sm" variant="outline">
                      LinkedIn
                    </Button>
                    <Button size="sm" variant="outline">
                      Facebook
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <BlogSidebar slug={slug} />
        </div>
      </Container>
    </div>
  );
};

const BlogSidebar = async ({ slug }: { slug: string }) => {
  const [categories, blogs] = await Promise.all([getBlogCategories(), getOthersBlog(slug, 5)]);
  return (
    <div className="space-y-6">
      {/* Categories Card */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-shop_dark_green flex items-center gap-2">
            <BookOpen size={18} />
            Blog Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories?.length ? (
            categories.map((blogcategories) => (
              <Link
                key={blogcategories?.slug || blogcategories?.id}
                href={`/blog?category=${blogcategories?.slug || ''}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-shop_light_bg transition-colors group"
              >
                <p className="text-gray-700 group-hover:text-shop_dark_green transition-colors">
                  {blogcategories?.title}
                </p>
                <Badge variant="secondary" className="text-xs">
                  1
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories available.</p>
          )}
        </CardContent>
      </Card>

      {/* Latest Posts Card */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-shop_dark_green flex items-center gap-2">
            <BookOpen size={18} />
            Latest Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blogs?.length ? (
            blogs.map((blogItem: IBlogMock) => (
              <Link
                href={`/blog/${blogItem?.slug}`}
                key={blogItem?.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-shop_light_bg transition-all duration-200 group"
              >
                {blogItem?.mainImageUrl && (
                  <div className="flex-shrink-0">
                    <Image
                      src={blogItem.mainImageUrl}
                      alt="blog thumbnail"
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 group-hover:border-shop_light_green transition-colors"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-shop_dark_green transition-colors">
                    {blogItem?.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar size={12} />
                    {dayjs(blogItem?.publishedAt).format('MMM D, YYYY')}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 text-gray-400 group-hover:text-shop_light_green transition-colors"
                />
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500">No posts yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-shop_light_pink to-light-orange/20">
        <CardContent className="p-6 text-center">
          <BookOpen className="w-12 h-12 text-shop_dark_green mx-auto mb-4" />
          <h3 className="text-lg font-bold text-shop_dark_green mb-2">Stay Updated</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get the latest articles delivered to your inbox.
          </p>
          <Button className="w-full bg-shop_dark_green hover:bg-shop_light_green" size="sm">
            Subscribe Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const BlogSidebarFallback = () => (
  <div className="space-y-6">
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-shop_dark_green">Blog Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-4 w-2/3 rounded bg-gray-100" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
      </CardContent>
    </Card>
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-shop_dark_green">Latest Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-12 rounded bg-gray-100" />
        <div className="h-12 rounded bg-gray-100" />
        <div className="h-12 rounded bg-gray-100" />
      </CardContent>
    </Card>
  </div>
);

export default SingleBlogPage;
