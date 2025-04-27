import { createClient } from "@supabase/supabase-js"

export class StorageService {
  private supabase

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_KEY || "")
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    try {
      // Define the bucket name
      const bucketName = "teaching-materials"

      // Create the bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await this.supabase.storage.getBucket(bucketName)

      if (bucketError && bucketError.message.includes("not found")) {
        await this.supabase.storage.createBucket(bucketName, {
          public: true,
        })
      }

      // Upload the file
      const { data, error } = await this.supabase.storage.from(bucketName).upload(`uploads/${fileName}`, fileBuffer, {
        contentType,
        upsert: true,
      })

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`)
      }

      // Get the public URL
      const { data: urlData } = this.supabase.storage.from(bucketName).getPublicUrl(`uploads/${fileName}`)

      return urlData.publicUrl
    } catch (error) {
      console.error("Error in uploadFile:", error)
      throw error
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract the path from the URL
      const url = new URL(fileUrl)
      const pathParts = url.pathname.split("/")
      const bucketName = pathParts[1] // Assuming URL format is /bucket-name/...
      const filePath = pathParts.slice(2).join("/")

      // Delete the file
      const { error } = await this.supabase.storage.from(bucketName).remove([filePath])

      if (error) {
        throw new Error(`Error deleting file: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error("Error in deleteFile:", error)
      throw error
    }
  }

  async getFileUrl(filePath: string, bucketName = "teaching-materials"): Promise<string> {
    try {
      // Get the public URL
      const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error in getFileUrl:", error)
      throw error
    }
  }
}
