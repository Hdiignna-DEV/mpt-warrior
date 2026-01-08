/**
 * FASE 2.4: Chart Analysis Handler
 * POST /api/trades/analyze-chart
 * 
 * Accepts: multipart/form-data with image file or base64 image
 * Returns: Chart analysis from Gemini vision + Groq brain commentary
 * 
 * Usage:
 * - Upload screenshot from TradeJournal
 * - Get Gemini chart analysis (SNR, rejection, trendlines)
 * - Combine with Groq commentary for actionable insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithWarriorCommander } from '@/lib/ai-service';
import { validateActiveUser } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    // FASE 2.4: Verify authentication
    const { decoded, error } = validateActiveUser(req);
    if (error) return error;


    // FASE 2.4: Parse request - support both FormData and JSON
    const contentType = req.headers.get('Content-Type') || '';
    let imageBase64: string | undefined;
    let userMessage: string = '';

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      const imageFile = formData.get('image') as File;
      const messageText = formData.get('message') as string;

      if (!imageFile) {
        return NextResponse.json(
          { error: '❌ No image file provided' },
          { status: 400 }
        );
      }

      // Validate file
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: '❌ File must be an image' },
          { status: 400 }
        );
      }

      // Convert to base64
      const buffer = await imageFile.arrayBuffer();
      imageBase64 = Buffer.from(buffer).toString('base64');
      userMessage = messageText || 'Analyze this chart screenshot for trading setup quality.';
    } else {
      // Handle JSON body with base64
      const body = await req.json();
      imageBase64 = body.imageBase64;
      userMessage = body.message || 'Analyze this chart screenshot for trading setup quality.';

      if (!imageBase64) {
        return NextResponse.json(
          { error: '❌ No image data provided' },
          { status: 400 }
        );
      }
    }

    // FASE 2.4: Call unified AI service with image
    const aiResult = await analyzeWithWarriorCommander(userMessage, {
      imageBase64,
      conversationHistory: [],
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { error: '❌ AI analysis failed: ' + aiResult.error },
        { status: 500 }
      );
    }

    // FASE 2.4: Return formatted response
    return NextResponse.json({
      success: true,
      analysis: aiResult.response,
      visionData: aiResult.visionData,
      model: aiResult.model,
      analysisType: aiResult.analysisType,
      userId: decoded!.userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ERROR] Chart analysis failed:', error);
    return NextResponse.json(
      {
        error: '❌ Chart analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for testing
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Chart Analysis API',
    endpoint: '/api/trades/analyze-chart',
    methods: ['POST'],
    description: 'Upload chart screenshot for Gemini+Groq analysis',
    requestBody: {
      'multipart/form-data': {
        image: 'File (required) - Chart screenshot',
        message: 'String (optional) - Analysis request message',
      },
      'application/json': {
        imageBase64: 'String (required) - Base64 encoded image',
        message: 'String (optional) - Analysis request message',
      },
    },
    response: {
      success: 'Boolean',
      analysis: 'String - Full AI commentary',
      visionData: 'String - Gemini chart analysis',
      model: 'String - Which AI model was used',
      analysisType: 'String - "vision" or "hybrid"',
      timestamp: 'ISO timestamp',
    },
  });
}
