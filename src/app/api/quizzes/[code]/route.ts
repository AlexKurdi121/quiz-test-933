import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  const quiz = await prisma.quiz.findUnique({
    where: { code },
    include: { questions: true, participants: true },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  return NextResponse.json(quiz);
}

// PUT handler already here
export async function PUT(req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const body = await req.json();
  const { title, questions } = body;

  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  const quiz = await prisma.quiz.update({
    where: { code },
    data: {
      title,
      questions: {
        deleteMany: {}, // remove old questions
        create: questions,
      },
    },
    include: { questions: true, participants: true },
  });

  return NextResponse.json(quiz);
}

// ✅ Add DELETE
export async function DELETE(_: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  // Delete quiz and related questions and participants
  await prisma.participant.deleteMany({ where: { quiz: { code } } });
  await prisma.question.deleteMany({ where: { quiz: { code } } });
  await prisma.quiz.delete({ where: { code } });

  return NextResponse.json({ message: `Quiz ${code} deleted successfully` });
}
