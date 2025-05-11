// This is a placeholder implementation. Replace with actual API calls.

export async function getSemesters() {
  // In a real app, this would call your backend API
  return [
    { id: "1", name: "Fall 2023" },
    { id: "2", name: "Spring 2024" },
    { id: "3", name: "Summer 2024" },
  ]
}

export async function getPrograms() {
  // In a real app, this would call your backend API
  return [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Information Technology" },
    { id: "3", name: "Software Engineering" },
  ]
}

export async function getDashboardData() {
  // In a real app, this would call your backend API
  return {
    stats: {
      enrolledCourses: 3,
      upcomingAssessments: 5,
      upcomingClasses: 2,
      averageGrade: 87.5,
    },
    upcomingAssessments: [
      {
        id: "1",
        title: "Midterm Assignment",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        course: "Introduction to Computer Science",
      },
      {
        id: "2",
        title: "Final Project",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        course: "Web Development",
      },
    ],
    upcomingClasses: [
      {
        id: "1",
        title: "Introduction to Algorithms",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        course: "Data Structures and Algorithms",
      },
      {
        id: "2",
        title: "Web Development Fundamentals",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        course: "Web Development",
      },
    ],
    recentMaterials: [
      {
        id: "1",
        title: "HTML & CSS Reference Guide",
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        course: "Web Development",
      },
      {
        id: "2",
        title: "Algorithm Analysis Lecture",
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        course: "Data Structures and Algorithms",
      },
    ],
    courseMasteryData: [
      { course: "Introduction to Computer Science", mastery: 75 },
      { course: "Data Structures and Algorithms", mastery: 60 },
      { course: "Web Development", mastery: 40 },
    ],
  }
}
