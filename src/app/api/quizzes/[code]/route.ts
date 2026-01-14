// src/app/api/quizzes/[code]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

async function getParams(context: { params: { code: string } | Promise<{ code: string }> }) {
  return context.params instanceof Promise ? await context.params : context.params;
}

export async function GET(_: NextRequest, context: { params: { code: string } | Promise<{ code: string }> }) {
  const { code } = await getParams(context);
  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  const quiz = await prisma.quiz.findUnique({
    where: { code },
    include: { questions: true, participants: true },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  return NextResponse.json(quiz);
}

export async function PUT(req: NextRequest, context: { params: { code: string } | Promise<{ code: string }> }) {
  const { code } = await getParams(context);
  const body = await req.json();
  const { title, questions } = body;

  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  const quiz = await prisma.quiz.update({
    where: { code },
    data: {
      title,
      questions: {
        deleteMany: {},
        create: questions,
      },
    },
    include: { questions: true, participants: true },
  });

  return NextResponse.json(quiz);
}

export async function DELETE(_: NextRequest, context: { params: { code: string } | Promise<{ code: string }> }) {
  const { code } = await getParams(context);
  if (!code) return NextResponse.json({ error: "Quiz code required" }, { status: 400 });

  await prisma.participant.deleteMany({ where: { quiz: { code } } });
  await prisma.question.deleteMany({ where: { quiz: { code } } });
  await prisma.quiz.delete({ where: { code } });

  return NextResponse.json({ message: `Quiz ${code} deleted successfully` });
}
