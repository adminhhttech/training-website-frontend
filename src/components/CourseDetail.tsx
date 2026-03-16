"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Star,
  Clock,
  Users,
  Award,
  // Play,
  Download,
  Globe,
  Smartphone,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Target,
  Trophy,
  MessageCircle,
  Share2,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface CurriculumSection {
  section: string;
  lectures: number;
  duration: string;
  lessons: string[];
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  instructorBio: string;
  instructorImage: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  duration: string;
  level: string;
  tag: string;
  students: number;
  language: string;
  lastUpdated: string;
  certificate: boolean;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
  features: string[];
  studentReviews: Review[];
}

// Complete course data for all courses
const courseData: Record<string, Course> = {
  // All Courses Category (1-6)
  "1": {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    instructorBio:
      "Senior Full Stack Developer with 8+ years at Google and Microsoft. Passionate about teaching modern web technologies.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    price: 559,
    originalPrice: 2999,
    rating: 4.8,
    reviewCount: 1234,
    duration: "40 hours",
    level: "Beginner",
    tag: "Bestseller",
    students: 15420,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master modern web development from scratch. Build real-world projects using HTML5, CSS3, JavaScript, React, Node.js, and MongoDB. Perfect for beginners who want to become full-stack developers.",
    whatYouWillLearn: [
      "Build responsive websites using HTML5, CSS3, and JavaScript",
      "Master React.js and create dynamic single-page applications",
      "Develop backend APIs using Node.js and Express.js",
      "Work with databases using MongoDB and Mongoose",
      "Implement user authentication and authorization",
      "Deploy applications to cloud platforms like Heroku and Netlify",
      "Use Git and GitHub for version control",
      "Apply modern development practices and tools",
    ],
    requirements: [
      "Basic computer skills and internet access",
      "No prior programming experience required",
      "Willingness to learn and practice coding",
      "A computer with any operating system",
    ],
    curriculum: [
      {
        section: "Getting Started with Web Development",
        lectures: 8,
        duration: "2 hours",
        lessons: [
          "Introduction to Web Development",
          "Setting up Development Environment",
          "Understanding How the Web Works",
          "HTML Fundamentals",
        ],
      },
      {
        section: "HTML5 & CSS3 Mastery",
        lectures: 12,
        duration: "4 hours",
        lessons: [
          "Advanced HTML5 Elements",
          "CSS3 Styling and Layouts",
          "Flexbox and Grid Systems",
          "Responsive Design Principles",
        ],
      },
      {
        section: "JavaScript Programming",
        lectures: 15,
        duration: "6 hours",
        lessons: [
          "JavaScript Fundamentals",
          "DOM Manipulation",
          "Event Handling",
          "Asynchronous JavaScript",
          "ES6+ Features",
        ],
      },
      {
        section: "React.js Development",
        lectures: 18,
        duration: "8 hours",
        lessons: [
          "Introduction to React",
          "Components and JSX",
          "State and Props",
          "Hooks and Context API",
          "React Router",
        ],
      },
      {
        section: "Backend Development",
        lectures: 20,
        duration: "10 hours",
        lessons: [
          "Node.js Fundamentals",
          "Express.js Framework",
          "RESTful API Development",
          "Database Integration",
          "Authentication & Security",
        ],
      },
      {
        section: "Full Stack Projects",
        lectures: 10,
        duration: "10 hours",
        lessons: [
          "E-commerce Website",
          "Social Media App",
          "Task Management System",
          "Deployment and Production",
        ],
      },
    ],
    features: [
      "40 hours of on-demand video",
      "15 coding exercises",
      "5 real-world projects",
      "Certificate of completion",
      "Lifetime access",
      "30-day money-back guarantee",
    ],
    studentReviews: [
      {
        name: "John Smith",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Excellent course! Sarah explains everything clearly and the projects are very practical. I landed my first web developer job after completing this course.",
      },
      {
        name: "Emily Chen",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 month ago",
        comment:
          "Best web development course I've taken. The curriculum is well-structured and up-to-date with current industry standards.",
      },
      {
        name: "Michael Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Great content and excellent instructor. The hands-on projects really helped me understand the concepts better.",
      },
    ],
  },
  "2": {
    id: 2,
    title: "Data Science Fundamentals",
    instructor: "Michael Chen",
    instructorBio:
      "Data Science Lead at Netflix with PhD in Statistics. Expert in machine learning and data visualization.",
    instructorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    price: 609,
    originalPrice: 939,
    rating: 4.7,
    reviewCount: 987,
    duration: "35 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 8750,
    language: "English",
    lastUpdated: "November 2024",
    certificate: true,
    description:
      "Comprehensive introduction to data science using Python. Learn statistics, data analysis, visualization, and machine learning fundamentals with real-world datasets.",
    whatYouWillLearn: [
      "Master Python for data science and analysis",
      "Understand statistical concepts and hypothesis testing",
      "Create compelling data visualizations with matplotlib and seaborn",
      "Work with pandas for data manipulation and cleaning",
      "Build machine learning models using scikit-learn",
      "Perform exploratory data analysis on real datasets",
      "Apply data science workflow to business problems",
      "Present findings and insights effectively",
    ],
    requirements: [
      "Basic Python programming knowledge",
      "High school level mathematics",
      "Familiarity with basic statistics concepts",
      "Computer with Python installed",
    ],
    curriculum: [
      {
        section: "Python for Data Science",
        lectures: 10,
        duration: "4 hours",
        lessons: [
          "Python Data Science Libraries",
          "NumPy for Numerical Computing",
          "Pandas for Data Manipulation",
          "Data Types and Structures",
        ],
      },
      {
        section: "Statistics and Probability",
        lectures: 12,
        duration: "5 hours",
        lessons: [
          "Descriptive Statistics",
          "Probability Distributions",
          "Hypothesis Testing",
          "Correlation and Regression",
        ],
      },
      {
        section: "Data Visualization",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Matplotlib Fundamentals",
          "Seaborn for Statistical Plots",
          "Interactive Visualizations",
          "Dashboard Creation",
        ],
      },
      {
        section: "Machine Learning Basics",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Introduction to ML",
          "Supervised Learning",
          "Unsupervised Learning",
          "Model Evaluation",
          "Feature Engineering",
        ],
      },
      {
        section: "Real-World Projects",
        lectures: 12,
        duration: "14 hours",
        lessons: [
          "Customer Segmentation Analysis",
          "Sales Forecasting Model",
          "Sentiment Analysis Project",
          "Recommendation System",
        ],
      },
    ],
    features: [
      "35 hours of video content",
      "20+ hands-on exercises",
      "4 capstone projects",
      "Real datasets from industry",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Sarah Wilson",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Michael's teaching style is exceptional. The course covers everything you need to start a career in data science.",
      },
      {
        name: "David Park",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "2 weeks ago",
        comment:
          "Great course with practical examples. The projects are challenging but very rewarding.",
      },
    ],
  },
  "3": {
    id: 3,
    title: "Business Strategy Masterclass",
    instructor: "Emma Williams",
    instructorBio:
      "Former McKinsey consultant and current CEO of TechStart Inc. MBA from Harvard Business School.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    price: 569,
    originalPrice: 879,
    rating: 4.9,
    reviewCount: 2341,
    duration: "25 hours",
    level: "Advanced",
    tag: "Premium",
    students: 12300,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master strategic thinking and business planning. Learn frameworks used by top consulting firms to analyze markets, develop strategies, and drive business growth.",
    whatYouWillLearn: [
      "Apply strategic frameworks like Porter's Five Forces",
      "Conduct comprehensive market analysis",
      "Develop competitive strategies and positioning",
      "Create business models and value propositions",
      "Analyze financial performance and metrics",
      "Lead strategic planning processes",
      "Implement change management strategies",
      "Present strategic recommendations effectively",
    ],
    requirements: [
      "Basic business knowledge",
      "Understanding of financial statements",
      "Experience in business environment preferred",
      "Access to business case studies",
    ],
    curriculum: [
      {
        section: "Strategic Thinking Fundamentals",
        lectures: 8,
        duration: "3 hours",
        lessons: [
          "Introduction to Strategy",
          "Strategic Thinking Process",
          "Industry Analysis",
          "Competitive Advantage",
        ],
      },
      {
        section: "Market Analysis & Competitive Intelligence",
        lectures: 10,
        duration: "4 hours",
        lessons: [
          "Porter's Five Forces Framework",
          "SWOT Analysis",
          "Market Segmentation",
          "Competitive Positioning",
        ],
      },
      {
        section: "Business Model Innovation",
        lectures: 12,
        duration: "5 hours",
        lessons: [
          "Business Model Canvas",
          "Value Proposition Design",
          "Revenue Model Strategies",
          "Digital Transformation",
        ],
      },
      {
        section: "Strategic Implementation",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Change Management",
          "Performance Metrics",
          "Risk Assessment",
          "Strategic Communication",
        ],
      },
      {
        section: "Case Studies & Applications",
        lectures: 10,
        duration: "5 hours",
        lessons: [
          "Tech Industry Case Studies",
          "Retail Strategy Analysis",
          "Healthcare Innovation",
          "Global Expansion Strategies",
        ],
      },
    ],
    features: [
      "25 hours of expert instruction",
      "10+ real business case studies",
      "Strategic planning templates",
      "Industry analysis tools",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Robert Johnson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "5 days ago",
        comment:
          "Emma's expertise shines through every lesson. This course transformed how I approach business strategy.",
      },
      {
        name: "Lisa Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Outstanding course! The frameworks are immediately applicable to my work. Emma's real-world examples are invaluable.",
      },
    ],
  },
  "4": {
    id: 4,
    title: "Digital Marketing Complete Course",
    instructor: "Alex Rodriguez",
    instructorBio:
      "Digital Marketing Director at Fortune 500 company. 10+ years experience in SEO, PPC, and social media marketing.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    price: 799,
    originalPrice: 1599,
    rating: 4.6,
    reviewCount: 1567,
    duration: "30 hours",
    level: "Beginner",
    tag: "Bestseller",
    students: 18900,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Complete digital marketing course covering SEO, PPC, social media, email marketing, and analytics. Build campaigns that drive real business results.",
    whatYouWillLearn: [
      "Master SEO and rank higher in search results",
      "Create effective Google Ads and Facebook campaigns",
      "Build engaging social media strategies",
      "Design email marketing campaigns that convert",
      "Use Google Analytics to track performance",
      "Develop content marketing strategies",
      "Understand conversion optimization",
      "Create comprehensive marketing funnels",
    ],
    requirements: [
      "Basic computer and internet skills",
      "No prior marketing experience required",
      "Access to social media platforms",
      "Willingness to practice with real campaigns",
    ],
    curriculum: [
      {
        section: "Digital Marketing Foundations",
        lectures: 8,
        duration: "3 hours",
        lessons: [
          "Digital Marketing Overview",
          "Customer Journey Mapping",
          "Marketing Funnel Basics",
          "Setting Marketing Goals",
        ],
      },
      {
        section: "Search Engine Optimization (SEO)",
        lectures: 12,
        duration: "5 hours",
        lessons: [
          "SEO Fundamentals",
          "Keyword Research",
          "On-Page Optimization",
          "Link Building Strategies",
        ],
      },
      {
        section: "Pay-Per-Click Advertising (PPC)",
        lectures: 10,
        duration: "4 hours",
        lessons: [
          "Google Ads Setup",
          "Campaign Optimization",
          "Facebook Advertising",
          "ROI Measurement",
        ],
      },
      {
        section: "Social Media Marketing",
        lectures: 15,
        duration: "6 hours",
        lessons: [
          "Platform Strategy",
          "Content Creation",
          "Community Management",
          "Influencer Marketing",
        ],
      },
      {
        section: "Email Marketing & Analytics",
        lectures: 12,
        duration: "7 hours",
        lessons: [
          "Email Campaign Design",
          "Automation Workflows",
          "Google Analytics Setup",
          "Performance Tracking",
        ],
      },
      {
        section: "Advanced Strategies",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Marketing Automation",
          "Conversion Optimization",
          "Multi-Channel Campaigns",
          "Future Trends",
        ],
      },
    ],
    features: [
      "30 hours of comprehensive training",
      "Live campaign examples",
      "Marketing templates and tools",
      "Real-world case studies",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Jennifer Martinez",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Alex covers everything you need to know about digital marketing. The practical examples are incredibly valuable.",
      },
      {
        name: "Mark Thompson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great course for beginners. I was able to launch my first successful Google Ads campaign after completing this.",
      },
    ],
  },
  "5": {
    id: 5,
    title: "UI/UX Design Principles",
    instructor: "Jessica Park",
    instructorBio:
      "Senior UI/UX Designer at Airbnb. Expert in user research and design thinking.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    price: 899,
    originalPrice: 1799,
    rating: 4.8,
    reviewCount: 892,
    duration: "28 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 12000,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Learn UI/UX design from scratch. Master user research, wireframing, and prototyping. Design user-friendly interfaces that convert and delight users.",
    whatYouWillLearn: [
      "Master UI/UX design principles and best practices",
      "Conduct user research and usability testing",
      "Create wireframes and interactive prototypes",
      "Design user-friendly interfaces that convert",
      "Use design tools like Figma and Adobe XD",
      "Apply design thinking to solve complex problems",
      "Build a professional design portfolio",
      "Understand accessibility and inclusive design",
    ],
    requirements: [
      "No prior design experience required",
      "Interest in UI/UX design and user psychology",
      "Design software (Figma, Adobe XD, or Sketch)",
      "Willingness to learn and practice design thinking",
    ],
    curriculum: [
      {
        section: "Introduction to UI/UX Design",
        lectures: 8,
        duration: "3 hours",
        lessons: [
          "UI/UX Design Overview",
          "User-Centered Design",
          "Design Thinking Process",
          "Usability Principles",
        ],
      },
      {
        section: "User Research & Analysis",
        lectures: 10,
        duration: "4 hours",
        lessons: [
          "User Personas",
          "User Journey Mapping",
          "Competitive Analysis",
          "Usability Testing",
        ],
      },
      {
        section: "Design Tools & Prototyping",
        lectures: 12,
        duration: "5 hours",
        lessons: [
          "Figma Fundamentals",
          "Wireframing Techniques",
          "Interactive Prototypes",
          "Design Systems",
        ],
      },
      {
        section: "Visual Design",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Typography",
          "Color Theory",
          "Layout Principles",
          "Responsive Design",
        ],
      },
      {
        section: "Portfolio & Career",
        lectures: 10,
        duration: "8 hours",
        lessons: [
          "Building Your Portfolio",
          "Case Study Creation",
          "Design Presentation",
          "Career Guidance",
        ],
      },
    ],
    features: [
      "28 hours of comprehensive training",
      "Hands-on UI/UX design projects",
      "Design templates and resources",
      "Design portfolio review",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Amy Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Jessica is an amazing instructor. This course helped me start my career in UI/UX design. Highly recommended!",
      },
      {
        name: "Daniel Kim",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Excellent course structure and practical exercises. I landed my first UX job after completing this course.",
      },
    ],
  },
  "6": {
    id: 6,
    title: "Financial Planning & Investment",
    instructor: "Robert Kim",
    instructorBio:
      "Certified Financial Planner with 15+ years experience. Former Goldman Sachs investment advisor.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    price: 999,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 743,
    duration: "32 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 9500,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master personal finance and investment strategies. Learn portfolio management, risk assessment, and wealth building techniques from industry experts.",
    whatYouWillLearn: [
      "Create comprehensive financial plans",
      "Build diversified investment portfolios",
      "Understand risk management strategies",
      "Master retirement planning techniques",
      "Learn tax optimization strategies",
      "Analyze market trends and opportunities",
      "Develop passive income streams",
      "Plan for major life financial goals",
    ],
    requirements: [
      "Basic understanding of mathematics",
      "Interest in personal finance and investing",
      "Access to financial calculators or apps",
      "Willingness to track personal expenses",
    ],
    curriculum: [
      {
        section: "Financial Planning Fundamentals",
        lectures: 8,
        duration: "3 hours",
        lessons: [
          "Personal Finance Basics",
          "Budgeting and Cash Flow",
          "Emergency Fund Planning",
          "Debt Management",
        ],
      },
      {
        section: "Investment Principles",
        lectures: 12,
        duration: "5 hours",
        lessons: [
          "Investment Types Overview",
          "Risk and Return Analysis",
          "Portfolio Diversification",
          "Asset Allocation Strategies",
        ],
      },
      {
        section: "Advanced Investment Strategies",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Stock Market Analysis",
          "Bond Investing",
          "Real Estate Investment",
          "Alternative Investments",
        ],
      },
      {
        section: "Retirement & Tax Planning",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "401(k) and IRA Strategies",
          "Social Security Planning",
          "Tax-Efficient Investing",
          "Estate Planning Basics",
        ],
      },
      {
        section: "Practical Applications",
        lectures: 10,
        duration: "10 hours",
        lessons: [
          "Creating Your Financial Plan",
          "Investment Platform Setup",
          "Portfolio Monitoring",
          "Rebalancing Strategies",
        ],
      },
    ],
    features: [
      "32 hours of expert instruction",
      "Financial planning templates",
      "Investment calculators",
      "Real portfolio examples",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Sarah Williams",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "Robert's expertise is evident throughout the course. I've completely transformed my approach to investing.",
      },
      {
        name: "Michael Johnson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great practical advice and real-world examples. My portfolio performance has improved significantly.",
      },
    ],
  },

  // Development Category (7-12)
  "7": {
    id: 7,
    title: "Advanced React Development",
    instructor: "John Smith",
    instructorBio:
      "Senior React Developer at Facebook with 6+ years experience. Expert in modern React patterns and performance optimization.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    price: 1299,
    originalPrice: 2599,
    rating: 4.9,
    reviewCount: 856,
    duration: "45 hours",
    level: "Advanced",
    tag: "Premium",
    students: 5420,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master advanced React concepts including hooks, context, performance optimization, testing, and modern patterns. Build scalable React applications with best practices.",
    whatYouWillLearn: [
      "Master advanced React hooks and custom hooks",
      "Implement complex state management with Context API and Redux",
      "Optimize React application performance",
      "Build reusable component libraries",
      "Implement comprehensive testing strategies",
      "Use TypeScript with React effectively",
      "Deploy React applications to production",
      "Apply modern React patterns and architecture",
    ],
    requirements: [
      "Solid understanding of React fundamentals",
      "Experience with JavaScript ES6+",
      "Basic knowledge of HTML and CSS",
      "Familiarity with npm and package management",
    ],
    curriculum: [
      {
        section: "Advanced React Hooks",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "useEffect Advanced Patterns",
          "Custom Hooks Development",
          "useCallback and useMemo Optimization",
          "useReducer for Complex State",
        ],
      },
      {
        section: "State Management",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Context API Advanced Usage",
          "Redux Toolkit Implementation",
          "State Management Patterns",
          "Global State Best Practices",
        ],
      },
      {
        section: "Performance Optimization",
        lectures: 10,
        duration: "5 hours",
        lessons: [
          "React.memo and Component Optimization",
          "Code Splitting and Lazy Loading",
          "Bundle Analysis and Optimization",
          "Performance Monitoring",
        ],
      },
      {
        section: "Testing React Applications",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "Unit Testing with Jest",
          "Component Testing with React Testing Library",
          "Integration Testing Strategies",
          "End-to-End Testing with Cypress",
        ],
      },
      {
        section: "Production Deployment",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Build Optimization",
          "CI/CD Pipeline Setup",
          "Deployment Strategies",
          "Monitoring and Error Tracking",
        ],
      },
      {
        section: "Advanced Projects",
        lectures: 18,
        duration: "16 hours",
        lessons: [
          "E-commerce Platform",
          "Real-time Chat Application",
          "Dashboard with Data Visualization",
          "Component Library Development",
        ],
      },
    ],
    features: [
      "45 hours of advanced content",
      "4 complex real-world projects",
      "Source code for all projects",
      "Performance optimization techniques",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Alex Thompson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "John's expertise in React is incredible. This course took my React skills to the next level. The performance optimization section was particularly valuable.",
      },
      {
        name: "Maria Garcia",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Best advanced React course available. The projects are challenging and mirror real-world scenarios perfectly.",
      },
    ],
  },
  "8": {
    id: 8,
    title: "Full Stack JavaScript",
    instructor: "Emily Brown",
    instructorBio:
      "Full Stack Engineer at Stripe with expertise in Node.js, React, and modern JavaScript frameworks.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    price: 1499,
    originalPrice: 2999,
    rating: 4.8,
    reviewCount: 1023,
    duration: "60 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 8750,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Complete full-stack JavaScript development course. Master React, Node.js, Express, MongoDB, and modern deployment strategies to build production-ready applications.",
    whatYouWillLearn: [
      "Build full-stack applications with React and Node.js",
      "Master Express.js for backend development",
      "Work with MongoDB and Mongoose ODM",
      "Implement JWT authentication and authorization",
      "Create RESTful APIs and GraphQL endpoints",
      "Deploy applications to cloud platforms",
      "Implement real-time features with Socket.io",
      "Apply testing strategies for full-stack apps",
    ],
    requirements: [
      "Good understanding of JavaScript fundamentals",
      "Basic knowledge of HTML and CSS",
      "Familiarity with React basics",
      "Understanding of asynchronous JavaScript",
    ],
    curriculum: [
      {
        section: "Backend Fundamentals",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Node.js Environment Setup",
          "Express.js Framework",
          "Middleware and Routing",
          "Error Handling Patterns",
        ],
      },
      {
        section: "Database Integration",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "MongoDB Fundamentals",
          "Mongoose ODM",
          "Database Design Patterns",
          "Data Validation and Sanitization",
        ],
      },
      {
        section: "Authentication & Security",
        lectures: 10,
        duration: "5 hours",
        lessons: [
          "JWT Implementation",
          "Password Hashing and Security",
          "Role-based Access Control",
          "API Security Best Practices",
        ],
      },
      {
        section: "Frontend Integration",
        lectures: 18,
        duration: "10 hours",
        lessons: [
          "React State Management",
          "API Integration with Axios",
          "Form Handling and Validation",
          "File Upload Implementation",
        ],
      },
      {
        section: "Real-time Features",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Socket.io Implementation",
          "Real-time Chat Features",
          "Live Notifications",
          "WebSocket Best Practices",
        ],
      },
      {
        section: "Deployment & DevOps",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "Production Environment Setup",
          "Docker Containerization",
          "CI/CD Pipeline",
          "Monitoring and Logging",
        ],
      },
      {
        section: "Capstone Projects",
        lectures: 20,
        duration: "21 hours",
        lessons: [
          "Social Media Platform",
          "E-commerce Application",
          "Project Management Tool",
          "Real-time Collaboration App",
        ],
      },
    ],
    features: [
      "60 hours of comprehensive content",
      "4 full-stack projects",
      "Real-time application development",
      "Production deployment guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Carlos Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "5 days ago",
        comment:
          "Emily's teaching style is excellent. This course covers everything needed to become a full-stack developer. The projects are industry-relevant.",
      },
      {
        name: "Lisa Wang",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Comprehensive course with great depth. The real-time features section was particularly interesting and well-explained.",
      },
    ],
  },
  "9": {
    id: 9,
    title: "Python Programming Mastery",
    instructor: "David Wilson",
    instructorBio:
      "Senior Python Developer at Google with 10+ years experience. Expert in Python frameworks and data structures.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
    price: 999,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 1432,
    duration: "50 hours",
    level: "Beginner",
    tag: "Premium",
    students: 12500,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Complete Python programming course from basics to advanced concepts. Learn Python syntax, data structures, OOP, web development with Django, and automation.",
    whatYouWillLearn: [
      "Master Python syntax and programming fundamentals",
      "Understand data structures and algorithms in Python",
      "Build object-oriented applications",
      "Create web applications with Django framework",
      "Automate tasks with Python scripts",
      "Work with databases using Python",
      "Handle files and data processing",
      "Build GUI applications with Tkinter",
    ],
    requirements: [
      "No prior programming experience required",
      "Computer with Python installed",
      "Basic computer literacy",
      "Willingness to practice coding regularly",
    ],
    curriculum: [
      {
        section: "Python Fundamentals",
        lectures: 15,
        duration: "8 hours",
        lessons: [
          "Python Installation and Setup",
          "Variables and Data Types",
          "Control Structures",
          "Functions and Modules",
        ],
      },
      {
        section: "Data Structures",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "Lists and Tuples",
          "Dictionaries and Sets",
          "String Manipulation",
          "File Handling",
        ],
      },
      {
        section: "Object-Oriented Programming",
        lectures: 10,
        duration: "5 hours",
        lessons: [
          "Classes and Objects",
          "Inheritance and Polymorphism",
          "Encapsulation and Abstraction",
          "Design Patterns in Python",
        ],
      },
      {
        section: "Web Development with Django",
        lectures: 18,
        duration: "12 hours",
        lessons: [
          "Django Framework Introduction",
          "Models and Database Integration",
          "Views and Templates",
          "User Authentication",
          "REST API Development",
        ],
      },
      {
        section: "Automation and Scripting",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Web Scraping with BeautifulSoup",
          "Task Automation",
          "Email Automation",
          "System Administration Scripts",
        ],
      },
      {
        section: "Advanced Topics",
        lectures: 12,
        duration: "6 hours",
        lessons: [
          "Decorators and Generators",
          "Context Managers",
          "Multithreading and Multiprocessing",
          "Testing with pytest",
        ],
      },
      {
        section: "Projects",
        lectures: 15,
        duration: "9 hours",
        lessons: [
          "Web Scraper Application",
          "Django Blog Platform",
          "Task Management System",
          "Data Analysis Tool",
        ],
      },
    ],
    features: [
      "50 hours of comprehensive Python training",
      "4 hands-on projects",
      "Django web development",
      "Automation scripts included",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Jennifer Lee",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "David explains Python concepts very clearly. As a complete beginner, I was able to build my first web application by the end of the course.",
      },
      {
        name: "Mike Chen",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Excellent course structure. The progression from basics to advanced topics is well-planned. The Django section was particularly helpful.",
      },
    ],
  },
  "10": {
    id: 10,
    title: "Mobile App Development with Flutter",
    instructor: "Lisa Chen",
    instructorBio:
      "Mobile App Developer at Uber with expertise in Flutter and cross-platform development. Published 15+ apps on app stores.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
    price: 1399,
    originalPrice: 2799,
    rating: 4.8,
    reviewCount: 678,
    duration: "55 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 6800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master Flutter development to build beautiful, native mobile apps for iOS and Android. Learn Dart programming, state management, and app deployment.",
    whatYouWillLearn: [
      "Master Dart programming language",
      "Build responsive mobile UI with Flutter widgets",
      "Implement state management with Provider and Bloc",
      "Integrate APIs and handle data persistence",
      "Add authentication and user management",
      "Implement push notifications",
      "Deploy apps to Google Play and App Store",
      "Optimize app performance and user experience",
    ],
    requirements: [
      "Basic programming knowledge (any language)",
      "Understanding of mobile app concepts",
      "Flutter development environment setup",
      "Android Studio or VS Code installed",
    ],
    curriculum: [
      {
        section: "Flutter & Dart Fundamentals",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Flutter Installation and Setup",
          "Dart Language Basics",
          "Widget System Overview",
          "Layout and Styling",
        ],
      },
      {
        section: "UI Development",
        lectures: 15,
        duration: "10 hours",
        lessons: [
          "Stateful and Stateless Widgets",
          "Navigation and Routing",
          "Forms and Input Handling",
          "Animations and Transitions",
        ],
      },
      {
        section: "State Management",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Provider Pattern",
          "Bloc Architecture",
          "Riverpod State Management",
          "State Management Best Practices",
        ],
      },
      {
        section: "Backend Integration",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "HTTP Requests and API Integration",
          "JSON Parsing and Serialization",
          "Local Database with SQLite",
          "Firebase Integration",
        ],
      },
      {
        section: "Advanced Features",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Camera and Image Handling",
          "Location Services and Maps",
          "Push Notifications",
          "Device Features Integration",
        ],
      },
      {
        section: "Testing and Deployment",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Unit and Widget Testing",
          "App Store Preparation",
          "Google Play Store Deployment",
          "App Store Connect Submission",
        ],
      },
      {
        section: "Complete Projects",
        lectures: 18,
        duration: "12 hours",
        lessons: [
          "Social Media App",
          "E-commerce Mobile App",
          "Weather Forecast App",
          "Task Management App",
        ],
      },
    ],
    features: [
      "55 hours of Flutter development",
      "4 complete mobile applications",
      "App store deployment guide",
      "Firebase integration tutorials",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Ahmed Hassan",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "Lisa's Flutter course is comprehensive and well-structured. I successfully published my first app to both app stores after completing this course.",
      },
      {
        name: "Sophie Martin",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Excellent course for learning Flutter. The projects are practical and the deployment section was very helpful for getting apps live.",
      },
    ],
  },
  "11": {
    id: 11,
    title: "Backend Development with Node.js",
    instructor: "Mark Thompson",
    instructorBio:
      "Backend Engineer at Netflix with 8+ years experience in Node.js, microservices, and scalable architecture.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    price: 1199,
    originalPrice: 2399,
    rating: 4.6,
    reviewCount: 934,
    duration: "42 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 7200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master backend development with Node.js. Learn Express.js, database integration, API development, authentication, and deployment of scalable server applications.",
    whatYouWillLearn: [
      "Build robust APIs with Express.js",
      "Implement database operations with MongoDB and PostgreSQL",
      "Create authentication and authorization systems",
      "Design RESTful and GraphQL APIs",
      "Implement real-time features with WebSockets",
      "Deploy applications to cloud platforms",
      "Apply security best practices",
      "Build microservices architecture",
    ],
    requirements: [
      "Good understanding of JavaScript",
      "Basic knowledge of web development concepts",
      "Familiarity with command line interface",
      "Understanding of HTTP protocol",
    ],
    curriculum: [
      {
        section: "Node.js Fundamentals",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Node.js Runtime Environment",
          "NPM and Package Management",
          "File System Operations",
          "Event Loop and Asynchronous Programming",
        ],
      },
      {
        section: "Express.js Framework",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Express.js Setup and Configuration",
          "Routing and Middleware",
          "Request and Response Handling",
          "Error Handling Strategies",
        ],
      },
      {
        section: "Database Integration",
        lectures: 15,
        duration: "10 hours",
        lessons: [
          "MongoDB with Mongoose",
          "PostgreSQL with Sequelize",
          "Database Design Patterns",
          "Query Optimization",
        ],
      },
      {
        section: "API Development",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "RESTful API Design",
          "GraphQL Implementation",
          "API Documentation with Swagger",
          "API Versioning Strategies",
        ],
      },
      {
        section: "Authentication & Security",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "JWT Authentication",
          "OAuth Implementation",
          "Security Best Practices",
          "Rate Limiting and CORS",
        ],
      },
      {
        section: "Advanced Topics",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "WebSocket Implementation",
          "Caching Strategies",
          "Message Queues",
          "Microservices Architecture",
        ],
      },
    ],
    features: [
      "42 hours of backend development",
      "Multiple database integrations",
      "Real-world API projects",
      "Security implementation guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Ryan O'Connor",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Mark's expertise in backend development is evident throughout the course. The microservices section was particularly valuable for my current project.",
      },
      {
        name: "Priya Patel",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Comprehensive backend course. The database integration examples were very practical and helped me understand best practices.",
      },
    ],
  },
  "12": {
    id: 12,
    title: "DevOps and Cloud Computing",
    instructor: "Anna Rodriguez",
    instructorBio:
      "DevOps Engineer at Amazon Web Services with expertise in cloud architecture, containerization, and CI/CD pipelines.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    price: 1599,
    originalPrice: 3199,
    rating: 4.9,
    reviewCount: 567,
    duration: "48 hours",
    level: "Advanced",
    tag: "Bestseller",
    students: 4300,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master DevOps practices and cloud computing. Learn Docker, Kubernetes, AWS services, CI/CD pipelines, and infrastructure as code for scalable deployments.",
    whatYouWillLearn: [
      "Master Docker containerization and orchestration",
      "Deploy applications with Kubernetes",
      "Build CI/CD pipelines with Jenkins and GitHub Actions",
      "Manage cloud infrastructure with AWS services",
      "Implement Infrastructure as Code with Terraform",
      "Monitor applications with logging and metrics",
      "Apply security best practices in DevOps",
      "Automate deployment and scaling processes",
    ],
    requirements: [
      "Basic understanding of software development",
      "Familiarity with command line interface",
      "Knowledge of version control (Git)",
      "Understanding of web application architecture",
    ],
    curriculum: [
      {
        section: "DevOps Fundamentals",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "DevOps Culture and Practices",
          "Version Control with Git",
          "Continuous Integration Concepts",
          "Deployment Strategies",
        ],
      },
      {
        section: "Containerization with Docker",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Docker Fundamentals",
          "Dockerfile Best Practices",
          "Docker Compose",
          "Container Registry Management",
        ],
      },
      {
        section: "Kubernetes Orchestration",
        lectures: 15,
        duration: "12 hours",
        lessons: [
          "Kubernetes Architecture",
          "Pods, Services, and Deployments",
          "ConfigMaps and Secrets",
          "Ingress and Load Balancing",
          "Helm Package Manager",
        ],
      },
      {
        section: "CI/CD Pipelines",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Jenkins Pipeline Setup",
          "GitHub Actions Workflows",
          "Automated Testing Integration",
          "Deployment Automation",
        ],
      },
      {
        section: "Cloud Infrastructure (AWS)",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "EC2 and VPC Configuration",
          "RDS and S3 Services",
          "Load Balancers and Auto Scaling",
          "CloudFormation Templates",
        ],
      },
      {
        section: "Infrastructure as Code",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Terraform Fundamentals",
          "Resource Management",
          "State Management",
          "Module Development",
        ],
      },
      {
        section: "Monitoring and Security",
        lectures: 10,
        duration: "5 hours",
        lessons: [
          "Application Monitoring",
          "Log Management",
          "Security Scanning",
          "Compliance and Governance",
        ],
      },
    ],
    features: [
      "48 hours of DevOps training",
      "Hands-on AWS cloud projects",
      "Kubernetes deployment examples",
      "CI/CD pipeline templates",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "James Wilson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Anna's DevOps course is incredibly comprehensive. The hands-on AWS projects helped me understand cloud architecture in depth.",
      },
      {
        name: "Elena Popov",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Excellent course for learning modern DevOps practices. The Kubernetes section was particularly well-explained with practical examples.",
      },
    ],
  },

  // Data Science Category (13-18)
  "13": {
    id: 13,
    title: "Python for Data Science",
    instructor: "David Wilson",
    instructorBio:
      "Data Scientist at Google with PhD in Computer Science. Expert in Python data analysis and machine learning libraries.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    price: 899,
    originalPrice: 1799,
    rating: 4.7,
    reviewCount: 1432,
    duration: "38 hours",
    level: "Beginner",
    tag: "Premium",
    students: 9800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Learn Python specifically for data science applications. Master NumPy, Pandas, Matplotlib, and Seaborn to analyze and visualize data effectively.",
    whatYouWillLearn: [
      "Master Python fundamentals for data science",
      "Use NumPy for numerical computing",
      "Manipulate data with Pandas library",
      "Create visualizations with Matplotlib and Seaborn",
      "Perform statistical analysis on datasets",
      "Clean and preprocess real-world data",
      "Build data analysis workflows",
      "Apply Python to solve business problems",
    ],
    requirements: [
      "Basic programming knowledge helpful but not required",
      "High school level mathematics",
      "Computer with Python installed",
      "Interest in data analysis and statistics",
    ],
    curriculum: [
      {
        section: "Python Fundamentals for Data Science",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Python Environment Setup",
          "Data Types and Structures",
          "Control Flow and Functions",
          "Working with Libraries",
        ],
      },
      {
        section: "NumPy for Numerical Computing",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "NumPy Arrays and Operations",
          "Array Indexing and Slicing",
          "Mathematical Functions",
          "Broadcasting and Vectorization",
        ],
      },
      {
        section: "Data Manipulation with Pandas",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "DataFrames and Series",
          "Data Loading and Saving",
          "Data Cleaning Techniques",
          "Grouping and Aggregation",
        ],
      },
      {
        section: "Data Visualization",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Matplotlib Fundamentals",
          "Seaborn Statistical Plots",
          "Customizing Visualizations",
          "Interactive Plotting",
        ],
      },
      {
        section: "Statistical Analysis",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Descriptive Statistics",
          "Probability Distributions",
          "Hypothesis Testing",
          "Correlation Analysis",
        ],
      },
      {
        section: "Real-World Projects",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Sales Data Analysis",
          "Customer Behavior Study",
          "Financial Data Exploration",
          "Healthcare Data Analysis",
        ],
      },
    ],
    features: [
      "38 hours of Python data science training",
      "4 real-world data analysis projects",
      "Jupyter notebook examples",
      "Dataset collection included",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Rachel Green",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "David's teaching style made Python data science accessible to me as a beginner. The projects were very practical and relevant.",
      },
      {
        name: "Tom Anderson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great introduction to Python for data science. The Pandas section was particularly helpful for my work with large datasets.",
      },
    ],
  },
  "14": {
    id: 14,
    title: "Machine Learning Fundamentals",
    instructor: "Sophie Chen",
    instructorBio:
      "Machine Learning Engineer at Tesla with expertise in deep learning and computer vision. Published researcher in AI.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    price: 1199,
    originalPrice: 2399,
    rating: 4.8,
    reviewCount: 967,
    duration: "45 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 7600,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Comprehensive introduction to machine learning algorithms and techniques. Learn supervised and unsupervised learning with practical implementations using scikit-learn.",
    whatYouWillLearn: [
      "Understand machine learning fundamentals and types",
      "Implement supervised learning algorithms",
      "Apply unsupervised learning techniques",
      "Perform feature engineering and selection",
      "Evaluate and optimize model performance",
      "Use scikit-learn for ML implementations",
      "Handle real-world datasets and challenges",
      "Deploy machine learning models",
    ],
    requirements: [
      "Python programming knowledge",
      "Basic statistics and mathematics",
      "Understanding of data analysis concepts",
      "Familiarity with NumPy and Pandas",
    ],
    curriculum: [
      {
        section: "Machine Learning Introduction",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "ML Types and Applications",
          "Data Preprocessing",
          "Train-Test Split",
          "Cross-Validation",
        ],
      },
      {
        section: "Supervised Learning",
        lectures: 15,
        duration: "12 hours",
        lessons: [
          "Linear and Logistic Regression",
          "Decision Trees and Random Forest",
          "Support Vector Machines",
          "Naive Bayes Classifier",
          "k-Nearest Neighbors",
        ],
      },
      {
        section: "Unsupervised Learning",
        lectures: 10,
        duration: "8 hours",
        lessons: [
          "K-Means Clustering",
          "Hierarchical Clustering",
          "Principal Component Analysis",
          "Association Rules",
        ],
      },
      {
        section: "Model Evaluation",
        lectures: 8,
        duration: "6 hours",
        lessons: [
          "Performance Metrics",
          "Confusion Matrix",
          "ROC Curves and AUC",
          "Hyperparameter Tuning",
        ],
      },
      {
        section: "Feature Engineering",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Feature Selection Techniques",
          "Feature Scaling",
          "Handling Categorical Data",
          "Dealing with Missing Values",
        ],
      },
      {
        section: "Advanced Topics",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Ensemble Methods",
          "Model Deployment",
          "A/B Testing for ML",
          "Ethics in Machine Learning",
        ],
      },
      {
        section: "Capstone Projects",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Predictive Analytics Project",
          "Customer Segmentation",
          "Recommendation System",
          "Image Classification",
        ],
      },
    ],
    features: [
      "45 hours of ML training",
      "Hands-on scikit-learn projects",
      "Real datasets and case studies",
      "Model deployment examples",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Kevin Zhang",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Sophie's ML course is outstanding. The balance between theory and practical implementation is perfect. I feel confident applying ML in my work now.",
      },
      {
        name: "Maria Santos",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Excellent course structure. The projects helped me understand how to apply different algorithms to real-world problems.",
      },
    ],
  },
  "15": {
    id: 15,
    title: "Deep Learning with TensorFlow",
    instructor: "Dr. James Liu",
    instructorBio:
      "AI Research Scientist at DeepMind with PhD in Machine Learning. Expert in neural networks and deep learning architectures.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=400&fit=crop",
    price: 1499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 543,
    duration: "52 hours",
    level: "Advanced",
    tag: "Premium",
    students: 4200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master deep learning with TensorFlow and Keras. Learn neural networks, CNNs, RNNs, and advanced architectures for computer vision and NLP applications.",
    whatYouWillLearn: [
      "Build neural networks with TensorFlow and Keras",
      "Implement Convolutional Neural Networks (CNNs)",
      "Create Recurrent Neural Networks (RNNs) and LSTMs",
      "Apply transfer learning techniques",
      "Build computer vision applications",
      "Develop natural language processing models",
      "Optimize deep learning model performance",
      "Deploy deep learning models to production",
    ],
    requirements: [
      "Strong Python programming skills",
      "Machine learning fundamentals",
      "Linear algebra and calculus knowledge",
      "Experience with NumPy and Pandas",
    ],
    curriculum: [
      {
        section: "Deep Learning Fundamentals",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Neural Network Basics",
          "TensorFlow and Keras Setup",
          "Forward and Backward Propagation",
          "Gradient Descent Optimization",
        ],
      },
      {
        section: "Feedforward Neural Networks",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Multi-layer Perceptrons",
          "Activation Functions",
          "Regularization Techniques",
          "Hyperparameter Tuning",
        ],
      },
      {
        section: "Convolutional Neural Networks",
        lectures: 12,
        duration: "10 hours",
        lessons: [
          "CNN Architecture",
          "Convolution and Pooling Layers",
          "Image Classification Projects",
          "Object Detection Basics",
        ],
      },
      {
        section: "Recurrent Neural Networks",
        lectures: 10,
        duration: "8 hours",
        lessons: [
          "RNN Fundamentals",
          "LSTM and GRU Networks",
          "Sequence-to-Sequence Models",
          "Time Series Prediction",
        ],
      },
      {
        section: "Advanced Architectures",
        lectures: 8,
        duration: "6 hours",
        lessons: [
          "Autoencoders",
          "Generative Adversarial Networks",
          "Transformer Architecture",
          "Attention Mechanisms",
        ],
      },
      {
        section: "Transfer Learning",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Pre-trained Models",
          "Fine-tuning Strategies",
          "Domain Adaptation",
          "Few-shot Learning",
        ],
      },
      {
        section: "Production Deployment",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Model Optimization",
          "TensorFlow Serving",
          "Mobile Deployment",
          "Cloud Deployment",
        ],
      },
      {
        section: "Capstone Projects",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Image Recognition System",
          "Natural Language Classifier",
          "Recommendation Engine",
          "Generative Model Project",
        ],
      },
    ],
    features: [
      "52 hours of deep learning content",
      "Advanced neural network projects",
      "TensorFlow and Keras mastery",
      "Production deployment guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Alex Kumar",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Dr. Liu's deep learning course is exceptional. The mathematical foundations are well-explained, and the projects are cutting-edge.",
      },
      {
        name: "Nina Petrov",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "5 days ago",
        comment:
          "This course took my AI skills to the next level. The CNN and RNN sections were particularly well-structured with practical examples.",
      },
    ],
  },
  "16": {
    id: 16,
    title: "Data Visualization with Tableau",
    instructor: "Maria Garcia",
    instructorBio:
      "Business Intelligence Analyst at Microsoft with expertise in data visualization and dashboard design. Tableau certified professional.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    price: 999,
    originalPrice: 1999,
    rating: 4.6,
    reviewCount: 789,
    duration: "30 hours",
    level: "Beginner",
    tag: "Bestseller",
    students: 8900,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master data visualization with Tableau. Learn to create interactive dashboards, perform data analysis, and communicate insights effectively through visual storytelling.",
    whatYouWillLearn: [
      "Navigate Tableau interface and connect to data sources",
      "Create various chart types and visualizations",
      "Build interactive dashboards and stories",
      "Perform data analysis and calculations",
      "Apply best practices in data visualization",
      "Share and publish Tableau workbooks",
      "Use advanced features like parameters and sets",
      "Design executive-level reporting dashboards",
    ],
    requirements: [
      "Basic understanding of data concepts",
      "No prior Tableau experience required",
      "Access to Tableau Desktop (trial available)",
      "Interest in data analysis and visualization",
    ],
    curriculum: [
      {
        section: "Tableau Fundamentals",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Tableau Interface Overview",
          "Connecting to Data Sources",
          "Basic Chart Creation",
          "Worksheet and Workbook Management",
        ],
      },
      {
        section: "Data Preparation",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Data Cleaning in Tableau",
          "Data Joins and Unions",
          "Data Pivoting",
          "Custom Data Sources",
        ],
      },
      {
        section: "Visualization Types",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Bar Charts and Line Graphs",
          "Scatter Plots and Heat Maps",
          "Geographic Visualizations",
          "Tree Maps and Packed Bubbles",
        ],
      },
      {
        section: "Advanced Features",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Calculated Fields",
          "Parameters and Filters",
          "Sets and Groups",
          "Table Calculations",
        ],
      },
      {
        section: "Dashboard Design",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Dashboard Layout Principles",
          "Interactive Elements",
          "Actions and Filters",
          "Mobile Dashboard Design",
        ],
      },
      {
        section: "Storytelling with Data",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Story Points Creation",
          "Narrative Structure",
          "Presentation Best Practices",
          "Executive Reporting",
        ],
      },
      {
        section: "Publishing and Sharing",
        lectures: 4,
        duration: "2 hours",
        lessons: [
          "Tableau Server Publishing",
          "Tableau Public",
          "Embedding Visualizations",
          "User Permissions",
        ],
      },
      {
        section: "Real-World Projects",
        lectures: 8,
        duration: "1 hour",
        lessons: [
          "Sales Performance Dashboard",
          "Financial Analysis Report",
          "Marketing Campaign Analysis",
          "HR Analytics Dashboard",
        ],
      },
    ],
    features: [
      "30 hours of Tableau training",
      "4 complete dashboard projects",
      "Sample datasets included",
      "Best practices guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Carlos Mendez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Maria's Tableau course is excellent for beginners. I can now create professional dashboards for my company's reporting needs.",
      },
      {
        name: "Lisa Thompson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great course structure. The dashboard design section was particularly helpful for creating visually appealing reports.",
      },
    ],
  },
  "17": {
    id: 17,
    title: "Statistical Analysis with R",
    instructor: "Prof. Alan Smith",
    instructorBio:
      "Statistics Professor at Stanford University with 20+ years experience. Expert in statistical modeling and R programming.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop",
    price: 1099,
    originalPrice: 2199,
    rating: 4.7,
    reviewCount: 654,
    duration: "35 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 5600,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Comprehensive statistical analysis course using R programming. Learn descriptive statistics, hypothesis testing, regression analysis, and advanced statistical modeling.",
    whatYouWillLearn: [
      "Master R programming for statistical analysis",
      "Perform descriptive and inferential statistics",
      "Conduct hypothesis testing and ANOVA",
      "Build linear and logistic regression models",
      "Apply time series analysis techniques",
      "Create statistical visualizations with ggplot2",
      "Interpret statistical results and p-values",
      "Design and analyze experiments",
    ],
    requirements: [
      "Basic mathematics and statistics knowledge",
      "No prior R programming experience required",
      "Understanding of research methodology helpful",
      "R and RStudio installation required",
    ],
    curriculum: [
      {
        section: "R Programming Basics",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "R and RStudio Setup",
          "Data Types and Structures",
          "Data Import and Export",
          "Basic Programming Concepts",
        ],
      },
      {
        section: "Descriptive Statistics",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Measures of Central Tendency",
          "Measures of Variability",
          "Data Distribution Analysis",
          "Exploratory Data Analysis",
        ],
      },
      {
        section: "Statistical Visualization",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Base R Graphics",
          "ggplot2 Fundamentals",
          "Statistical Plots",
          "Interactive Visualizations",
        ],
      },
      {
        section: "Inferential Statistics",
        lectures: 10,
        duration: "7 hours",
        lessons: [
          "Probability Distributions",
          "Confidence Intervals",
          "Hypothesis Testing",
          "t-tests and Chi-square Tests",
        ],
      },
      {
        section: "Regression Analysis",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Simple Linear Regression",
          "Multiple Regression",
          "Logistic Regression",
          "Model Diagnostics",
        ],
      },
      {
        section: "Advanced Statistical Methods",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "ANOVA and ANCOVA",
          "Non-parametric Tests",
          "Time Series Analysis",
          "Survival Analysis",
        ],
      },
      {
        section: "Applied Projects",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Medical Research Analysis",
          "Market Research Study",
          "Quality Control Analysis",
          "A/B Testing Project",
        ],
      },
    ],
    features: [
      "35 hours of statistical analysis",
      "R programming mastery",
      "Real research datasets",
      "Statistical interpretation guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Dr. Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Prof. Smith's statistical analysis course is thorough and well-structured. Perfect for researchers who need to apply statistics in their work.",
      },
      {
        name: "Mark Davis",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Excellent course for learning R and statistics together. The regression analysis section was particularly comprehensive.",
      },
    ],
  },
  "18": {
    id: 18,
    title: "Big Data Analytics",
    instructor: "Rachel Kim",
    instructorBio:
      "Big Data Engineer at Spotify with expertise in Hadoop, Spark, and distributed computing systems. Former data architect at LinkedIn.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
    price: 1399,
    originalPrice: 2799,
    rating: 4.8,
    reviewCount: 432,
    duration: "40 hours",
    level: "Advanced",
    tag: "Bestseller",
    students: 3800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master big data technologies and analytics. Learn Hadoop, Spark, NoSQL databases, and distributed computing for processing large-scale datasets.",
    whatYouWillLearn: [
      "Understand big data ecosystem and architecture",
      "Process data with Apache Hadoop and HDFS",
      "Analyze data using Apache Spark and PySpark",
      "Work with NoSQL databases like MongoDB and Cassandra",
      "Implement real-time data processing with Kafka",
      "Build data pipelines and ETL processes",
      "Apply machine learning on big data",
      "Deploy big data solutions on cloud platforms",
    ],
    requirements: [
      "Strong programming skills (Python or Java)",
      "Understanding of databases and SQL",
      "Basic knowledge of distributed systems",
      "Linux command line familiarity",
    ],
    curriculum: [
      {
        section: "Big Data Fundamentals",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Big Data Characteristics",
          "Distributed Computing Concepts",
          "Big Data Architecture",
          "Technology Stack Overview",
        ],
      },
      {
        section: "Hadoop Ecosystem",
        lectures: 10,
        duration: "8 hours",
        lessons: [
          "HDFS Architecture",
          "MapReduce Programming",
          "Hive Data Warehousing",
          "HBase NoSQL Database",
        ],
      },
      {
        section: "Apache Spark",
        lectures: 12,
        duration: "10 hours",
        lessons: [
          "Spark Core and RDDs",
          "Spark SQL and DataFrames",
          "Spark Streaming",
          "MLlib Machine Learning",
        ],
      },
      {
        section: "NoSQL Databases",
        lectures: 8,
        duration: "6 hours",
        lessons: [
          "MongoDB Document Database",
          "Cassandra Column Store",
          "Redis In-Memory Database",
          "Database Selection Criteria",
        ],
      },
      {
        section: "Real-time Processing",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Apache Kafka Messaging",
          "Stream Processing Concepts",
          "Real-time Analytics",
          "Event-Driven Architecture",
        ],
      },
      {
        section: "Data Pipeline Development",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "ETL Process Design",
          "Data Quality Management",
          "Workflow Orchestration",
          "Pipeline Monitoring",
        ],
      },
      {
        section: "Cloud Big Data",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "AWS Big Data Services",
          "Google Cloud Platform",
          "Azure Data Services",
          "Cloud Migration Strategies",
        ],
      },
      {
        section: "Capstone Project",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "End-to-End Big Data Solution",
          "Real-time Analytics Dashboard",
          "Machine Learning Pipeline",
          "Performance Optimization",
        ],
      },
    ],
    features: [
      "40 hours of big data training",
      "Hands-on Hadoop and Spark projects",
      "Real-time processing examples",
      "Cloud deployment scenarios",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "David Chen",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Rachel's big data course is comprehensive and practical. The Spark section was particularly valuable for my current big data projects.",
      },
      {
        name: "Anna Kowalski",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "Excellent course for understanding big data technologies. The hands-on projects helped me grasp complex distributed computing concepts.",
      },
    ],
  },

  // Business Category (19-24)
  "19": {
    id: 19,
    title: "Business Strategy Fundamentals",
    instructor: "Michael Brown",
    instructorBio:
      "Strategy Consultant at Boston Consulting Group with MBA from Wharton. Expert in business analysis and strategic planning.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    price: 799,
    originalPrice: 1599,
    rating: 4.6,
    reviewCount: 789,
    duration: "25 hours",
    level: "Beginner",
    tag: "Premium",
    students: 6700,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Learn fundamental business strategy concepts and frameworks. Understand competitive analysis, market positioning, and strategic decision-making for business success.",
    whatYouWillLearn: [
      "Understand core business strategy principles",
      "Apply strategic analysis frameworks",
      "Conduct competitive and market analysis",
      "Develop business positioning strategies",
      "Create strategic plans and roadmaps",
      "Analyze industry dynamics and trends",
      "Make data-driven strategic decisions",
      "Present strategic recommendations effectively",
    ],
    requirements: [
      "Basic business knowledge helpful",
      "No prior strategy experience required",
      "Interest in business management",
      "Access to business case studies",
    ],
    curriculum: [
      {
        section: "Strategy Fundamentals",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "What is Business Strategy",
          "Strategic Thinking Process",
          "Vision and Mission Development",
          "Strategic Objectives Setting",
        ],
      },
      {
        section: "Industry Analysis",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Porter's Five Forces",
          "Industry Life Cycle",
          "Competitive Landscape Mapping",
          "Market Structure Analysis",
        ],
      },
      {
        section: "Internal Analysis",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Resource-Based View",
          "Core Competencies",
          "Value Chain Analysis",
          "SWOT Analysis",
        ],
      },
      {
        section: "Strategic Options",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Generic Strategies",
          "Growth Strategies",
          "Diversification Options",
          "International Strategy",
        ],
      },
      {
        section: "Strategy Implementation",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Organizational Design",
          "Change Management",
          "Performance Measurement",
          "Strategic Control",
        ],
      },
      {
        section: "Case Studies",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Technology Industry Strategy",
          "Retail Strategy Analysis",
          "Manufacturing Strategy",
          "Service Industry Strategy",
        ],
      },
    ],
    features: [
      "25 hours of strategy training",
      "Real business case studies",
      "Strategic frameworks toolkit",
      "Industry analysis templates",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Jennifer Walsh",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Michael's strategy course provided me with practical frameworks I use daily in my management role. Excellent for business professionals.",
      },
      {
        name: "Robert Taylor",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great introduction to business strategy. The Porter's Five Forces section was particularly well-explained with relevant examples.",
      },
    ],
  },
  "20": {
    id: 20,
    title: "Project Management Professional",
    instructor: "Jennifer Davis",
    instructorBio:
      "PMP-certified Project Manager with 12+ years experience at Fortune 500 companies. Expert in Agile and traditional project management.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    price: 1299,
    originalPrice: 2599,
    rating: 4.8,
    reviewCount: 1234,
    duration: "40 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 9200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Comprehensive project management course covering traditional and Agile methodologies. Prepare for PMP certification while learning practical project management skills.",
    whatYouWillLearn: [
      "Master project management fundamentals and processes",
      "Apply traditional and Agile project management methods",
      "Create project plans, schedules, and budgets",
      "Manage project risks and stakeholder communications",
      "Lead project teams and resolve conflicts",
      "Use project management tools and software",
      "Prepare for PMP certification exam",
      "Handle project closure and lessons learned",
    ],
    requirements: [
      "Basic business or work experience",
      "Interest in project management career",
      "No prior PM experience required",
      "Access to project management software helpful",
    ],
    curriculum: [
      {
        section: "Project Management Fundamentals",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Project Management Overview",
          "Project Life Cycle",
          "PMI Framework and Processes",
          "Project Manager Role",
        ],
      },
      {
        section: "Project Initiation",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Project Charter Development",
          "Stakeholder Identification",
          "Requirements Gathering",
          "Project Scope Definition",
        ],
      },
      {
        section: "Project Planning",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Work Breakdown Structure",
          "Schedule Development",
          "Resource Planning",
          "Budget Creation",
          "Risk Management Planning",
        ],
      },
      {
        section: "Project Execution",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Team Management",
          "Communication Management",
          "Quality Management",
          "Procurement Management",
        ],
      },
      {
        section: "Project Monitoring & Control",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Performance Monitoring",
          "Change Control",
          "Issue Management",
          "Progress Reporting",
        ],
      },
      {
        section: "Agile Project Management",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Agile Principles and Values",
          "Scrum Framework",
          "Kanban Method",
          "Hybrid Approaches",
        ],
      },
      {
        section: "Project Closure",
        lectures: 4,
        duration: "2 hours",
        lessons: [
          "Project Closure Process",
          "Lessons Learned",
          "Final Deliverables",
          "Team Transition",
        ],
      },
      {
        section: "PMP Exam Preparation",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Exam Structure and Format",
          "Study Strategies",
          "Practice Questions",
          "Certification Maintenance",
        ],
      },
    ],
    features: [
      "40 hours of PM training",
      "PMP exam preparation included",
      "Real project templates",
      "Agile and traditional methods",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Steven Martinez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Jennifer's PM course is excellent preparation for the PMP exam. The practical examples and templates are very valuable for real work.",
      },
      {
        name: "Lisa Chang",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Comprehensive course covering both traditional and Agile PM. I passed my PMP exam after completing this course!",
      },
    ],
  },
  "21": {
    id: 21,
    title: "Leadership and Team Management",
    instructor: "Robert Johnson",
    instructorBio:
      "Executive Leadership Coach and former VP at General Electric. Expert in organizational behavior and team dynamics.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop",
    price: 999,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 876,
    duration: "30 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 7800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Develop essential leadership and team management skills. Learn to motivate teams, handle conflicts, make decisions, and create high-performance work environments.",
    whatYouWillLearn: [
      "Understand different leadership styles and approaches",
      "Build and manage high-performing teams",
      "Develop effective communication and listening skills",
      "Handle conflicts and difficult conversations",
      "Make strategic decisions under pressure",
      "Motivate and engage team members",
      "Create positive organizational culture",
      "Lead change and transformation initiatives",
    ],
    requirements: [
      "Some management or supervisory experience helpful",
      "Interest in leadership development",
      "Willingness to practice leadership skills",
      "Open to feedback and self-reflection",
    ],
    curriculum: [
      {
        section: "Leadership Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Leadership vs Management",
          "Leadership Styles and Theories",
          "Self-Awareness and Emotional Intelligence",
          "Personal Leadership Philosophy",
        ],
      },
      {
        section: "Team Building and Development",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Team Formation and Dynamics",
          "Building Trust and Psychological Safety",
          "Diversity and Inclusion",
          "Remote Team Management",
        ],
      },
      {
        section: "Communication and Influence",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Effective Communication Strategies",
          "Active Listening Techniques",
          "Persuasion and Influence",
          "Presentation and Public Speaking",
        ],
      },
      {
        section: "Conflict Resolution",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Understanding Conflict Sources",
          "Conflict Resolution Strategies",
          "Difficult Conversations",
          "Mediation Techniques",
        ],
      },
      {
        section: "Decision Making",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Decision-Making Frameworks",
          "Problem-Solving Techniques",
          "Risk Assessment",
          "Group Decision Making",
        ],
      },
      {
        section: "Performance Management",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Goal Setting and Tracking",
          "Performance Feedback",
          "Coaching and Mentoring",
          "Recognition and Rewards",
        ],
      },
      {
        section: "Change Leadership",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Change Management Process",
          "Overcoming Resistance",
          "Communication During Change",
          "Sustaining Change",
        ],
      },
    ],
    features: [
      "30 hours of leadership training",
      "Interactive leadership assessments",
      "Real-world case studies",
      "Leadership toolkit and templates",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Amanda Foster",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Robert's leadership course transformed my management approach. The conflict resolution section was particularly valuable for my team challenges.",
      },
      {
        name: "Daniel Kim",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "5 days ago",
        comment:
          "Excellent practical leadership course. The team building strategies have significantly improved my team's performance and morale.",
      },
    ],
  },
  "22": {
    id: 22,
    title: "Entrepreneurship Bootcamp",
    instructor: "Sarah Martinez",
    instructorBio:
      "Serial entrepreneur and startup mentor. Founded 3 successful companies and currently partner at venture capital firm.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop",
    price: 1499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 567,
    duration: "35 hours",
    level: "Advanced",
    tag: "Bestseller",
    students: 4500,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Complete entrepreneurship program covering idea validation, business planning, funding, and scaling. Learn from real startup experiences and build your own venture.",
    whatYouWillLearn: [
      "Validate business ideas and identify market opportunities",
      "Create comprehensive business plans and models",
      "Understand different funding options and investor relations",
      "Build minimum viable products (MVPs)",
      "Develop marketing and customer acquisition strategies",
      "Manage startup finances and legal considerations",
      "Scale operations and build sustainable businesses",
      "Navigate challenges and pivot when necessary",
    ],
    requirements: [
      "Entrepreneurial mindset and passion",
      "Business idea or willingness to develop one",
      "Basic business knowledge helpful",
      "Commitment to complete practical exercises",
    ],
    curriculum: [
      {
        section: "Entrepreneurship Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Entrepreneurial Mindset",
          "Opportunity Recognition",
          "Innovation and Creativity",
          "Risk Assessment",
        ],
      },
      {
        section: "Idea Validation",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Market Research Techniques",
          "Customer Discovery Process",
          "Problem-Solution Fit",
          "Competitive Analysis",
        ],
      },
      {
        section: "Business Model Development",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Business Model Canvas",
          "Value Proposition Design",
          "Revenue Model Selection",
          "Cost Structure Analysis",
        ],
      },
      {
        section: "Product Development",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "MVP Development",
          "Product-Market Fit",
          "Iterative Development",
          "User Experience Design",
        ],
      },
      {
        section: "Funding and Investment",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Funding Options Overview",
          "Pitch Deck Creation",
          "Investor Relations",
          "Valuation and Equity",
        ],
      },
      {
        section: "Marketing and Sales",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Digital Marketing Strategies",
          "Customer Acquisition",
          "Sales Process Development",
          "Brand Building",
        ],
      },
      {
        section: "Operations and Scaling",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Operational Efficiency",
          "Team Building and Hiring",
          "Systems and Processes",
          "Growth Strategies",
        ],
      },
      {
        section: "Legal and Financial Management",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Legal Structure Selection",
          "Intellectual Property",
          "Financial Management",
          "Exit Strategies",
        ],
      },
    ],
    features: [
      "35 hours of entrepreneurship training",
      "Real startup case studies",
      "Business plan templates",
      "Pitch deck examples",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Marcus Thompson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Sarah's entrepreneurship bootcamp is incredible. I launched my startup using the frameworks taught in this course. Highly recommended!",
      },
      {
        name: "Elena Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Comprehensive entrepreneurship course with practical insights. The funding section helped me successfully raise seed capital.",
      },
    ],
  },
  "23": {
    id: 23,
    title: "Supply Chain Management",
    instructor: "Thomas Wilson",
    instructorBio:
      "Supply Chain Director at Amazon with 15+ years experience in logistics and operations. Expert in global supply chain optimization.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop",
    price: 1099,
    originalPrice: 2199,
    rating: 4.6,
    reviewCount: 432,
    duration: "28 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 5200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master supply chain management principles and practices. Learn procurement, logistics, inventory management, and supply chain optimization strategies.",
    whatYouWillLearn: [
      "Understand supply chain fundamentals and components",
      "Manage procurement and supplier relationships",
      "Optimize inventory levels and warehouse operations",
      "Design efficient logistics and distribution networks",
      "Apply demand forecasting and planning techniques",
      "Implement supply chain risk management strategies",
      "Use technology and analytics in supply chain",
      "Develop sustainable and ethical supply chains",
    ],
    requirements: [
      "Basic business knowledge",
      "Interest in operations and logistics",
      "No prior supply chain experience required",
      "Understanding of business processes helpful",
    ],
    curriculum: [
      {
        section: "Supply Chain Fundamentals",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Supply Chain Overview",
          "Key Components and Players",
          "Supply Chain Strategy",
          "Performance Metrics",
        ],
      },
      {
        section: "Procurement and Sourcing",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Strategic Sourcing Process",
          "Supplier Selection and Evaluation",
          "Contract Management",
          "Global Sourcing Strategies",
        ],
      },
      {
        section: "Inventory Management",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Inventory Types and Costs",
          "Inventory Control Systems",
          "Safety Stock Optimization",
          "ABC Analysis",
        ],
      },
      {
        section: "Logistics and Distribution",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Transportation Management",
          "Warehouse Operations",
          "Distribution Network Design",
          "Last-Mile Delivery",
        ],
      },
      {
        section: "Demand Planning",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Demand Forecasting Methods",
          "Sales and Operations Planning",
          "Collaborative Planning",
          "Demand Sensing",
        ],
      },
      {
        section: "Supply Chain Technology",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "ERP Systems",
          "Supply Chain Analytics",
          "IoT and Automation",
          "Blockchain Applications",
        ],
      },
      {
        section: "Risk Management and Sustainability",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Supply Chain Risk Assessment",
          "Business Continuity Planning",
          "Sustainable Supply Chains",
          "Ethical Sourcing",
        ],
      },
    ],
    features: [
      "28 hours of supply chain training",
      "Real industry case studies",
      "Supply chain simulation exercises",
      "Best practices toolkit",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Patricia Lee",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Thomas's supply chain course is comprehensive and practical. The inventory management section helped optimize our company's operations significantly.",
      },
      {
        name: "Carlos Mendoza",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658ab4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Excellent course for understanding modern supply chain practices. The technology section was particularly insightful for digital transformation.",
      },
    ],
  },
  "24": {
    id: 24,
    title: "International Business",
    instructor: "Dr. Lisa Wang",
    instructorBio:
      "International Business Professor at Harvard Business School with expertise in global markets and cross-cultural management.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop",
    price: 1199,
    originalPrice: 2399,
    rating: 4.8,
    reviewCount: 654,
    duration: "32 hours",
    level: "Advanced",
    tag: "Bestseller",
    students: 4800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master international business strategies and global market entry. Learn cross-cultural management, international trade, and global business operations.",
    whatYouWillLearn: [
      "Understand global business environment and trends",
      "Analyze international market opportunities",
      "Develop market entry and expansion strategies",
      "Navigate cultural differences and communication",
      "Manage international trade and regulations",
      "Handle foreign exchange and financial risks",
      "Lead global teams and operations",
      "Apply ethical considerations in global business",
    ],
    requirements: [
      "Strong business fundamentals",
      "Interest in global markets",
      "Basic economics knowledge helpful",
      "Open to cross-cultural learning",
    ],
    curriculum: [
      {
        section: "Global Business Environment",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Globalization and Trade",
          "Economic Systems Comparison",
          "Political and Legal Environment",
          "Technological Impact",
        ],
      },
      {
        section: "International Market Analysis",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Market Research Methods",
          "Country Risk Assessment",
          "Competitive Analysis",
          "Market Sizing and Segmentation",
        ],
      },
      {
        section: "Market Entry Strategies",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Entry Mode Selection",
          "Joint Ventures and Partnerships",
          "Foreign Direct Investment",
          "Licensing and Franchising",
        ],
      },
      {
        section: "Cross-Cultural Management",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Cultural Dimensions Theory",
          "Communication Across Cultures",
          "Negotiation Strategies",
          "Global Team Management",
        ],
      },
      {
        section: "International Trade",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Import/Export Procedures",
          "Trade Regulations and Compliance",
          "International Contracts",
          "Supply Chain Management",
        ],
      },
      {
        section: "Global Finance",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Foreign Exchange Markets",
          "Currency Risk Management",
          "International Banking",
          "Global Investment Strategies",
        ],
      },
      {
        section: "Regional Business Studies",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Asian Markets",
          "European Union Business",
          "Latin American Opportunities",
          "African Market Potential",
        ],
      },
    ],
    features: [
      "32 hours of international business training",
      "Global case studies from multiple regions",
      "Cultural assessment tools",
      "Market entry templates",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Ahmed Hassan",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Dr. Wang's international business course is exceptional. The cross-cultural management section was invaluable for my global team leadership role.",
      },
      {
        name: "Sophie Mueller",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "Comprehensive course covering all aspects of international business. The market entry strategies helped me successfully expand into Asian markets.",
      },
    ],
  },

  // Finance Category (25-30)
  "25": {
    id: 25,
    title: "Investment Fundamentals",
    instructor: "Robert Johnson",
    instructorBio:
      "Investment Advisor with 15+ years at Goldman Sachs. CFA charterholder and expert in portfolio management and financial analysis.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    price: 999,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 654,
    duration: "30 hours",
    level: "Beginner",
    tag: "Premium",
    students: 8200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Learn investment fundamentals and portfolio management. Understand stocks, bonds, mutual funds, and develop strategies for long-term wealth building.",
    whatYouWillLearn: [
      "Understand different investment types and vehicles",
      "Analyze stocks using fundamental and technical analysis",
      "Build diversified investment portfolios",
      "Assess risk and return relationships",
      "Apply asset allocation strategies",
      "Understand bond markets and fixed income",
      "Evaluate mutual funds and ETFs",
      "Develop long-term investment plans",
    ],
    requirements: [
      "Basic mathematics skills",
      "Interest in financial markets",
      "No prior investment experience required",
      "Access to financial news and data helpful",
    ],
    curriculum: [
      {
        section: "Investment Basics",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Investment Types Overview",
          "Risk and Return Concepts",
          "Time Value of Money",
          "Investment Goals Setting",
        ],
      },
      {
        section: "Stock Market Fundamentals",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Stock Market Structure",
          "How to Read Financial Statements",
          "Fundamental Analysis",
          "Technical Analysis Basics",
        ],
      },
      {
        section: "Bond and Fixed Income",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Bond Basics and Types",
          "Interest Rate Risk",
          "Credit Risk Assessment",
          "Bond Portfolio Strategies",
        ],
      },
      {
        section: "Portfolio Management",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Diversification Principles",
          "Asset Allocation Models",
          "Portfolio Optimization",
          "Rebalancing Strategies",
        ],
      },
      {
        section: "Investment Vehicles",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Mutual Funds Analysis",
          "Exchange-Traded Funds (ETFs)",
          "Index Fund Investing",
          "Alternative Investments",
        ],
      },
      {
        section: "Investment Strategies",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Value vs Growth Investing",
          "Dollar-Cost Averaging",
          "Tax-Efficient Investing",
          "Retirement Planning",
        ],
      },
      {
        section: "Practical Applications",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Building Your First Portfolio",
          "Investment Account Types",
          "Broker Selection",
          "Performance Monitoring",
        ],
      },
    ],
    features: [
      "30 hours of investment training",
      "Real market analysis examples",
      "Portfolio building templates",
      "Investment calculators",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Michelle Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Robert's investment course is perfect for beginners. I now confidently manage my own investment portfolio using the strategies learned.",
      },
      {
        name: "James Wilson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Excellent foundation in investment principles. The portfolio management section was particularly valuable for understanding diversification.",
      },
    ],
  },
  "26": {
    id: 26,
    title: "Corporate Finance",
    instructor: "Amanda Lee",
    instructorBio:
      "CFO at Fortune 500 company with MBA in Finance from Wharton. Expert in financial planning, analysis, and corporate strategy.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    price: 1299,
    originalPrice: 2599,
    rating: 4.8,
    reviewCount: 543,
    duration: "38 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 6100,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master corporate finance principles and practices. Learn financial analysis, capital budgeting, financing decisions, and value creation strategies.",
    whatYouWillLearn: [
      "Analyze financial statements and performance",
      "Make capital budgeting and investment decisions",
      "Understand cost of capital and financing options",
      "Apply valuation methods and techniques",
      "Manage working capital and cash flow",
      "Assess financial risks and mitigation strategies",
      "Understand mergers and acquisitions",
      "Create financial models and forecasts",
    ],
    requirements: [
      "Basic accounting knowledge",
      "Understanding of financial statements",
      "Intermediate mathematics skills",
      "Business experience helpful",
    ],
    curriculum: [
      {
        section: "Financial Statement Analysis",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Financial Statement Review",
          "Ratio Analysis",
          "Trend Analysis",
          "Industry Benchmarking",
        ],
      },
      {
        section: "Time Value of Money",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Present and Future Value",
          "Annuities and Perpetuities",
          "Net Present Value (NPV)",
          "Internal Rate of Return (IRR)",
        ],
      },
      {
        section: "Capital Budgeting",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Investment Decision Criteria",
          "Cash Flow Estimation",
          "Risk Analysis in Capital Budgeting",
          "Real Options Valuation",
        ],
      },
      {
        section: "Cost of Capital",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Cost of Debt and Equity",
          "Weighted Average Cost of Capital",
          "Capital Structure Theory",
          "Optimal Capital Structure",
        ],
      },
      {
        section: "Valuation Methods",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Discounted Cash Flow (DCF)",
          "Comparable Company Analysis",
          "Precedent Transaction Analysis",
          "Asset-Based Valuation",
        ],
      },
      {
        section: "Working Capital Management",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Cash Management",
          "Inventory Management",
          "Accounts Receivable Management",
          "Short-term Financing",
        ],
      },
      {
        section: "Advanced Topics",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Mergers and Acquisitions",
          "Dividend Policy",
          "International Finance",
          "Financial Risk Management",
        ],
      },
      {
        section: "Financial Modeling",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Building Financial Models",
          "Scenario Analysis",
          "Sensitivity Analysis",
          "Monte Carlo Simulation",
        ],
      },
    ],
    features: [
      "38 hours of corporate finance training",
      "Excel financial modeling templates",
      "Real company case studies",
      "Valuation calculators",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "David Park",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Amanda's corporate finance course is comprehensive and practical. The financial modeling section was particularly valuable for my analyst role.",
      },
      {
        name: "Rachel Green",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Excellent course for understanding corporate finance concepts. The valuation methods section helped me in my investment banking career.",
      },
    ],
  },
  "27": {
    id: 27,
    title: "Financial Risk Management",
    instructor: "Dr. Kevin Park",
    instructorBio:
      "Risk Management Director at JPMorgan Chase with PhD in Finance. Expert in derivatives, hedging strategies, and risk modeling.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop",
    price: 1499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 321,
    duration: "42 hours",
    level: "Advanced",
    tag: "Premium",
    students: 3200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Advanced financial risk management course covering market, credit, and operational risks. Learn derivatives, hedging strategies, and risk modeling techniques.",
    whatYouWillLearn: [
      "Identify and measure different types of financial risks",
      "Apply Value at Risk (VaR) and stress testing methods",
      "Use derivatives for hedging and risk management",
      "Understand credit risk assessment and modeling",
      "Implement operational risk management frameworks",
      "Apply regulatory requirements and compliance",
      "Build risk management systems and processes",
      "Develop risk reporting and governance structures",
    ],
    requirements: [
      "Strong finance and mathematics background",
      "Understanding of financial markets",
      "Experience with financial instruments",
      "Knowledge of statistics and probability",
    ],
    curriculum: [
      {
        section: "Risk Management Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Types of Financial Risk",
          "Risk Management Framework",
          "Risk Appetite and Tolerance",
          "Regulatory Environment",
        ],
      },
      {
        section: "Market Risk Management",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Market Risk Measurement",
          "Value at Risk (VaR) Models",
          "Stress Testing and Scenario Analysis",
          "Backtesting and Model Validation",
        ],
      },
      {
        section: "Credit Risk Management",
        lectures: 10,
        duration: "7 hours",
        lessons: [
          "Credit Risk Assessment",
          "Probability of Default Models",
          "Loss Given Default Estimation",
          "Credit Portfolio Management",
        ],
      },
      {
        section: "Derivatives and Hedging",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Options and Futures",
          "Swaps and Forward Contracts",
          "Hedging Strategies",
          "Derivative Pricing Models",
        ],
      },
      {
        section: "Operational Risk",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Operational Risk Framework",
          "Risk Assessment Methods",
          "Business Continuity Planning",
          "Fraud Risk Management",
        ],
      },
      {
        section: "Liquidity Risk",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Liquidity Risk Measurement",
          "Funding Risk Management",
          "Contingency Planning",
          "Regulatory Requirements",
        ],
      },
      {
        section: "Risk Modeling",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Statistical Risk Models",
          "Monte Carlo Simulation",
          "Copula Models",
          "Machine Learning in Risk",
        ],
      },
      {
        section: "Risk Governance",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Risk Committee Structure",
          "Risk Reporting Systems",
          "Performance Measurement",
          "Risk Culture Development",
        ],
      },
    ],
    features: [
      "42 hours of advanced risk management",
      "Risk modeling software tutorials",
      "Real-world case studies",
      "Regulatory compliance guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Michael Zhang",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Dr. Park's risk management course is exceptional. The derivatives and hedging section was particularly valuable for my trading desk role.",
      },
      {
        name: "Sarah Kim",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Advanced course with deep technical content. The VaR modeling section helped me implement better risk measurement systems.",
      },
    ],
  },
  "28": {
    id: 28,
    title: "Personal Financial Planning",
    instructor: "Michelle Chen",
    instructorBio:
      "Certified Financial Planner (CFP) with 12+ years helping individuals achieve financial goals. Expert in retirement and tax planning.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop",
    price: 799,
    originalPrice: 1599,
    rating: 4.6,
    reviewCount: 876,
    duration: "25 hours",
    level: "Beginner",
    tag: "Bestseller",
    students: 11200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Comprehensive personal financial planning course. Learn budgeting, saving, investing, insurance, and retirement planning for financial security.",
    whatYouWillLearn: [
      "Create comprehensive personal budgets",
      "Develop emergency fund and savings strategies",
      "Understand insurance needs and options",
      "Plan for retirement and long-term goals",
      "Optimize tax strategies and deductions",
      "Manage debt effectively",
      "Build investment portfolios for personal goals",
      "Create estate planning basics",
    ],
    requirements: [
      "No prior financial knowledge required",
      "Personal income and expenses to work with",
      "Willingness to track spending",
      "Interest in improving financial situation",
    ],
    curriculum: [
      {
        section: "Financial Planning Basics",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Financial Planning Process",
          "Setting Financial Goals",
          "Net Worth Calculation",
          "Cash Flow Analysis",
        ],
      },
      {
        section: "Budgeting and Saving",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Creating Personal Budgets",
          "Expense Tracking Methods",
          "Emergency Fund Planning",
          "Savings Strategies",
        ],
      },
      {
        section: "Debt Management",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Understanding Different Debt Types",
          "Debt Repayment Strategies",
          "Credit Score Improvement",
          "Debt Consolidation Options",
        ],
      },
      {
        section: "Insurance Planning",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Life Insurance Needs",
          "Health Insurance Options",
          "Disability Insurance",
          "Property and Casualty Insurance",
        ],
      },
      {
        section: "Investment Planning",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Investment Account Types",
          "Asset Allocation for Personal Goals",
          "Mutual Funds and ETFs",
          "Tax-Advantaged Investing",
        ],
      },
      {
        section: "Retirement Planning",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Retirement Needs Calculation",
          "401(k) and IRA Strategies",
          "Social Security Planning",
          "Retirement Income Strategies",
        ],
      },
      {
        section: "Tax Planning",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Tax-Efficient Strategies",
          "Deduction Optimization",
          "Tax-Advantaged Accounts",
          "Year-End Tax Planning",
        ],
      },
    ],
    features: [
      "25 hours of personal finance training",
      "Financial planning worksheets",
      "Budget and savings calculators",
      "Retirement planning tools",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Jennifer Martinez",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "Michelle's personal finance course transformed my financial life. I now have a clear plan for retirement and emergency savings.",
      },
      {
        name: "Tom Wilson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great course for financial beginners. The budgeting section helped me get control of my spending and start saving consistently.",
      },
    ],
  },
  "29": {
    id: 29,
    title: "Cryptocurrency and Blockchain",
    instructor: "Alex Thompson",
    instructorBio:
      "Blockchain Developer and Cryptocurrency Analyst with 8+ years in fintech. Expert in DeFi, smart contracts, and crypto trading.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    price: 1199,
    originalPrice: 2399,
    rating: 4.7,
    reviewCount: 432,
    duration: "35 hours",
    level: "Intermediate",
    tag: "Premium",
    students: 5800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Comprehensive cryptocurrency and blockchain course. Learn blockchain technology, cryptocurrency trading, DeFi, NFTs, and investment strategies.",
    whatYouWillLearn: [
      "Understand blockchain technology and consensus mechanisms",
      "Learn cryptocurrency fundamentals and major coins",
      "Master cryptocurrency trading strategies",
      "Explore DeFi protocols and yield farming",
      "Understand NFTs and digital asset creation",
      "Apply risk management in crypto investing",
      "Use cryptocurrency wallets and exchanges safely",
      "Analyze market trends and technical indicators",
    ],
    requirements: [
      "Basic understanding of finance and investing",
      "Interest in emerging technologies",
      "No prior blockchain experience required",
      "Willingness to learn technical concepts",
    ],
    curriculum: [
      {
        section: "Blockchain Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Blockchain Technology Overview",
          "Consensus Mechanisms",
          "Cryptographic Principles",
          "Distributed Ledger Technology",
        ],
      },
      {
        section: "Cryptocurrency Basics",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Bitcoin and Major Cryptocurrencies",
          "Altcoins and Token Economics",
          "Cryptocurrency Wallets",
          "Exchange Platforms",
        ],
      },
      {
        section: "Trading and Investment",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Technical Analysis for Crypto",
          "Trading Strategies",
          "Risk Management",
          "Portfolio Diversification",
        ],
      },
      {
        section: "Decentralized Finance (DeFi)",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "DeFi Protocols Overview",
          "Decentralized Exchanges",
          "Lending and Borrowing",
          "Yield Farming Strategies",
        ],
      },
      {
        section: "NFTs and Digital Assets",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "NFT Fundamentals",
          "Creating and Minting NFTs",
          "NFT Marketplaces",
          "Digital Asset Valuation",
        ],
      },
      {
        section: "Smart Contracts",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Smart Contract Basics",
          "Ethereum and Solidity",
          "Contract Deployment",
          "Security Considerations",
        ],
      },
      {
        section: "Regulatory and Legal Aspects",
        lectures: 4,
        duration: "2 hours",
        lessons: [
          "Cryptocurrency Regulations",
          "Tax Implications",
          "Compliance Requirements",
          "Future Legal Trends",
        ],
      },
    ],
    features: [
      "35 hours of crypto and blockchain training",
      "Live trading demonstrations",
      "DeFi protocol tutorials",
      "Smart contract examples",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Ryan O'Connor",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Alex's crypto course is comprehensive and up-to-date. The DeFi section opened up new investment opportunities I didn't know existed.",
      },
      {
        name: "Emma Davis",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "5 days ago",
        comment:
          "Great course for understanding blockchain technology and cryptocurrency investing. The trading strategies section was particularly valuable.",
      },
    ],
  },
  "30": {
    id: 30,
    title: "Financial Modeling in Excel",
    instructor: "Diana Rodriguez",
    instructorBio:
      "Financial Modeling Expert and former Investment Banking Analyst at Morgan Stanley. Expert in Excel and financial analysis.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    price: 1099,
    originalPrice: 2199,
    rating: 4.8,
    reviewCount: 567,
    duration: "28 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 7400,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master financial modeling in Excel. Learn to build DCF models, LBO models, merger models, and other advanced financial analysis tools.",
    whatYouWillLearn: [
      "Build comprehensive DCF valuation models",
      "Create LBO and merger analysis models",
      "Develop three-statement financial models",
      "Apply advanced Excel functions and techniques",
      "Perform sensitivity and scenario analysis",
      "Build dynamic charts and dashboards",
      "Create professional model documentation",
      "Apply best practices in model design",
    ],
    requirements: [
      "Intermediate Excel skills",
      "Basic finance and accounting knowledge",
      "Understanding of financial statements",
      "Microsoft Excel installed",
    ],
    curriculum: [
      {
        section: "Excel Fundamentals for Finance",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Advanced Excel Functions",
          "Data Validation and Protection",
          "Conditional Formatting",
          "Excel Shortcuts and Tips",
        ],
      },
      {
        section: "Three-Statement Model",
        lectures: 8,
        duration: "6 hours",
        lessons: [
          "Income Statement Modeling",
          "Balance Sheet Modeling",
          "Cash Flow Statement",
          "Model Integration and Checks",
        ],
      },
      {
        section: "DCF Valuation Model",
        lectures: 10,
        duration: "7 hours",
        lessons: [
          "Free Cash Flow Projections",
          "Terminal Value Calculation",
          "WACC Calculation",
          "Sensitivity Analysis",
        ],
      },
      {
        section: "Comparable Company Analysis",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Trading Multiples Analysis",
          "Peer Group Selection",
          "Multiple Regression Analysis",
          "Valuation Summary",
        ],
      },
      {
        section: "LBO Model",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "LBO Structure and Assumptions",
          "Debt Scheduling",
          "Returns Analysis",
          "Management Case Scenarios",
        ],
      },
      {
        section: "Merger Model",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Accretion/Dilution Analysis",
          "Purchase Price Allocation",
          "Synergies Modeling",
          "Pro Forma Adjustments",
        ],
      },
    ],
    features: [
      "28 hours of Excel modeling training",
      "Complete model templates",
      "Step-by-step video tutorials",
      "Best practices guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Kevin Zhang",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Diana's Excel modeling course is outstanding. The DCF model section helped me excel in my investment banking interviews.",
      },
      {
        name: "Sophia Lee",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Comprehensive course with practical models I use daily in my finance role. The LBO modeling section was particularly detailed.",
      },
    ],
  },

  // Design Category (31-36)
  "31": {
    id: 31,
    title: "Graphic Design Fundamentals",
    instructor: "Creative Studio",
    instructorBio:
      "Award-winning design agency with 10+ years creating visual identities for Fortune 500 companies. Expert in modern design principles.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    price: 899,
    originalPrice: 1799,
    rating: 4.7,
    reviewCount: 1123,
    duration: "32 hours",
    level: "Beginner",
    tag: "Premium",
    students: 9800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Complete graphic design course covering design principles, typography, color theory, and Adobe Creative Suite. Build a professional design portfolio.",
    whatYouWillLearn: [
      "Master fundamental design principles and theory",
      "Understand typography and font selection",
      "Apply color theory and color psychology",
      "Use Adobe Photoshop, Illustrator, and InDesign",
      "Create logos, branding, and visual identities",
      "Design print materials and digital graphics",
      "Build a professional design portfolio",
      "Understand client communication and project workflow",
    ],
    requirements: [
      "No prior design experience required",
      "Access to Adobe Creative Suite (trial available)",
      "Interest in visual design and creativity",
      "Computer with sufficient processing power",
    ],
    curriculum: [
      {
        section: "Design Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Elements and Principles of Design",
          "Composition and Layout",
          "Visual Hierarchy",
          "Design Process and Workflow",
        ],
      },
      {
        section: "Typography",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Typography Basics",
          "Font Selection and Pairing",
          "Typographic Hierarchy",
          "Text Layout and Readability",
        ],
      },
      {
        section: "Color Theory",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Color Wheel and Relationships",
          "Color Psychology",
          "Color Schemes and Palettes",
          "Color in Digital and Print",
        ],
      },
      {
        section: "Adobe Photoshop",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Photoshop Interface and Tools",
          "Photo Editing and Retouching",
          "Layers and Masks",
          "Digital Art Creation",
        ],
      },
      {
        section: "Adobe Illustrator",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Vector Graphics Basics",
          "Logo Design Process",
          "Illustration Techniques",
          "Icon and Symbol Creation",
        ],
      },
      {
        section: "Adobe InDesign",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Layout Design Principles",
          "Multi-page Document Creation",
          "Print Production Basics",
          "Digital Publishing",
        ],
      },
      {
        section: "Portfolio Development",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Portfolio Planning",
          "Project Presentation",
          "Online Portfolio Creation",
          "Client Communication",
        ],
      },
    ],
    features: [
      "32 hours of design training",
      "Adobe Creative Suite tutorials",
      "Design project templates",
      "Portfolio development guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Maria Santos",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Excellent graphic design course for beginners. The Adobe software tutorials were comprehensive and easy to follow.",
      },
      {
        name: "Jake Miller",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great foundation in design principles. I was able to create my first professional logo after completing this course.",
      },
    ],
  },
  "32": {
    id: 32,
    title: "Advanced Photoshop Techniques",
    instructor: "Jessica Park",
    instructorBio:
      "Professional photographer and digital artist with 12+ years experience. Adobe Certified Expert in Photoshop and Lightroom.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=400&fit=crop",
    price: 1099,
    originalPrice: 2199,
    rating: 4.8,
    reviewCount: 892,
    duration: "28 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 6700,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master advanced Photoshop techniques for photo manipulation, digital art, and professional retouching. Learn industry-standard workflows and creative effects.",
    whatYouWillLearn: [
      "Master advanced selection and masking techniques",
      "Apply professional photo retouching methods",
      "Create complex photo manipulations",
      "Use advanced layer blending and effects",
      "Develop non-destructive editing workflows",
      "Create digital art and illustrations",
      "Apply color grading and correction",
      "Optimize images for web and print",
    ],
    requirements: [
      "Basic Photoshop knowledge required",
      "Adobe Photoshop CC installed",
      "Understanding of layers and basic tools",
      "Interest in advanced photo editing",
    ],
    curriculum: [
      {
        section: "Advanced Selections and Masking",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Complex Selection Techniques",
          "Advanced Masking Methods",
          "Hair and Fur Selection",
          "Refine Edge and Select Subject",
        ],
      },
      {
        section: "Professional Retouching",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Portrait Retouching Workflow",
          "Skin Retouching Techniques",
          "Beauty and Fashion Retouching",
          "Product Photography Enhancement",
        ],
      },
      {
        section: "Photo Manipulation",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Composite Image Creation",
          "Perspective and Lighting Matching",
          "Surreal Art Techniques",
          "Fantasy and Sci-Fi Effects",
        ],
      },
      {
        section: "Advanced Layer Techniques",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Blend Modes Mastery",
          "Layer Styles and Effects",
          "Smart Objects and Filters",
          "Adjustment Layer Techniques",
        ],
      },
      {
        section: "Color and Tone",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Advanced Color Correction",
          "Color Grading Techniques",
          "Luminosity Masking",
          "HDR and Tone Mapping",
        ],
      },
      {
        section: "Digital Art Creation",
        lectures: 6,
        duration: "2 hours",
        lessons: [
          "Digital Painting Techniques",
          "Concept Art Creation",
          "Texture and Pattern Design",
          "Brush Creation and Customization",
        ],
      },
      {
        section: "Workflow and Optimization",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Non-Destructive Editing",
          "Action and Batch Processing",
          "File Management",
          "Output Optimization",
        ],
      },
    ],
    features: [
      "28 hours of advanced Photoshop training",
      "Professional retouching projects",
      "Custom brush and action sets",
      "Before/after project files",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Carlos Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Jessica's advanced Photoshop course took my skills to a professional level. The retouching techniques are industry-standard.",
      },
      {
        name: "Amy Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "4 days ago",
        comment:
          "Incredible course for advanced Photoshop techniques. The photo manipulation section opened up new creative possibilities.",
      },
    ],
  },
  "33": {
    id: 33,
    title: "Brand Identity Design",
    instructor: "Marcus Johnson",
    instructorBio:
      "Brand strategist and designer with 15+ years creating identities for startups and Fortune 500 companies. Expert in brand psychology.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
    price: 1299,
    originalPrice: 2599,
    rating: 4.9,
    reviewCount: 654,
    duration: "35 hours",
    level: "Advanced",
    tag: "Premium",
    students: 4200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Comprehensive brand identity design course. Learn brand strategy, logo design, visual systems, and brand guidelines for creating memorable brand experiences.",
    whatYouWillLearn: [
      "Develop comprehensive brand strategies",
      "Design memorable logos and visual marks",
      "Create cohesive visual identity systems",
      "Apply brand psychology and positioning",
      "Design brand guidelines and style guides",
      "Create brand applications across touchpoints",
      "Understand brand research and analysis",
      "Present brand concepts to clients effectively",
    ],
    requirements: [
      "Intermediate graphic design skills",
      "Adobe Creative Suite proficiency",
      "Understanding of design principles",
      "Interest in brand strategy and marketing",
    ],
    curriculum: [
      {
        section: "Brand Strategy Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Brand Strategy Overview",
          "Brand Positioning and Differentiation",
          "Target Audience Analysis",
          "Competitive Brand Analysis",
        ],
      },
      {
        section: "Brand Research and Discovery",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Brand Audit Process",
          "Stakeholder Interviews",
          "Market Research Methods",
          "Brand Persona Development",
        ],
      },
      {
        section: "Logo Design Process",
        lectures: 12,
        duration: "8 hours",
        lessons: [
          "Logo Design Principles",
          "Concept Development",
          "Typography in Logo Design",
          "Logo Refinement and Testing",
        ],
      },
      {
        section: "Visual Identity Systems",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Color Palette Development",
          "Typography System Design",
          "Iconography and Symbols",
          "Photography and Imagery Style",
        ],
      },
      {
        section: "Brand Applications",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Business Card and Stationery",
          "Digital Applications",
          "Packaging Design",
          "Environmental Graphics",
        ],
      },
      {
        section: "Brand Guidelines",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Style Guide Creation",
          "Usage Guidelines",
          "Brand Voice and Tone",
          "Implementation Standards",
        ],
      },
      {
        section: "Client Presentation",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Concept Presentation Techniques",
          "Storytelling in Brand Design",
          "Client Feedback Management",
          "Brand Launch Strategies",
        ],
      },
    ],
    features: [
      "35 hours of brand design training",
      "Complete brand identity projects",
      "Brand guideline templates",
      "Client presentation resources",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Sophie Williams",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Marcus's brand identity course is comprehensive and strategic. I now approach branding projects with much more depth and purpose.",
      },
      {
        name: "Daniel Kim",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        comment:
          "Excellent course for understanding brand strategy and design. The logo design process section was particularly valuable.",
      },
    ],
  },
  "34": {
    id: 34,
    title: "Web Design with Figma",
    instructor: "Anna Martinez",
    instructorBio:
      "UX/UI Designer at Airbnb with expertise in web design and prototyping. Figma community advocate and design system expert.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=400&fit=crop",
    price: 999,
    originalPrice: 1999,
    rating: 4.6,
    reviewCount: 743,
    duration: "30 hours",
    level: "Intermediate",
    tag: "Bestseller",
    students: 8100,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master web design using Figma. Learn responsive design, prototyping, design systems, and collaboration workflows for modern web interfaces.",
    whatYouWillLearn: [
      "Master Figma interface and advanced features",
      "Design responsive web layouts and interfaces",
      "Create interactive prototypes and animations",
      "Build and maintain design systems",
      "Apply modern web design principles",
      "Collaborate effectively with development teams",
      "Optimize designs for different devices",
      "Create professional design handoffs",
    ],
    requirements: [
      "Basic design knowledge helpful",
      "Figma account (free version available)",
      "Understanding of web design concepts",
      "Interest in UI/UX design",
    ],
    curriculum: [
      {
        section: "Figma Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Figma Interface and Tools",
          "Frames and Auto Layout",
          "Components and Variants",
          "Styles and Libraries",
        ],
      },
      {
        section: "Web Design Principles",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Web Design Best Practices",
          "Grid Systems and Layout",
          "Typography for Web",
          "Color and Accessibility",
        ],
      },
      {
        section: "Responsive Design",
        lectures: 10,
        duration: "6 hours",
        lessons: [
          "Mobile-First Design Approach",
          "Breakpoint Strategy",
          "Flexible Layouts",
          "Device-Specific Considerations",
        ],
      },
      {
        section: "Interactive Prototyping",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Prototyping Basics",
          "Micro-interactions",
          "Animation and Transitions",
          "User Flow Creation",
        ],
      },
      {
        section: "Design Systems",
        lectures: 8,
        duration: "4 hours",
        lessons: [
          "Design System Fundamentals",
          "Component Library Creation",
          "Design Tokens",
          "System Maintenance",
        ],
      },
      {
        section: "Collaboration and Handoff",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Team Collaboration Features",
          "Design Reviews and Feedback",
          "Developer Handoff Process",
          "Version Control",
        ],
      },
      {
        section: "Advanced Techniques",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Advanced Auto Layout",
          "Plugin Development",
          "Design Optimization",
          "Performance Considerations",
        ],
      },
    ],
    features: [
      "30 hours of Figma web design training",
      "Responsive design projects",
      "Design system templates",
      "Prototype examples",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Ryan Thompson",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "3 days ago",
        comment:
          "Anna's Figma course is excellent for web designers. The responsive design section helped me create better mobile experiences.",
      },
      {
        name: "Lisa Chang",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great course for learning modern web design with Figma. The design systems section was particularly valuable for my team.",
      },
    ],
  },
  "35": {
    id: 35,
    title: "Motion Graphics with After Effects",
    instructor: "Ryan Kim",
    instructorBio:
      "Motion graphics designer and animator with 10+ years creating content for Netflix, Apple, and major advertising agencies.",
    instructorImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=400&fit=crop",
    price: 1399,
    originalPrice: 2799,
    rating: 4.8,
    reviewCount: 432,
    duration: "40 hours",
    level: "Advanced",
    tag: "Premium",
    students: 3800,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master motion graphics and animation with After Effects. Learn 2D animation, visual effects, compositing, and professional motion design workflows.",
    whatYouWillLearn: [
      "Master After Effects interface and workflow",
      "Create 2D animations and motion graphics",
      "Apply visual effects and compositing techniques",
      "Design kinetic typography and text animations",
      "Build complex animation systems",
      "Use expressions and scripting",
      "Create professional motion graphics projects",
      "Optimize renders and export settings",
    ],
    requirements: [
      "Adobe After Effects installed",
      "Basic understanding of animation principles",
      "Intermediate computer skills",
      "Interest in motion design and animation",
    ],
    curriculum: [
      {
        section: "After Effects Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Interface and Workspace Setup",
          "Composition and Timeline Basics",
          "Keyframe Animation",
          "Layer Properties and Transforms",
        ],
      },
      {
        section: "Animation Principles",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "12 Principles of Animation",
          "Timing and Spacing",
          "Easing and Bezier Curves",
          "Secondary Animation",
        ],
      },
      {
        section: "2D Animation Techniques",
        lectures: 10,
        duration: "8 hours",
        lessons: [
          "Shape Layer Animation",
          "Character Animation Basics",
          "Puppet Tool and Rigging",
          "Frame-by-Frame Animation",
        ],
      },
      {
        section: "Visual Effects and Compositing",
        lectures: 10,
        duration: "8 hours",
        lessons: [
          "Green Screen Compositing",
          "Particle Systems",
          "3D Camera and Lighting",
          "Advanced Compositing Techniques",
        ],
      },
      {
        section: "Typography and Text Animation",
        lectures: 8,
        duration: "6 hours",
        lessons: [
          "Kinetic Typography",
          "Text Animators",
          "Advanced Text Effects",
          "Logo Animation",
        ],
      },
      {
        section: "Expressions and Automation",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Expression Basics",
          "Useful Expression Examples",
          "Scripting Introduction",
          "Automation Workflows",
        ],
      },
      {
        section: "Professional Projects",
        lectures: 8,
        duration: "3 hours",
        lessons: [
          "Explainer Video Creation",
          "Social Media Animation",
          "Broadcast Graphics",
          "Commercial Projects",
        ],
      },
      {
        section: "Rendering and Output",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Render Settings Optimization",
          "Codec Selection",
          "Batch Rendering",
          "Delivery Formats",
        ],
      },
    ],
    features: [
      "40 hours of motion graphics training",
      "Professional animation projects",
      "Expression and script libraries",
      "Render optimization guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Michael Torres",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "1 day ago",
        comment:
          "Ryan's After Effects course is comprehensive and professional. The visual effects section helped me create stunning motion graphics.",
      },
      {
        name: "Elena Popov",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "5 days ago",
        comment:
          "Excellent course for learning motion graphics. The expression section opened up new possibilities for complex animations.",
      },
    ],
  },
  "36": {
    id: 36,
    title: "Typography and Layout Design",
    instructor: "Sophie Williams",
    instructorBio:
      "Typography expert and book designer with 12+ years experience. Specialist in editorial design and type systems for digital and print.",
    instructorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image:
      "https://images.unsplash.com/photo-1503437313881-503a91226402?w=800&h=400&fit=crop",
    price: 799,
    originalPrice: 1599,
    rating: 4.7,
    reviewCount: 567,
    duration: "25 hours",
    level: "Beginner",
    tag: "Bestseller",
    students: 7200,
    language: "English",
    lastUpdated: "December 2024",
    certificate: true,
    description:
      "Master typography and layout design principles. Learn font selection, typographic hierarchy, grid systems, and editorial design for print and digital media.",
    whatYouWillLearn: [
      "Understand typography fundamentals and history",
      "Master font selection and pairing techniques",
      "Create effective typographic hierarchies",
      "Apply grid systems and layout principles",
      "Design for readability and accessibility",
      "Create editorial and publication layouts",
      "Understand type for digital and print media",
      "Develop personal typographic style",
    ],
    requirements: [
      "Basic design software knowledge helpful",
      "Interest in typography and layout",
      "No prior typography experience required",
      "Access to design software (Adobe InDesign preferred)",
    ],
    curriculum: [
      {
        section: "Typography Fundamentals",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "History of Typography",
          "Anatomy of Type",
          "Type Classifications",
          "Font vs Typeface",
        ],
      },
      {
        section: "Font Selection and Pairing",
        lectures: 6,
        duration: "4 hours",
        lessons: [
          "Font Selection Criteria",
          "Type Pairing Principles",
          "Contrast and Harmony",
          "Web Font Considerations",
        ],
      },
      {
        section: "Typographic Hierarchy",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Creating Visual Hierarchy",
          "Size, Weight, and Style",
          "Spacing and Alignment",
          "Information Architecture",
        ],
      },
      {
        section: "Layout and Grid Systems",
        lectures: 8,
        duration: "5 hours",
        lessons: [
          "Grid System Fundamentals",
          "Modular and Baseline Grids",
          "Layout Composition",
          "White Space and Balance",
        ],
      },
      {
        section: "Readability and Accessibility",
        lectures: 6,
        duration: "3 hours",
        lessons: [
          "Legibility vs Readability",
          "Accessibility Guidelines",
          "Type for Different Media",
          "User Experience Considerations",
        ],
      },
      {
        section: "Editorial Design",
        lectures: 8,
        duration: "2 hours",
        lessons: [
          "Magazine Layout Design",
          "Book Design Principles",
          "Multi-page Document Flow",
          "Print Production Basics",
        ],
      },
      {
        section: "Digital Typography",
        lectures: 4,
        duration: "1 hour",
        lessons: [
          "Web Typography Best Practices",
          "Responsive Typography",
          "Variable Fonts",
          "Performance Optimization",
        ],
      },
    ],
    features: [
      "25 hours of typography training",
      "Font pairing exercises",
      "Layout design projects",
      "Typography reference guide",
      "Certificate of completion",
      "Lifetime access",
    ],
    studentReviews: [
      {
        name: "Oliver Brown",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        date: "2 days ago",
        comment:
          "Sophie's typography course transformed my design work. I now understand how to create effective typographic hierarchies.",
      },
      {
        name: "Isabella Garcia",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        rating: 4,
        date: "1 week ago",
        comment:
          "Excellent foundation in typography principles. The font pairing section was particularly helpful for my design projects.",
      },
    ],
  },
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const course = courseId ? courseData[courseId] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <Button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#FFCC00] text-[#375A7E]">
                  {course.tag}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#FFCC00]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(course.rating)
                            ? "fill-current"
                            : "stroke-current"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-400">
                    ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={course.instructorImage || "/placeholder.svg"}
                    alt={course.instructor}
                  />
                  <AvatarFallback>
                    {course.instructor
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    Created by {course.instructor}
                  </p>
                  <p className="text-sm text-gray-400">
                    {course.instructorBio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{course.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                </div>

                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">
                      ₹{course.price.toLocaleString("en-IN")}
                    </span>
                    {course.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{course.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button
                      onClick={handleEnroll}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Enrolled
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Enroll Now
                        </>
                      )}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFavorite}
                        className="flex-1 bg-transparent"
                      >
                        <Heart
                          className={`w-4 h-4 mr-2 ${
                            isFavorited ? "fill-current text-red-500" : ""
                          }`}
                        />
                        {isFavorited ? "Favorited" : "Add to Wishlist"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-gray-100 bg-transparent text-gray-700"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    30-Day Money-Back Guarantee
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">This course includes:</h4>
                    {course.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          What you'll learn
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3">
                          {course.whatYouWillLearn.map(
                            (item: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{item}</span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {course.requirements.map(
                            (req: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Curriculum</CardTitle>
                      <CardDescription>
                        {course.curriculum.length} sections •{" "}
                        {course.curriculum.reduce(
                          (acc: number, section: CurriculumSection) =>
                            acc + section.lectures,
                          0
                        )}{" "}
                        lectures • {course.duration} total length
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {course.curriculum.map(
                          (section: CurriculumSection, index: number) => (
                            <div key={index} className="border rounded-lg">
                              <div className="p-4 bg-gray-50 border-b">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">
                                    {section.section}
                                  </h3>
                                  <div className="text-sm text-gray-600">
                                    {section.lectures} lectures •{" "}
                                    {section.duration}
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <ul className="space-y-2">
                                  {section.lessons.map(
                                    (lesson: string, lessonIndex: number) => (
                                      <li
                                        key={lessonIndex}
                                        className="flex items-center gap-3 text-sm"
                                      >
                                        {/* <Play className="w-4 h-4 text-gray-400" /> */}
                                        <span>{lesson}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={course.instructorImage || "/placeholder.svg"}
                            alt={course.instructor}
                          />
                          <AvatarFallback>
                            {course.instructor
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{course.instructor}</CardTitle>
                          <CardDescription>
                            {course.instructorBio}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {course.rating}
                          </div>
                          <div className="text-sm text-gray-600">
                            Instructor Rating
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {course.reviewCount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {course.students.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Students</div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {course.instructorBio} With extensive industry
                        experience and a passion for teaching, they bring
                        real-world insights and practical knowledge to every
                        lesson. Their teaching methodology focuses on hands-on
                        learning and practical application of concepts.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Student Reviews
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex text-[#FFCC00]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(course.rating)
                                    ? "fill-current"
                                    : "stroke-current"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-2xl font-bold">
                            {course.rating}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          ({course.reviewCount.toLocaleString()} reviews)
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {course.studentReviews.map(
                          (review: Review, index: number) => (
                            <div
                              key={index}
                              className="border-b pb-6 last:border-b-0"
                            >
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarImage
                                    src={review.avatar || "/placeholder.svg"}
                                    alt={review.name}
                                  />
                                  <AvatarFallback>
                                    {review.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold">
                                      {review.name}
                                    </span>
                                    <div className="flex text-[#FFCC00]">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? "fill-current"
                                              : "stroke-current"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {review.date}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Course Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">{course.duration}</div>
                          <div className="text-sm text-gray-600">
                            On-demand video
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">
                            Downloadable resources
                          </div>
                          <div className="text-sm text-gray-600">
                            Access offline
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Mobile access</div>
                          <div className="text-sm text-gray-600">
                            Learn on the go
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Certificate</div>
                          <div className="text-sm text-gray-600">
                            Upon completion
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600">
                        Start learning to track your progress
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
