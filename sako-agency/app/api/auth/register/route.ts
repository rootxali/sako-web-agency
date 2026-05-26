import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logError } from "@/lib/errorLogger";

const ADMIN_REGISTRATION_SECRET = process.env.ADMIN_REGISTRATION_SECRET;

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
        const { name, email, password, registrationSecret } = body;

        // Require a secret token to prevent open registration
        if (!ADMIN_REGISTRATION_SECRET || registrationSecret !== ADMIN_REGISTRATION_SECRET) {
            return NextResponse.json(
                { error: "Unauthorized. Admin registration requires a valid registration secret." },
                { status: 403 }
            );
        }

        // Validate inputs
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (typeof password !== "string" || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
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

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name: typeof name === "string" ? name.trim().slice(0, 100) : null,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Account created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        // Log the error to our backend service
        await logError(error as Error, {
            component: 'AuthRegisterAPI',
            action: 'create_user',
            additionalData: {
                email: body?.email,
                type: 'api_error'
            }
        });

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
