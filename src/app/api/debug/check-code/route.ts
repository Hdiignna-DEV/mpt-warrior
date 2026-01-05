/**
 * Debug endpoint to check invitation code in database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCodesContainer } from '@/lib/db/cosmos-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code parameter required' }, { status: 400 });
    }

    const container = getCodesContainer();

    // Try direct read with different variations
    const results: any = {
      input: code,
      attempts: []
    };

    // Attempt 1: Exact match
    try {
      const { resource } = await container.item(code, code).read();
      results.attempts.push({
        method: 'Direct read (exact)',
        input: code,
        success: !!resource,
        resource: resource
      });
    } catch (error: any) {
      results.attempts.push({
        method: 'Direct read (exact)',
        input: code,
        success: false,
        error: error.message,
        code: error.code
      });
    }

    // Attempt 2: Uppercase
    const upperCode = code.toUpperCase();
    try {
      const { resource } = await container.item(upperCode, upperCode).read();
      results.attempts.push({
        method: 'Direct read (uppercase)',
        input: upperCode,
        success: !!resource,
        resource: resource
      });
    } catch (error: any) {
      results.attempts.push({
        method: 'Direct read (uppercase)',
        input: upperCode,
        success: false,
        error: error.message,
        code: error.code
      });
    }

    // Attempt 3: Query all codes starting with prefix
    try {
      const prefix = code.split('-')[0]; // Get first part (e.g., "MPT")
      const query = {
        query: 'SELECT * FROM c WHERE STARTSWITH(c.code, @prefix)',
        parameters: [{ name: '@prefix', value: prefix }]
      };
      
      const { resources } = await container.items.query(query, {
        maxItemCount: 10
      }).fetchAll();
      
      results.attempts.push({
        method: 'Query (prefix match)',
        prefix: prefix,
        success: true,
        found: resources.length,
        codes: resources.map(r => ({
          code: r.code,
          id: r.id,
          is_active: r.is_active,
          usage: `${r.used_count}/${r.max_uses}`
        }))
      });
    } catch (error: any) {
      results.attempts.push({
        method: 'Query (prefix match)',
        success: false,
        error: error.message
      });
    }

    // Attempt 4: Query exact match case-insensitive
    try {
      const query = {
        query: 'SELECT * FROM c WHERE UPPER(c.code) = UPPER(@code)',
        parameters: [{ name: '@code', value: code }]
      };
      
      const { resources } = await container.items.query(query).fetchAll();
      
      results.attempts.push({
        method: 'Query (case-insensitive)',
        input: code,
        success: true,
        found: resources.length,
        resource: resources[0]
      });
    } catch (error: any) {
      results.attempts.push({
        method: 'Query (case-insensitive)',
        success: false,
        error: error.message
      });
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Debug check-code error:', error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
