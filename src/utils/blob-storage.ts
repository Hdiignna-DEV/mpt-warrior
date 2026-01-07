/**
 * Azure Blob Storage Helper
 * - Upload, get URL, and delete blobs
 */

import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER || 'educational-assets';

// Check if Blob Storage is configured
const isBlobStorageConfigured = !!AZURE_STORAGE_CONNECTION_STRING;

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: any = null;

if (isBlobStorageConfigured) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    console.log('✅ Azure Blob Storage configured');
  } catch (error) {
    console.warn('⚠️ Azure Blob Storage initialization failed:', error);
  }
} else {
  console.log('ℹ️ Azure Blob Storage not configured (optional feature)');
}

export async function uploadBlob(file: Buffer | Uint8Array, blobName: string, contentType: string): Promise<string> {
  if (!containerClient) {
    throw new Error('Azure Blob Storage is not configured. Add AZURE_STORAGE_CONNECTION_STRING to .env.local');
  }
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blockBlobClient.url;
}

export async function getBlobUrl(blobName: string): Promise<string> {
  if (!containerClient) {
    throw new Error('Azure Blob Storage is not configured');
  }
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  return blockBlobClient.url;
}

export async function deleteBlob(blobName: string): Promise<void> {
  if (!containerClient) {
    throw new Error('Azure Blob Storage is not configured');
  }
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
}

export function isBlobStorageAvailable(): boolean {
  return isBlobStorageConfigured && containerClient !== null;
}
