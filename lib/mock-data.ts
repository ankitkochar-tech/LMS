// Mock data based on AIRX seed data
export interface Client {
  id: string
  name: string
  logo_url: string
  primary_color: string
  is_active: boolean
  created_at: string
}

export interface User {
  id: string
  client_id: string | null
  email: string
  first_name: string
  last_name: string
  role: "super_admin" | "client_admin" | "learner"
  is_active: boolean
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  created_by: string
  created_at: string
}

export interface Video {
  id: string
  course_id: string
  title: string
  url: string
  position: number
  duration_seconds: number
  created_at: string
}

export interface Quiz {
  id: string
  course_id: string
  pass_threshold: number
  created_at: string
}

export interface Question {
  id: string
  quiz_id: string
  prompt: string
  options: string[]
  correct_index: number
  explanation: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  score_percent: number
  passed: boolean
  attempted_at: string
}

export interface Track {
  id: string
  title: string
  description: string
  created_at: string
}

export interface TrackCourse {
  track_id: string
  course_id: string
  position: number
}

export interface Assignment {
  id: string
  client_id: string
  user_id: string
  course_id: string | null
  track_id: string | null
  assigned_by: string
  assigned_at: string
  due_at: string | null
}

export interface Progress {
  id: string
  user_id: string
  course_id: string
  video_id: string | null
  watched_seconds: number
  completed: boolean
  updated_at: string
}

// Mock data
export const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    logo_url: "",
    primary_color: "#1E3A8A",
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    client_id: null,
    email: "super@airx.app",
    first_name: "Super",
    last_name: "Admin",
    role: "super_admin",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    client_id: "1",
    email: "admin@acme.com",
    first_name: "Alex",
    last_name: "Admin",
    role: "client_admin",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    client_id: "1",
    email: "lee@acme.com",
    first_name: "Lee",
    last_name: "Learner",
    role: "learner",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    client_id: "1",
    email: "pat@acme.com",
    first_name: "Pat",
    last_name: "Learner",
    role: "learner",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    client_id: "1",
    email: "sam@acme.com",
    first_name: "Sam",
    last_name: "Learner",
    role: "learner",
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "AI Risk Foundations",
    description: "Basics of AI risk, governance, and safety.",
    thumbnail_url: "/ai-risk-foundations.jpg",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Responsible AI in Practice",
    description: "Everyday usage guidelines and controls.",
    thumbnail_url: "/responsible-ai-practice.jpg",
    created_by: "1",
    created_at: new Date().toISOString(),
  },
]

export const mockVideos: Video[] = [
  {
    id: "1",
    course_id: "1",
    title: "Intro to AI Risks",
    url: "https://example.com/video1.mp4",
    position: 1,
    duration_seconds: 300,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    course_id: "1",
    title: "Risk Categories",
    url: "https://example.com/video2.mp4",
    position: 2,
    duration_seconds: 420,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    course_id: "2",
    title: "Golden Rule: Purpose-Data-Review",
    url: "https://example.com/video3.mp4",
    position: 1,
    duration_seconds: 360,
    created_at: new Date().toISOString(),
  },
]

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    course_id: "1",
    pass_threshold: 70,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    course_id: "2",
    pass_threshold: 80,
    created_at: new Date().toISOString(),
  },
]

export const mockQuestions: Question[] = [
  {
    id: "1",
    quiz_id: "1",
    prompt: "Which is NOT an AI risk category?",
    options: ["Bias", "Hallucination", "Gravity"],
    correct_index: 2,
    explanation: "Gravity isn't an AI risk.",
  },
  {
    id: "2",
    quiz_id: "2",
    prompt: "What are the 3 steps in the daily check?",
    options: ["Purpose-Data-Review", "Plan-Do-Check", "Collect-Share-Skip"],
    correct_index: 0,
    explanation: "Purpose–Data–Review is AIRX's golden rule.",
  },
]

export const mockTracks: Track[] = [
  {
    id: "1",
    title: "AI Risk Awareness Track",
    description: "Foundational awareness for all employees.",
    created_at: new Date().toISOString(),
  },
]

export const mockTrackCourses: TrackCourse[] = [
  {
    track_id: "1",
    course_id: "1",
    position: 1,
  },
  {
    track_id: "1",
    course_id: "2",
    position: 2,
  },
]

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    client_id: "1",
    user_id: "3",
    course_id: "1",
    track_id: null,
    assigned_by: "2",
    assigned_at: new Date().toISOString(),
    due_at: null,
  },
  {
    id: "2",
    client_id: "1",
    user_id: "4",
    course_id: null,
    track_id: "1",
    assigned_by: "2",
    assigned_at: new Date().toISOString(),
    due_at: null,
  },
]

export const mockProgress: Progress[] = [
  {
    id: "1",
    user_id: "3",
    course_id: "1",
    video_id: "1",
    watched_seconds: 300,
    completed: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "3",
    course_id: "1",
    video_id: "2",
    watched_seconds: 180,
    completed: false,
    updated_at: new Date().toISOString(),
  },
]

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: "1",
    quiz_id: "1",
    user_id: "3",
    score_percent: 100,
    passed: true,
    attempted_at: new Date().toISOString(),
  },
]
