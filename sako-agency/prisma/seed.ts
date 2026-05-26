import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const services = [
    { name: "Web Development", tagline: "No Limits & Fast", description: "Custom-engineered websites that convert visitors into revenue. Performance-first, pixel-perfect.", icon: "Code2", backgroundImage: "webdevelopment.png", order: 1 },
    { name: "UI / UX Design", tagline: "Inevitable Interfaces", description: "Interfaces that feel designed for the user, not the designer. Clean, considered, conversion-led.", icon: "Layers", backgroundImage: "ui&ux.png", order: 2 },
    { name: "SEO & Growth", tagline: "Rank Where It Matters", description: "Compound organic growth that compounds month over month. We play the long game.", icon: "Search", backgroundImage: "webdevelopment.png", order: 3 },
    { name: "AI Integration", tagline: "Identity That Lasts", description: "Visual identities that command attention and build instant recognition across every touchpoint.", icon: "Palette", backgroundImage: "Aichat.png", order: 4 },
    { name: "Conversion Strategy", tagline: "Funnels That Convert", description: "Offer positioning, page flow, and CRO-driven structure designed to turn traffic into qualified leads.", icon: "Sparkles", backgroundImage: "webdevelopment.png", order: 5 },
    { name: "Brand & Graphics", tagline: "Automate at Scale", description: "Embed AI into your operations to personalize, automate, and ship 10× faster.", icon: "Brain", backgroundImage: "webdevelopment.png", order: 6 },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) await prisma.service.create({ data: service });
  }
  console.log(`Seeded ${services.length} services`);

  const members = [
    { name: "Ali Ahmed", role: "Chief Executive Officer", handle: "aliahmed", initials: "AA", bio: "Cybersecurity Expert | Innovation Enthusiast | Web Designer", avatar: "https://i.ibb.co/SDv8KMNx/Whats-App-Image-2026-04-23-at-1-LE-upscale-prime.jpg", category: "Designer", color: "#c9a84c", order: 1 },
    { name: "Atif Mumtaz", role: "Chief Technology Officer", handle: "atifmumtaz", initials: "AM", bio: "Full-stack architect obsessed with performance and scalability.", avatar: "/assest/atifmumtaz.png", category: "Developer", color: "#9b4cc9", order: 2 },
  ];

  for (const member of members) {
    const existing = await prisma.teamMember.findUnique({ where: { handle: member.handle } });
    if (!existing) await prisma.teamMember.create({ data: member });
  }
  console.log(`Seeded ${members.length} team members`);

  const workItems = [
    { title: "VALUE TECH", category: "Laptop Store & Electronics", services: "Web · SEO · E-Commerce", year: "2025", url: "https://valuetech.pk", image: "/assest/valuetech.png", gradient: "linear-gradient(135deg,#1a0e00 0%,#0a0a0a 60%,#2a1500 100%)", accent: "#c9a84c", result: "+340% sales growth", tag: "Case Study", order: 1 },
  ];

  for (const item of workItems) {
    const existing = await prisma.workItem.findFirst({ where: { title: item.title } });
    if (!existing) await prisma.workItem.create({ data: item });
  }
  console.log(`Seeded ${workItems.length} work items`);

  const blogPosts = [
    {
      title: "Color Psychology in UI: How to Choose the Right Palette",
      slug: "color-psychology-ui",
      excerpt: "Discover how color choices impact user behavior and learn a framework for selecting palettes that convert.",
      category: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60",
      author: "SAKO Studio",
      published: true,
    },
    {
      title: "Understanding Typography: Crafting a Visual Voice for Your Brand",
      slug: "typography-visual-voice",
      excerpt: "Typography is the visual voice of your brand. Learn how to choose and pair typefaces that communicate your message effectively.",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60",
      author: "SAKO Studio",
      published: true,
    },
    {
      title: "Design Thinking in Practice: How to Solve Real User Problems",
      slug: "design-thinking-practice",
      excerpt: "A practical guide to applying design thinking methodology to solve complex problems and create user-centered solutions.",
      category: "Product Design",
      image: "https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60",
      author: "SAKO Studio",
      published: true,
    },
  ];

  for (const post of blogPosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!existing) await prisma.blogPost.create({ data: post });
  }
  console.log(`Seeded ${blogPosts.length} blog posts`);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
