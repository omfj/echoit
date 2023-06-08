import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { commentSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";

const contextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

export async function POST(
  request: Request,
  context: z.infer<typeof contextSchema>
) {
  try {
    const session = await getSession();

    if (!session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const parsedContext = contextSchema.parse(context);
    const payload = commentSchema.parse(await request.json());

    const comment = await prisma.comment.create({
      data: {
        content: payload.content,
        authorId: session.user.id,
        postId: parsedContext.params.postId,
      },
    });

    return NextResponse.json(
      {
        message: "Comment created successfully",
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
