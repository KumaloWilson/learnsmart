import { createClient } from "@supabase/supabase-js"

export class StorageService {
  private supabase

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_KEY || "")
  }

  async uploadFile(bucketName: string, filePath: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage.from(bucketName).upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      })

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage.from(bucketName).getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`)
    }
  }

  async deleteFile(bucketName: string, filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage.from(bucketName).remove([filePath])

      if (error) {
        throw new Error(`Error deleting file: ${error.message}`)
      }
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }

  getPublicUrl(bucketName: string, filePath: string): string {
    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath)

    return data.publicUrl
  }
}
