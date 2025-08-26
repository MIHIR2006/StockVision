import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/authOptions';
import { prisma } from '../../../../lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();
  const portfolioId = Number(params.id);

  const portfolio = await prisma.portfolio.update({
    where: { id: portfolioId },
    data: { name },
  });

  return NextResponse.json(portfolio);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const portfolioId = Number(params.id);

  await prisma.portfolio.delete({
    where: { id: portfolioId },
  });

  return NextResponse.json({ message: 'Portfolio deleted' });
}
