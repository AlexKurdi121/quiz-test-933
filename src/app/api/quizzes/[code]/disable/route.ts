// src/app/api/quizzes/[code]/disable/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_: Request, context: { params: Promise<{ code: string }> }) {
  const params = await context.params;
  const { code } = params;

  if (!code) {
    return NextResponse.json({ error: "Quiz code required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.update({
    where: { code },
    data: { started: false },
  });

  return NextResponse.json(quiz);
}
