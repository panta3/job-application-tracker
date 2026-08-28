import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApplicationSchema } from "@/lib/validation";

// GET /api/applications — list all
export async function GET() {
  // TODO: support ?status= filter
  const applications = await prisma.application.findMany({
    orderBy: { lastUpdated: "desc" },
  });
  return NextResponse.json(applications);
}

// POST /api/applications — create one
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = createApplicationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const application = await prisma.application.create({ data: result.data });
  return NextResponse.json(application, { status: 201 });
}
