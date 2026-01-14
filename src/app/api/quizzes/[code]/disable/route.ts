// src/app/api/quizzes/[code]/disable/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

interface Params {
  code: string;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<Params> } // ✅ This is what Next.js expects
) {
  const { code } = await context.params; // ✅ Await the promise

  if (!code) {
    return NextResponse.json({ error: "Quiz code required" }, { status: 400 });
  }

  try {
    const quiz = await prisma.quiz.update({
      where: { code },
      data: { started: false },
    });

    return NextResponse.json(quiz);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to disable quiz", details: (err as any).message },
      { status: 500 }
    );
  }
}
