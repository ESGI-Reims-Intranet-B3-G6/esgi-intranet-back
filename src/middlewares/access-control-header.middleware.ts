import { Request, Response, NextFunction } from 'express';

let frontendUrl: string;

export function setFrontendUrl(url: string) {
  frontendUrl = url;
}

export function accessControlHeader(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', frontendUrl);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}
