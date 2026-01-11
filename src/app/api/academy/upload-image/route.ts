/**
 * API Route: /api/academy/upload-image
 * POST - Upload image to Azure Blob Storage
 * Body: multipart/form-data { file }
 * Returns: { url }
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadBlob } from '@/utils/blob-storage';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs'; // Required for Buffer

export async function POST(request: NextRequest) {
  try {
    // Only allow multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = (formData as any).get?.('file') as File | undefined;
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop() || 'jpg';
    const blobName = `academy/${uuidv4()}.${ext}`;

    // Upload to Azure Blob Storage
    const url = await uploadBlob(buffer, blobName, file.type);

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image', details: error.message }, { status: 500 });
  }
}
