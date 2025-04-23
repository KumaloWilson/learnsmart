import type { QueryInterface } from "sequelize"

export async function up(queryInterface: QueryInterface): Promise<void> {
  // This migration doesn't modify the database schema
  // It's a reminder to add the following environment variables:
  // SUPABASE_URL
  // SUPABASE_SERVICE_KEY

  console.log("Please add the following environment variables:")
  console.log("SUPABASE_URL - Your Supabase project URL")
  console.log("SUPABASE_SERVICE_KEY - Your Supabase service role key")
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // No changes to revert
}
