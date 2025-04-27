import { createClient, SupabaseClient } from "@supabase/supabase-js"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"]

export class StorageService {
  private supabase: SupabaseClient

  constructor() {
    // Output debugging information
    console.log("Current working directory:", process.cwd())
    console.log("Supabase URL from env:", process.env.SUPABASE_URL)
    console.log("Supabase key exists:", !!process.env.SUPABASE_SERVICE_KEY)
    
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials are not set. Please check your .env file.")
      throw new Error("Supabase credentials are missing. Please check your .env file.")
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey)
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    try {
      const bucketName = "teaching-materials"

      // Check MIME type
      if (!ALLOWED_MIME_TYPES.includes(contentType)) {
        throw new Error(`File type ${contentType} is not allowed.`)
      }

      // Check if the bucket exists, create it if not
      const { data: bucketData, error: bucketError } = await this.supabase.storage.getBucket(bucketName)

      if (bucketError) {
        if (bucketError.message.toLowerCase().includes("not found")) {
          await this.supabase.storage.createBucket(bucketName, { public: true })
          console.log(`Bucket '${bucketName}' created.`)
        } else {
          throw new Error(`Bucket check error: ${bucketError.message}`)
        }
      }

      // Upload the file
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(`uploads/${fileName}`, fileBuffer, {
          contentType,
          upsert: true,
        })

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`)
      }

      // Retrieve the public URL of the uploaded file
      const { data: urlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(`uploads/${fileName}`)

      if (!urlData?.publicUrl) {
        throw new Error("Failed to generate public URL after upload.")
      }

      return urlData.publicUrl
    } catch (error) {
      console.error("Error in uploadFile:", (error as Error).message)
      throw error
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract path and file info from the URL
      const url = new URL(fileUrl)
      const pathParts = url.pathname.split("/")
      const bucketName = pathParts[1]
      const filePath = pathParts.slice(2).join("/")

      // Delete the file from storage
      const { error } = await this.supabase.storage.from(bucketName).remove([filePath])

      if (error) {
        throw new Error(`Error deleting file: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error("Error in deleteFile:", (error as Error).message)
      throw error
    }
  }

  async getFileUrl(filePath: string, bucketName = "teaching-materials"): Promise<string> {
    try {
      // Get the public URL
      const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath)

      if (!data?.publicUrl) {
        throw new Error("Failed to retrieve public URL.")
      }

      return data.publicUrl
    } catch (error) {
      console.error("Error in getFileUrl:", (error as Error).message)
      throw error
    }
  }
}