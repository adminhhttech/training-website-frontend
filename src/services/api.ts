

// services/api.ts
const API_BASE_URL = "https://training-backend-wine.vercel.app/api"
const MOCK_TEST_BASE_URL = "https://training-backend-wine.vercel.app/api/mock-test"

export interface AIQuestion {
  id: number
  topic: string
  question: string
  options: string[]
  correct_answer: string
}

export interface AIGeneratedTest {
  test_name: string
  total_questions: number
  topics: string[]
  questions: AIQuestion[]
}

export interface ExplanationResponse {
  explanation: {
    question: string
    user_answer: string
    correct_answer: string
    explanation: string
  }
}

export interface ActivityData {
  date: string
  correctAnswers: number
  questionsAttempted: number
  testsCompleted: number
  topics: string[]
}

export interface AddActivityPayload {
  userId: string
  testsCompleted: number
  questionsAttempted: number
  correctAnswers: number
  topic: string
}

// Course-related interfaces
export interface ApiCourse {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  totalCompletion: number;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  prerequisites: string[];
  relatedCourses: string[];
  previewVideoUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: ApiModule[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ApiModule {
  _id: string;
  title: string;
  description: string;
  duration: string;
  completionPercentage: number;
  course_id: string;
  content: ApiContentBlock[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ApiContentBlock {
  _id: string;
  type: 'video' | 'theory' | 'mcq' | 'coding';
  title: string;
  duration: string;
  module_id: string;
  data: any;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Custom error class
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string,
    public details?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token")
  }
  return null
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  const token = getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

// Retry wrapper
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  context = "API call",
): Promise<T> {
  let lastError: Error = new Error("Unknown error")

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.log(`[API] ${context} - Attempt ${attempt}/${maxRetries} failed: ${lastError.message}`)

      if (error instanceof APIError && error.status && error.status >= 400 && error.status < 500) {
        throw error
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.log(`[API] Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = getAuthToken()

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  },

  // Course methods
  async createCourse(courseData: any) {
    return this.request("/course/create_courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    })
  },

  async getCourses() {
    return this.request("/course/get_courses")
  },

  // Get courses by category - FIXED VERSION
  async getCoursesByCategory(category: string): Promise<ApiCourse[]> {
    return retryWithBackoff(
      async () => {
        console.log(`[API] Fetching courses for category: ${category}`)
        
        const headers = getAuthHeaders()
        console.log(`[API] Auth headers:`, headers)
        
        const response = await fetch(`${API_BASE_URL}/course/category/${category}`, {
          method: 'GET',
          headers: headers,
        })

        console.log(`[API] Response status: ${response.status}`)
        console.log(`[API] Response headers:`, Object.fromEntries(response.headers.entries()))

        if (response.status === 401) {
          // Clear token if unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem("token")
          }
          throw new APIError(
            "Unauthorized: Please login again",
            401,
            `/course/category/${category}`,
            "Authentication token is invalid or expired"
          )
        }

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[API] Error response:`, errorText)
          throw new APIError(
            `Failed to fetch ${category} courses: ${response.status}`,
            response.status,
            `/course/category/${category}`,
            errorText
          )
        }

        const data = await response.json()
        console.log(`[API] Successfully fetched ${data.length} ${category} courses`)
        return data
      },
      3,
      1000,
      `getCoursesByCategory(${category})`
    )
  },

