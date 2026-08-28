import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateApplicationSchema } from "@/lib/validation";

// PATCH /api/applications/:id — update status/notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const result = updateApplicationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const application = await prisma.application.update({
    where: { id },
    data: result.data,
  });
  return NextResponse.json(application);
}

// DELETE /api/applications/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.application.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
