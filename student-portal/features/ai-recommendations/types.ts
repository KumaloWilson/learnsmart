export interface Recommendation {
  id: string
  type: "course" | "resource" | "study" | "practice"
  title: string
  description: string
  relevanceScore: number
  link?: string
}
