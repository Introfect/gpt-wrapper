import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const chats = await db.chat.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({data  : {chats: chats}});
  } catch (error) {
    return NextResponse.error();
  }
}

