import { prisma } from "@/lib/db";
import { CommentActions } from "./comment-actions";
import Link from "next/link";

type Props = {
  postId: string;
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

export async function CommentSection({ postId }: Props) {
  const comments = await getCommentsByPostId(postId);

  if (comments.length < 1) {
    return (
      <p className="text-lg text-muted-foreground">Ingen kommentarer enda.</p>
    );
  }

  return <CommentTree comments={comments} depth={0} />;
}
const groupByParentId = (comments: Comment[]): Record<string, Comment[]> => {
  return comments.reduce((groups, comment) => {
    const key = comment.parentId || "null";
    groups[key] = groups[key] || [];
    groups[key].push(comment);
    return groups;
  }, {} as Record<string, Comment[]>);
};

const buildCommentTree = (
  groupedComments: Record<string, Comment[]>,
  parentId: string = "null"
): Comment[] => {
  const comments = groupedComments[parentId] || [];

  comments.forEach((comment) => {
    comment.replies = buildCommentTree(groupedComments, comment.id);
  });

  return comments;
};

async function getCommentsByPostId(id: string) {
  const depth = 10;
  const comments = await prisma.$queryRaw<
    Array<Comment>
  >`WITH RECURSIVE comment_tree AS (
        SELECT c."id", c."content", c."authorId", c."postId", c."parentId", c."createdAt", u."name" AS "authorName", 1 AS depth
        FROM "Comment" c
        INNER JOIN "User" u ON c."authorId" = u."id"
        WHERE c."parentId" IS NULL AND c."postId" = ${id}

        UNION ALL

        SELECT c."id", c."content", c."authorId", c."postId", c."parentId", c."createdAt", u."name" AS "authorName", ct.depth + 1
        FROM "Comment" c
        INNER JOIN comment_tree ct ON c."parentId" = ct."id"
        INNER JOIN "User" u ON c."authorId" = u."id"
        WHERE ct.depth < ${depth}
      )

      SELECT * FROM comment_tree;
    `;

  const groupedComments = groupByParentId(comments);
  return buildCommentTree(groupedComments);
}

const CommentTree = ({
  comments,
  depth,
}: {
  comments: Comment[];
  depth: number;
}) => {
  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          id={comment.id}
          className={depth > 0 ? "border-l-2 border-gray-200 pl-4" : ""}
        >
          <Link href={"/user/" + comment.authorId}>
            <h3 className="text-lg font-semibold hover:underline">
              {comment.authorName}
            </h3>
          </Link>
          <div className="flex flex-col gap-2 mb-2">
            {comment.content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <CommentActions postId={comment.postId} commentId={comment.id} />
          <CommentTree comments={comment.replies} depth={comment.depth} />
        </div>
      ))}
    </div>
  );
};
