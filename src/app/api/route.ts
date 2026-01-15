import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MPT Trading HUB</title>
      </head>
      <body>
        <h1>Hello from root route handler</h1>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
