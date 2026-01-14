// src/app/api/quizzes/[code]/submit/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: Promise<{ code: string }> }) {
  try {
    // unwrap params
    const { code } = await context.params;

    if (!code) {
      return NextResponse.json({ error: "Quiz code required" }, { status: 400 });
    }

    // read request body
    const body = await req.json();
    const { name, answers } = body;

    if (!name || !answers) {
      return NextResponse.json({ error: "Name and answers are required" }, { status: 400 });
    }

    // find the quiz
    const quiz = await prisma.quiz.findUnique({
      where: { code },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score += 1;
    });

    // store participant
    const participant = await prisma.participant.create({
      data: {
        name,
        answers,
        score,
        quiz: { connect: { id: quiz.id } },
      },
    });

    return NextResponse.json({ participant, score });
  } catch (error: any) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
