// Type definitions for BotCraft AI backend

import { Request } from 'express';

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Auth types
export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// Chatbot types
export interface CreateChatbotInput {
  name: string;
  description?: string;
  config?: Record<string, any>;
}

export interface UpdateChatbotInput {
  name?: string;
  description?: string;
  config?: Record<string, any>;
}

// Document types
export interface DocumentMetadata {
  pageCount?: number;
  wordCount?: number;
  extractedText?: string; // For future RAG processing
  [key: string]: any;
}

// Chat types
export interface ChatInput {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  // Future: Will include sources/references when RAG is implemented
}

// Settings types
export interface UpdateSettingsInput {
  theme?: string;
  language?: string;
  notifications?: boolean;
  preferences?: Record<string, any>;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
