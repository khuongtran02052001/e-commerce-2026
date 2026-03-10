import { auth } from '@/lib/auth';
import { fetchServiceServer } from '@/lib/restClient';
import { NextRequest, NextResponse } from 'next/server';

type ProxyOptions = {
  service?: 'system' | 'blog';
  requireAuth?: boolean;
};

export const proxyToService = async (
  req: NextRequest,
  path: string,
  options?: ProxyOptions,
) => {
  const { service = 'system', requireAuth = true } = options || {};
  const session = await auth();

  if (requireAuth && !session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const search = req.nextUrl.search;
  const url = search ? `${path}${search}` : path;
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? await req.text() : undefined;
  const contentType = req.headers.get('content-type') || undefined;

  const res = await fetchServiceServer(url, {
    method: req.method,
    body,
    headers: contentType ? { 'Content-Type': contentType } : undefined,
    accessToken: session?.accessToken,
    service,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/json',
    },
  });
};
