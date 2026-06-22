import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { AppData } from '@/lib/types';

export async function GET() {
  try {
    const data = await readDB();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read database:', error);
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data: AppData = await request.json();
    await writeDB(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to write database:', error);
    return NextResponse.json({ error: 'Failed to write database' }, { status: 500 });
  }
}
