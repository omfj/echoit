import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const contextSchema = z.object({
  params: z.object({
    postId: z.string(),
    commentId: z.string(),
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

    const commentUpvote = await prisma.commentUpvote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: parsedContext.params.commentId,
        },
      },
    });

    if (commentUpvote) {
      await prisma.commentUpvote.delete({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId: parsedContext.params.commentId,
          },
        },
      });
    } else {
      await prisma.commentUpvote.create({
        data: {
          userId: session.user.id,
          commentId: parsedContext.params.commentId,
        },
      });
    }

    return NextResponse.json(
      {
        message: `Comment ${
          commentUpvote ? "downvoted" : "upvoted"
        } successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