  async getCourseById(courseId: string): Promise<ApiCourse> {
    return retryWithBackoff(
      async () => {
        const headers = getAuthHeaders()
        
        const response = await fetch(`${API_BASE_URL}/course/${courseId}`, {
          method: 'GET',
          headers: headers,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new APIError(
            `Failed to fetch course: ${response.status}`,
            response.status,
            `/course/${courseId}`,
            errorText
          )
        }

        const data = await response.json()
        return data
      },
      3,
      1000,
      `getCourseById(${courseId})`
    )
  },

  async updateCourse(courseId: string, courseData: any) {
    return this.request(`/course/update_course/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    })
  },

  async deleteCourse(courseId: string) {
    return this.request(`/course/delete_course/${courseId}`, {
      method: "DELETE",
    })
  },

  // Mock Test methods
  async generateMockTest(topic: string, numQuestions = 10): Promise<AIGeneratedTest> {
    console.log(`[API] 🚀 Starting generateMockTest`)
    console.log(`[API] 📝 Topic: "${topic}"`)
    console.log(`[API] 🔢 Num Questions: ${numQuestions}`)

    return retryWithBackoff(
      async () => {
        const requestBody = {
          topic,
          numQuestions,
        }

        console.log(`[API] 📤 Request body:`, JSON.stringify(requestBody, null, 2))

        const response = await fetch(`${MOCK_TEST_BASE_URL}/gen-mock-test`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        console.log(`[API] 📥 Response status: ${response.status}`)
        console.log(`[API] 📥 Response headers:`, Object.fromEntries(response.headers.entries()))

        const rawText = await response.text()
        console.log(`[API] 📄 Raw response (first 500 chars):`, rawText.substring(0, 500))
        console.log(`[API] 📏 Raw response length:`, rawText.length)

        if (!response.ok) {
          console.error(`[API] ❌ ERROR - Status ${response.status}`)
          console.error(`[API] ❌ ERROR - Full response:`, rawText)

          let errorData: any = null
          try {
            errorData = JSON.parse(rawText)
            console.error(`[API] ❌ ERROR - Parsed error:`, errorData)
          } catch (parseErr) {
            console.error(`[API] ❌ ERROR - Could not parse error response as JSON`)
            errorData = { error: rawText }
          }

          throw new APIError(
            `Failed to generate mock test: ${response.status}`,
            response.status,
            "/gen-mock-test",
            errorData,
          )
        }

        let parsedData: any
        try {
          parsedData = JSON.parse(rawText)
          console.log(`[API] ✅ Successfully parsed JSON`)
          console.log(`[API] 🔍 Parsed data structure:`, Object.keys(parsedData))
          console.log(`[API] 📦 Full parsed data:`, JSON.stringify(parsedData, null, 2))
        } catch (parseError) {
          console.error(`[API] ❌ JSON Parse Error:`, parseError)
          console.error(`[API] ❌ Failed to parse:`, rawText)
          throw new APIError("Response is not valid JSON", 200, "/gen-mock-test", {
            parseError,
            rawText: rawText.substring(0, 200),
          })
        }

        console.log(`[API] 🔍 Checking response structure...`)

        if (parsedData.questions && Array.isArray(parsedData.questions)) {
          console.log(`[API] ✅ Found questions array directly on response`)
          console.log(`[API] 📊 Number of questions: ${parsedData.questions.length}`)
          return parsedData as AIGeneratedTest
        }

        if (parsedData.mockTest) {
          console.log(`[API] ✅ Found mockTest object`)
          if (parsedData.mockTest.questions && Array.isArray(parsedData.mockTest.questions)) {
            console.log(`[API] ✅ Found questions array in mockTest`)
            console.log(`[API] 📊 Number of questions: ${parsedData.mockTest.questions.length}`)
            return parsedData.mockTest as AIGeneratedTest
          } else {
            console.error(`[API] ❌ mockTest exists but has no questions array`)
            console.error(`[API] ❌ mockTest keys:`, Object.keys(parsedData.mockTest))
          }
        }

        if (parsedData.data) {
          console.log(`[API] 🔍 Found 'data' property, checking...`)
          if (parsedData.data.questions && Array.isArray(parsedData.data.questions)) {
            console.log(`[API] ✅ Found questions in data`)
            return parsedData.data as AIGeneratedTest
          }
          if (parsedData.data.mockTest) {
            console.log(`[API] ✅ Found mockTest in data`)
            return parsedData.data.mockTest as AIGeneratedTest
          }
        }

        console.error(`[API] ❌ Unexpected response structure`)
        console.error(`[API] ❌ Available keys:`, Object.keys(parsedData))
        console.error(`[API] ❌ Full response:`, parsedData)

        throw new APIError("Response structure is not recognized", 200, "/gen-mock-test", {
          message: "Missing questions array",
          responseKeys: Object.keys(parsedData),
          parsedData,
        })
      },
      3,
      2000,
      `generateMockTest(${topic.substring(0, 30)}...)`,
    )
  },

  async explainWrongAnswer(question: string, userAnswer: string, correctAnswer: string): Promise<ExplanationResponse> {
    return retryWithBackoff(
      async () => {
        const response = await fetch(`${MOCK_TEST_BASE_URL}/explain-wrong-answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            userAnswer,
            correctAnswer,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new APIError(
            "Failed to get explanation from server",
            response.status,
            "/explain-wrong-answer",
            errorText,
          )
        }

        return response.json()
      },
      3,
      1000,
      "explainWrongAnswer",
    )
  },

  async generateLessonMCQ(topic: string): Promise<AIGeneratedTest> {
    console.log(`[API] Calling gen-mock-test for lesson MCQ with topic: "${topic}"`)

    return retryWithBackoff(
      async () => {
        const response = await fetch(`${MOCK_TEST_BASE_URL}/gen-mock-test`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            numQuestions: 1,
          }),
        })

        const rawText = await response.text()

        if (!response.ok) {
          console.error(`[API] Failed with status ${response.status}:`, rawText)
          throw new APIError(
            response.status === 500 && rawText.includes("Invalid JSON")
              ? "The AI service is experiencing issues. Please try again in a moment."
              : "Failed to generate lesson question",
            response.status,
            "/gen-mock-test",
            rawText,
          )
        }

        const data = JSON.parse(rawText)
        console.log(`[API] Received lesson MCQ from AI API`)

        if (data.mockTest) return data.mockTest
        if (data.questions) return data
        if (data.data?.mockTest) return data.data.mockTest

        throw new APIError("Unexpected response structure", 200, "/gen-mock-test", data)
      },
      3,
      1000,
      `generateLessonMCQ(${topic})`,
    )
  },

  // Activity methods
  async getActivityData(userId: string, year: number): Promise<ActivityData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/Activity/get-act?userId=${userId}&year=${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new APIError("Failed to fetch activity data", response.status, "/Activity/get-act")
      }

      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        return result.data.map((item: any) => ({
          date: item.date,
          correctAnswers: item.correctAnswers || 0,
          questionsAttempted: item.questionsAttempted || item.count || 0,
          testsCompleted: item.testsCompleted || 0,
          topics: item.topics || [],
        }))
      }

      return []
    } catch (error) {
      console.error("[API] Failed to fetch activity data:", error)
      return []
    }
  },

  async addActivity(payload: AddActivityPayload): Promise<boolean> {
    try {
      // Validate numeric values
      const validatedPayload = {
        userId: payload.userId,
        testsCompleted: Math.max(0, Math.round(payload.testsCompleted)),
        questionsAttempted: Math.max(0, Math.round(payload.questionsAttempted)),
        correctAnswers: Math.max(0, Math.round(payload.correctAnswers)),
        topic: payload.topic.trim(),
      }

      const response = await fetch(`${API_BASE_URL}/Activity/add-act`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedPayload),
      })

      if (!response.ok) {
        throw new APIError("Failed to add activity", response.status, "/Activity/add-act")
      }

      const result = await response.json()
      return result.success === true
    } catch (error) {
      console.error("[API] Failed to add activity:", error)
      return false
    }
  },
}

export default api