// src/app/api/quizzes/[code]/disable/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  if (!code) {
    return NextResponse.json(
      { error: "Quiz code required" },
      { status: 400 }
    );
  }

  const quiz = await prisma.quiz.update({
    where: { code },
    data: { started: false },
  });

  return NextResponse.json(quiz);
}
