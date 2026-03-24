// IPFS service for metadata upload

export class IPFSService {
  async uploadMetadata(image: File, description: string, tokenName: string): Promise<string> {
    // Implementation for uploading to IPFS via Pinata
    console.log('Uploading metadata:', { image, description, tokenName })
    return 'ipfs://mock-uri'
  }

  async getMetadata(uri: string): Promise<Record<string, unknown>> {
    console.log('Getting metadata from:', uri)
    return {}
  }
}

export const ipfsService = new IPFSService()