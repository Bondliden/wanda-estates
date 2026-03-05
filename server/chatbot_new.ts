import { Request, Response } from 'express';

export async function handleChatMessage(req: Request, res: Response) {
  res.json({ response: 'Test new file working' });
}

export function setupChatbotRoutes(app: any) {
  app.post('/api/chat', handleChatMessage);
}
