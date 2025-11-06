// // File: chatRouteStreaming.ts
// import type { Mastra } from "@mastra/core";

// export const chatRoute = {
//   path: "/chat-bot",
//   method: "POST",
//   createHandler: async ({ mastra }: { mastra: Mastra }) => {
//     return async (c) => {
//       let body: {
//         messages?: Array<{ content: string }>;
//         memory?: { resource?: string; thread?: string };
//       };

//       try {
//         body = await c.req.json();
//       } catch {
//         const raw = await c.req.text();
//         body = JSON.parse(raw);
//       }

//       if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
//         return c.json({ error: "messages[].content is required" }, 400);
//       }

//       const agent = mastra.getAgent("chatbot");
//       if (!agent) {
//         return c.json({ error: "Agent 'chatbot' not found" }, 500);
//       }

//       const execOptions = body.memory?.resource && body.memory?.thread
//         ? { memory: { resource: body.memory.resource, thread: body.memory.thread } }
//         : undefined;

//       // Convert structured messages to string[] for compatibility
//       const simpleMessages = body.messages.map(m => m.content);

//       const stream = await agent.stream(simpleMessages, {
//         format: "aisdk",
//         ...execOptions,
//       });

//       return stream.toUIMessageStreamResponse();
//     };
//   },
// } as const;

// export default chatRoute;
