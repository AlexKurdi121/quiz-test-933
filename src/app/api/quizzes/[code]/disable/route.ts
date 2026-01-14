// src/app/api/quizzes/[code]/disable/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: { code: string } | Promise<{ code: string }> } // ✅ support promise
) {
  // unwrap params safely
  const params =
    context.params instanceof Promise ? await context.params : context.params;
  const code = params.code;

  if (!code) {
    return NextResponse.json({ error: "Quiz code required" }, { status: 400 });
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
