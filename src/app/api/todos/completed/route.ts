import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE() {
  await prisma.todo.deleteMany({
    where: { completed: true },
  });

  return NextResponse.json({ message: 'Completed todos deleted' });
}
