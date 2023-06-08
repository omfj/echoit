import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const contextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

export async function PATCH(
  _request: Request,
  context: z.infer<typeof contextSchema>
) {
  try {
    const session = await getSession();

    if (!session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const parsedContext = contextSchema.parse(context);

    const postUpvote = await prisma.postUpvote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: parsedContext.params.postId,
        },
      },
    });

    if (postUpvote) {
      await prisma.postUpvote.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: parsedContext.params.postId,
          },
        },
      });
    } else {
      await prisma.postUpvote.create({
        data: {
          userId: session.user.id,
          postId: parsedContext.params.postId,
        },
      });
    }

    return NextResponse.json(
      {
        message: `Post ${postUpvote ? "downvoted" : "upvoted"} successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
