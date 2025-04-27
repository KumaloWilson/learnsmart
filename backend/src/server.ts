
import dotenv from "dotenv"
import path from "path"
// Load environment variables at the top level
dotenv.config()



import app from "./app"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})