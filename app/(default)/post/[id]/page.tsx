import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CommentForm } from "./comment-form";
import { formatDate } from "@/lib/date";
import { Suspense } from "react";
import { CommentSection } from "./comments";

type Props = {
  params: {
    id: string;
  };
};

type Comment = {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  postId: string;
  parentId: string | null;
  createdAt: Date;
  depth: number;
  replies: Comment[];
};

async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      content: true,
      createdAt: true,
      upvotes: {
        select: {
          userId: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          upvotes: true,
          comments: true,
        },
      },
    },
  });
}

export default async function PostPage({ params }: Props) {
  const { id } = params;

  const post = await getPostById(id);

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
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {post._count.upvotes} upvotes
          </p>
        </div>
      </div>

      <hr className="my-6" />

      <CommentForm postId={id} />

      <hr className="my-6" />

      <h2 id="comments" className="text-2xl font-semibold mb-4">
        Kommentarer ({post._count.comments})
      </h2>

      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <CommentSection postId={id} />
      </Suspense>
    </main>
  );
}
