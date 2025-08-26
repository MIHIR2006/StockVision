import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/authOptions';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    include: { holdings: true },
  });

  return NextResponse.json(portfolios);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await req.json();

  const portfolio = await prisma.portfolio.create({
    data: {
      name,
      userId: session.user.id,
    },
  });

  return NextResponse.json(portfolio, { status: 201 });
}
