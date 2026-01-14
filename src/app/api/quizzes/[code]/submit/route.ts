// src/app/api/quizzes/[code]/submit/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

async function getParams(context: { params: { code: string } | Promise<{ code: string }> }) {
  return context.params instanceof Promise ? await context.params : context.params;
}

export async function POST(req: NextRequest, context: { params: { code: string } | Promise<{ code: string }> }) {
  try {
    const { code } = await getParams(context);
    if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

    const body = await req.json();
    const { name, answers } = body;
    if (!name || !answers) return NextResponse.json({ error: "Name and answers are required" }, { status: 400 });

    const quiz = await prisma.quiz.findUnique({
      where: { code },
      include: { questions: true },
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    const participant = await prisma.participant.create({
      data: {
        name,
        answers,
        score,
        quizId: quiz.id, // adjust if your schema uses quizId
      },
    });

    return NextResponse.json({ participant, score });
  } catch (error: any) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
