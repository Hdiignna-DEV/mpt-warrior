/**
 * Debug endpoint to check environment variables
 * TEMPORARY - DELETE after debugging
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    hasConnectionString: !!process.env.AZURE_COSMOS_CONNECTION_STRING,
    hasEndpoint: !!process.env.AZURE_COSMOS_ENDPOINT,
    hasKey: !!process.env.AZURE_COSMOS_KEY,
    hasDatabase: !!process.env.AZURE_COSMOS_DATABASE,
    connectionStringType: typeof process.env.AZURE_COSMOS_CONNECTION_STRING,
    endpointType: typeof process.env.AZURE_COSMOS_ENDPOINT,
    keyType: typeof process.env.AZURE_COSMOS_KEY,
    databaseType: typeof process.env.AZURE_COSMOS_DATABASE,
    allCosmosEnvVars: Object.keys(process.env).filter(k => k.includes('COSMOS')),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  };

  return NextResponse.json(envCheck);
}
