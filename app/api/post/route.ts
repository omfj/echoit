import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { postSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = postSchema.parse(await request.json());

    const post = await prisma.post.create({
      data: {
        title: payload.title,
        content: payload.content,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Post created successfully",
        data: post,
      },
      { status: 201 }
    );
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
