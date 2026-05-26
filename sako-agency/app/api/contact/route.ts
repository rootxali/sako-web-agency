import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/errorLogger";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = null;
  try {
    body = await req.json();
    const { name, email, company, service, budget, message } = body;

    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Name, email, service, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const sanitized = {
      name: String(name).trim().slice(0, 200),
      email: String(email).toLowerCase().trim().slice(0, 254),
      company: company ? String(company).trim().slice(0, 200) : null,
      service: String(service).trim().slice(0, 100),
      budget: budget ? String(budget).trim().slice(0, 50) : null,
      message: String(message).trim().slice(0, 5000),
    };

    const contactRequest = await prisma.contactRequest.create({
      data: sanitized,
    });

    return NextResponse.json(
      { message: "Message sent successfully", id: contactRequest.id },
      { status: 201 }
    );
  } catch (error) {
    await logError(error as Error, {
      component: 'ContactAPI',
      action: 'create_contact_request',
      additionalData: {
        requestBody: body,
        type: 'api_error',
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
