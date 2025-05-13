// This is a placeholder implementation. Replace with actual API calls.

export async function getMaterials() {
  // In a real app, this would call your backend API
  return [
    {
      id: "1",
      title: "Introduction to Computer Science Slides",
      description: "Lecture slides covering the fundamental concepts of computer science.",
      type: "presentation",
      fileUrl: "/materials/cs101-slides.pdf",
      uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      course: {
        id: "1",
        name: "Introduction to Computer Science",
      },
      fileSize: 2500000, // 2.5 MB
      fileType: "PDF",
    },
    {
      id: "2",
      title: "Data Structures Tutorial",
      description: "Video tutorial explaining common data structures and their implementations.",
      type: "video",
      fileUrl: "/materials/data-structures-tutorial.mp4",
      uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      course: {
        id: "2",
        name: "Data Structures and Algorithms",
      },
      fileSize: 150000000, // 150 MB
      fileType: "MP4",
      thumbnailUrl: "/thumbnails/data-structures-tutorial.jpg",
    },
    {
      id: "3",
      title: "HTML & CSS Reference Guide",
      description: "A comprehensive reference guide for HTML and CSS.",
      type: "document",
      fileUrl: "/materials/html-css-guide.pdf",
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      course: {
        id: "3",
        name: "Web Development",
      },
      fileSize: 5000000, // 5 MB
      fileType: "PDF",
    },
    {
      id: "4",
      title: "JavaScript Basics",
      description: "An introduction to JavaScript programming language.",
      type: "link",
      externalUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      course: {
        id: "3",
        name: "Web Development",
      },
    },
    {
      id: "5",
      title: "Algorithm Analysis Lecture",
      description: "Audio recording of the lecture on algorithm analysis.",
      type: "audio",
      fileUrl: "/materials/algorithm-analysis.mp3",
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      course: {
        id: "2",
        name: "Data Structures and Algorithms",
      },
      fileSize: 30000000, // 30 MB
      fileType: "MP3",
    },
  ]
}

export async function getMaterialById(materialId: string) {
  // In a real app, this would call your backend API
  const materials = await getMaterials()
  return materials.find((material) => material.id === materialId)
}
