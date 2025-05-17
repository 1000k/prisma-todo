// app/api/todos/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: Params) {
  const id = Number(params.id);

  // 既存の Todo を取得
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 完了フラグをトグル
  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const id = Number(params.id);
  await prisma.todo.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Deleted' });
}

export async function PUT(req: Request, { params }: Params) {
  const id = Number(params.id);
  const { title } = await req.json();

  const updated = await prisma.todo.update({
    where: { id },
    data: { title },
  });

  return NextResponse.json(updated);
}
