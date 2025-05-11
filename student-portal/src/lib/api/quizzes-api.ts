// This is a placeholder implementation. Replace with actual API calls.

export async function getQuizzes() {
  // In a real app, this would call your backend API
  return [
    {
      id: "1",
      title: "Computer Science Fundamentals Quiz",
      description: "Test your knowledge of basic computer science concepts.",
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      duration: 30, // minutes
      totalQuestions: 20,
      course: {
        id: "1",
        name: "Introduction to Computer Science",
      },
      status: "available",
      maxAttempts: 2,
      attempts: 0,
    },
    {
      id: "2",
      title: "Data Structures Midterm",
      description: "Comprehensive assessment of data structures concepts covered so far.",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
      duration: 60, // minutes
      totalQuestions: 30,
      course: {
        id: "2",
        name: "Data Structures and Algorithms",
      },
      status: "upcoming",
      maxAttempts: 1,
      attempts: 0,
    },
    {
      id: "3",
      title: "HTML & CSS Quiz",
      description: "Test your knowledge of HTML and CSS fundamentals.",
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      duration: 20, // minutes
      totalQuestions: 15,
      course: {
        id: "3",
        name: "Web Development",
      },
      status: "completed",
      maxAttempts: 2,
      attempts: 1,
      bestScore: 85,
      lastAttemptId: "attempt-123",
    },
  ]
}

export async function getQuizById(quizId: string) {
  // In a real app, this would call your backend API
  const quizzes = await getQuizzes()
  return quizzes.find((quiz) => quiz.id === quizId)
}



export async function getQuizAttemptById(quizId: string) {
  // In a real app, this would call your backend API
  const quizzes = await getQuizzes()
  return quizzes.find((quiz) => quiz.id === quizId)
}


export async function getQuizQuestions(quizId: string, attemptId: string) {
  // In a real app, this would call your backend API
  return [
    {
      id: "q1",
      text: "What is the time complexity of binary search?",
      type: "single_choice",
      options: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
      required: true,
      points: 5,
    },
    {
      id: "q2",
      text: "Which of the following are valid ways to create a JavaScript object? (Select all that apply)",
      type: "multiple_choice",
      options: [
        { id: "a", text: "var obj = {}" },
        { id: "b", text: "var obj = new Object()" },
        { id: "c", text: "var obj = Object.create(null)" },
        { id: "d", text: "var obj = Object.assign({})" },
      ],
      required: true,
      points: 5,
    },
    {
      id: "q3",
      text: "Explain the difference between stack and queue data structures.",
      type: "text",
      required: true,
      points: 10,
    },
    {
      id: "q4",
      text: "Is JavaScript a statically typed language?",
      type: "true_false",
      required: true,
      points: 5,
    },
    {
      id: "q5",
      text: "What is the output of the following code?\n\nconst arr = [1, 2, 3];\nconst result = arr.map(x => x * 2);\nconsole.log(result);",
      type: "single_choice",
      options: [
        { id: "a", text: "[1, 2, 3]" },
        { id: "b", text: "[2, 4, 6]" },
        { id: "c", text: "undefined" },
        { id: "d", text: "Error" },
      ],
      required: true,
      points: 5,
    },
  ]
}

export async function submitQuizAttempt(quizId: string, data: any) {
  // In a real app, this would call your backend API
  return {
    attemptId: "attempt-" + Math.random().toString(36).substring(2, 9),
    score: 85,
    maxScore: 100,
    completedAt: new Date().toISOString(),
  }
}

export async function getQuizResults(quizId: string, attemptId: string) {
  // In a real app, this would call your backend API
  return {
    score: 85,
    maxScore: 100,
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    timeSpent: 18, // minutes
    questions: [
      {
        id: "q1",
        text: "What is the time complexity of binary search?",
        type: "single_choice",
        options: [
          { id: "a", text: "O(1)" },
          { id: "b", text: "O(log n)" },
          { id: "c", text: "O(n)" },
          { id: "d", text: "O(n log n)" },
        ],
        correctOptionIds: ["b"],
        userAnswer: ["b"],
        isCorrect: true,
        points: 5,
        maxPoints: 5,
      },
      // More questions...
    ],
  }

  
}
