export interface CourseMaterial {
  id: string
  title: string
  courseId: string
  type: "pdf" | "video" | "document" | "link"
  url: string
  dateAdded: string
}
