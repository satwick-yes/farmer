import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url), { status: 303 });
  response.cookies.delete('userId');
  response.cookies.delete('userRole');
  return response;
}
