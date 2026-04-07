import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  SASProtocol,
} from "@azure/storage-blob"

function getClient() {
  // Aspire injects as ConnectionStrings__blobs; fall back to AZURE_STORAGE_CONNECTION_STRING
  const connectionString =
    process.env.ConnectionStrings__blobs || process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connectionString) {
    throw new Error("No blob storage connection string found (ConnectionStrings__blobs or AZURE_STORAGE_CONNECTION_STRING)")
  }
  return BlobServiceClient.fromConnectionString(connectionString)
}

function getSharedKeyCredential(): StorageSharedKeyCredential {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
  if (!accountName || !accountKey) {
    throw new Error("AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY must be set for SAS generation")
  }
  return new StorageSharedKeyCredential(accountName, accountKey)
}

export type ContainerName =
  | "source-images"
  | "nine-grids"
  | "generated-images"
  | "videos-input"
  | "videos-output"

export async function uploadBlob(
  container: ContainerName,
  blobName: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const client = getClient()
  const containerClient = client.getContainerClient(container)
  await containerClient.createIfNotExists()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  await blockBlobClient.uploadData(data, {
    blobHTTPHeaders: { blobContentType: contentType },
  })
  // Return a proxy URL that works from the browser
  return `/api/blobs/${container}/${blobName}`
}

export async function downloadBlob(
  container: ContainerName,
  blobName: string
): Promise<Buffer> {
  const client = getClient()
  const containerClient = client.getContainerClient(container)
  const blobClient = containerClient.getBlobClient(blobName)
  const response = await blobClient.download(0)
  const chunks: Buffer[] = []
  for await (const chunk of response.readableStreamBody!) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

export function generateSasUrl(
  container: ContainerName,
  blobName: string,
  expiryMinutes = 60
): string {
  const credential = getSharedKeyCredential()
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!

  const startsOn = new Date()
  const expiresOn = new Date(startsOn.getTime() + expiryMinutes * 60 * 1000)

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https,
    },
    credential
  ).toString()

  return `https://${accountName}.blob.core.windows.net/${container}/${blobName}?${sasToken}`
}
