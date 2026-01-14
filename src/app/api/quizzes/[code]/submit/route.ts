import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest, 
  context: { params: Promise<{ code: string }> } // ✅ Add Promise wrapper
) {
  const { code } = await context.params; // ✅ Await the params
  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  try {
    const { name, answers } = await req.json();
    if (!name || !answers) return NextResponse.json({ error: "Name and answers are required" }, { status: 400 });

    const quiz = await prisma.quiz.findUnique({ 
      where: { code }, 
      include: { questions: true } 
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
        quizId: quiz.id,
      }
    });

    return NextResponse.json({ 
      participant: {
        id: participant.id,
        name: participant.name,
        answers: participant.answers,
        score: participant.score,
      }, 
      score 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}