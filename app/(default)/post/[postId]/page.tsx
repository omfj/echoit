import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CommentForm } from "./comment-form";
import { formatDate } from "@/lib/date";
import { Suspense } from "react";
import { CommentSection } from "./comments";
import { PostActions } from "./post-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: Props) {
  const { postId } = params;

  const post = await getPostById(postId);

  if (!post) {
    return notFound();
  }

  return (
    <main className="p-5 max-w-screen-lg w-full mx-auto">
      <h1 className="text-5xl font-semibold mb-4">{post.title}</h1>

      <div className="flex flex-col gap-2 mb-8">
        {post.content.split("\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="flex items-center divide-x [&>*]:px-2 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0 ">
        <PostActions postId={postId} />
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {post._count.upvotes} upvotes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      <hr className="my-6" />

      <CommentForm postId={postId} />

      <hr className="my-6" />

      <h2 id="comments" className="text-2xl font-semibold mb-4">
        Kommentarer ({post._count.comments})
      </h2>

      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <CommentSection postId={postId} />
      </Suspense>
    </main>
  );
}

async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      content: true,
      createdAt: true,
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
  });
}
