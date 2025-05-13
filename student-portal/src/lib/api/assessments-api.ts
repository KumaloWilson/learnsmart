// This is a placeholder implementation. Replace with actual API calls.

export async function getAssessments() {
  // In a real app, this would call your backend API
  return [
    {
      id: "1",
      title: "Midterm Assignment",
      description: "Complete the programming assignment on data structures.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      type: "Assignment",
      status: "active",
      course: {
        id: "1",
        name: "Introduction to Computer Science",
      },
    },
    {
      id: "2",
      title: "Final Project",
      description: "Develop a web application using the technologies learned in class.",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      type: "Project",
      status: "active",
      course: {
        id: "3",
        name: "Web Development",
      },
    },
    {
      id: "3",
      title: "Algorithm Analysis",
      description: "Analyze the time and space complexity of the provided algorithms.",
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      type: "Assignment",
      status: "submitted",
      course: {
        id: "2",
        name: "Data Structures and Algorithms",
      },
      submissionStatus: {
        submitted: true,
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      },
    },
    {
      id: "4",
      title: "Binary Search Implementation",
      description: "Implement a binary search algorithm and analyze its performance.",
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      type: "Assignment",
      status: "graded",
      course: {
        id: "2",
        name: "Data Structures and Algorithms",
      },
      submissionStatus: {
        submitted: true,
        submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
        grade: 92,
        maxGrade: 100,
        feedback: "Excellent work! Your implementation is efficient and well-documented.",
      },
    },
  ]
}

export async function getAssessmentById(assessmentId: string) {
  // In a real app, this would call your backend API
  const assessments = await getAssessments()
  return assessments.find((assessment) => assessment.id === assessmentId)
}

export async function submitAssessment(assessmentId: string, submission: any) {
  // In a real app, this would call your backend API
  return { success: true }
}
