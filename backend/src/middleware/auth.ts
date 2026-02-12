// JWT authentication middleware

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { AuthenticationError } from '../utils/errors';
import { sendError } from '../utils/response';
import { config } from '../config/env';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    console.log("AUTH HEADER RECEIVED:", req.headers.authorization);
    console.log("JWT VERIFY SECRET BEING USED:", process.env.JWT_ACCESS_TOKEN_SECRET, process.env.JWT_SECRET);

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as {
        userId: string;
        email: string;
      };

      req.userId = decoded.userId;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token expired');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      sendError(res, error.message, error.statusCode);
    } else {
      sendError(res, 'Authentication failed', 401);
    }
  }
};
