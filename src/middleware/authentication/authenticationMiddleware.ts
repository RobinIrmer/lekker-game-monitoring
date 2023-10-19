import express from 'express';

export interface AuthenticationMiddleware {
  validateToken(req: express.Request, res: express.Response, next: express.NextFunction): void;
}