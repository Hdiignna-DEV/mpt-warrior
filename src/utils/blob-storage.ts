/**
 * Azure Blob Storage Helper
 * - Upload, get URL, and delete blobs
 */

import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER || 'educational-assets';

// DEBUG LOG: cek apakah env var terbaca (jangan log value aslinya)
console.log('DEBUG: AZURE_STORAGE_CONNECTION_STRING is', AZURE_STORAGE_CONNECTION_STRING ? 'SET' : 'NOT SET');

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING env variable');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

export async function uploadBlob(file: Buffer | Uint8Array, blobName: string, contentType: string): Promise<string> {
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blockBlobClient.url;
}

export async function getBlobUrl(blobName: string): Promise<string> {
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  return blockBlobClient.url;
}

export async function deleteBlob(blobName: string): Promise<void> {
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
}
