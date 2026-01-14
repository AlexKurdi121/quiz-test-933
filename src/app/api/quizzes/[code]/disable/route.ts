// src/app/api/quizzes/[code]/disable/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> } // ✅ Use Promise for params
) {
  // ✅ Await the params promise
  const { code } = await context.params;

  if (!code) {
    return NextResponse.json(
      { error: "Quiz code required" },
      { status: 400 }
    );
  }

  try {
    const quiz = await prisma.quiz.update({
      where: { code },
      data: { started: false },
    });

    return NextResponse.json(quiz);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Quiz not found" },
      { status: 404 }
    );
  }
}