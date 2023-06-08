import { formatDate } from "@/lib/date";
import { prisma } from "@/lib/db";
import Link from "next/link";

async function getNewestPosts() {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      author: {
        select: {
          name: true,
          id: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
      upvotes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          comments: true,
          upvotes: true,
        },
      },
      createdAt: true,
      id: true,
      title: true,
    },
  });
}

export default async function FeedPage() {
  const posts = await getNewestPosts();

  return (
    <main className="p-5 max-w-screen-lg w-full mx-auto">
      <h1 className="text-5xl font-semibold mb-4">Newest posts</h1>

      {posts.length < 1 ? (
        <p>No posts yet</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="py-4 flex flex-col gap-1">
                <Link href={"/post/" + post.id}>
                  <h2 className="text-xl font-semibold hover:underline">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex items-center divide-x [&>*]:px-2 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0 ">
                  <p>{post._count.upvotes} upvotes</p>
                  <Link href={"/post/" + post.id + "#comments"} scroll={false}>
                    <p className="hover:underline">
                      {post._count.comments} comments
                    </p>
                  </Link>
                  <p>{formatDate(post.createdAt)}</p>
                  <p>
                    Laget av{" "}
                    <Link
                      className="hover:underline"
                      href={"/user/" + post.author.id}
                    >
                      {post.author.name}
                    </Link>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
