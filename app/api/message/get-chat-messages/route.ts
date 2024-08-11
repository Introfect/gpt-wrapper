import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.chatId) {
    return NextResponse.json({data:{messages:[]} });
  }
  try {
    const messages = await db.message.findMany({
      where: {
        chatId: body.chatId,
      },
    });
    return NextResponse.json({ data: { messages: messages } });
  } catch (err) {
    return NextResponse.json({
      message: "Some error occured, please try again",
    });
  }
}
