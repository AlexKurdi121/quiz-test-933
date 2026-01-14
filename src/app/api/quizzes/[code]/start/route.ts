// src/app/api/quizzes/[code]/start/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

async function getParams(context: { params: { code: string } | Promise<{ code: string }> }) {
  return context.params instanceof Promise ? await context.params : context.params;
}

export async function POST(_: NextRequest, context: { params: { code: string } | Promise<{ code: string }> }) {
  const { code } = await getParams(context);
  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  try {
    const quiz = await prisma.quiz.update({
      where: { code },
      data: { started: true },
    });
    return NextResponse.json(quiz);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Quiz not found" }, { status: 404 });
  }
}
