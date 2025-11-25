import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get('admin');
    const isAdmin = adminCookie?.value === 'true';
    
    return NextResponse.json({ isAdmin });
}

