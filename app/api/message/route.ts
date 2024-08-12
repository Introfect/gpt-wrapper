import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RoleSchema = z.union([z.literal("user"), z.literal("system")]);

const NewReplySchema = z.object({
  chat: z.object({
    chatId: z.optional(z.string().nullable()),
    role: RoleSchema,
    content: z.string(),
  }),
});
export async function POST(req: Request) {
  const body = NewReplySchema.parse(await req.json());
  if (body.chat.chatId != null) {
    await db.message.create({
      data: {
        chatId: body.chat.chatId,
        content: body.chat.content,
        role: body.chat.role,
      },
    });

    const contextMessages = await db.message.findMany({
      where: {
        chatId: body.chat.chatId,
      },
    });

    const completion = await openai.chat.completions.create({
      messages: contextMessages,
      model: "gpt-4o-mini",
    });
    if (completion) {
      await db.message.create({
        data: {
          chatId: body.chat.chatId,
          content: String(completion.choices[0].message.content),
          role: "system",
        },
      });
    }
    return NextResponse.json({
      data: { data: completion.choices[0].message.content },
    });
  } else {
    const { role, content } = body.chat;
    const chat = {
      role,
      content,
    };
    const chatTopic = await openai.chat.completions.create({
      messages: [
        chat,
        { content: "reprase the question in 4 words", role: "user" },
      ],
      model: "gpt-4o-mini",
    });
    const createChat = await db.chat.create({
      data: {
        messages: {
          create: chat,  
        },
        chatTopic: String(chatTopic.choices[0].message.content),
      },
    });
    
    const contextMessages = await db.message.findMany({
      where: {
        chatId: createChat.id,
      },
    });
    
    const completion = await openai.chat.completions.create({
      messages: contextMessages,  // This includes the first message.
      model: "gpt-4o-mini",
    });
    
    if (completion) {
      await db.message.create({
        data: {
          chatId: createChat.id,
          content: String(completion.choices[0].message.content),
          role: "system",
        },
      });
    }
    
    return NextResponse.json({
      data: { data: completion.choices[0].message.content, id: createChat.id },
    });
  }
}
