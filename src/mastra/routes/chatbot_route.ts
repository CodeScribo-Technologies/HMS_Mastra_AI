import { chatbotService } from '../agents/chatbot';

export const chatRoute = {
  path: '/chat-bot',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      let body: { message?: string; messages?: Array<{ content: string }>; memory?: { resource?: string; thread?: string } } | null = null;

      try {
        try {
          body = await c.req.json();
        } catch {
          const raw = await c.req.text();
          body = JSON.parse(raw);
        }

        if (!body || typeof body !== 'object') {
          return c.json({ error: 'Body must be a valid object' }, 400);
        }

        const single = typeof body.message === 'string' ? body.message : undefined;
        const fromArray =
          Array.isArray(body.messages) && body.messages.length > 0
            ? String(body.messages[0]?.content ?? '')
            : undefined;

        const userText = (single ?? fromArray ?? '').trim();

        if (!userText) {
          return c.json({ error: 'Provide message: string or messages[0].content: string' }, 400);
        }

        const result = await chatbotService(mastra, { text: userText, memory: body.memory });

        return c.json({ result: result.text });
      } catch (error) {
        console.error('Chatbot route error:', error);
        return c.json({ error: 'Invalid JSON body' }, 400);
      }
    };
  },
} as const;

export default chatRoute;
