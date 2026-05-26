import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const isAdmin = req.nextUrl.searchParams.get("admin") === "true";

  if (isAdmin) {
    const unauth = await requireAdmin();
    if (unauth) return unauth;
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  }

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, category, image, author, published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleanSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title: String(title).trim(),
        slug: cleanSlug,
        excerpt: excerpt ? String(excerpt).trim() : null,
        content: content ? String(content) : null,
        category: category ? String(category).trim() : null,
        image: image ? String(image).trim() : null,
        author: author ? String(author).trim() : null,
        published: Boolean(published),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
