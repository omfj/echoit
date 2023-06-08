import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { UserActions } from "./user-actions";
import Image from "next/image";

type Props = {
  params: {
    userId: string;
  };
};

export default async function UserPage({ params }: Props) {
  const { userId } = params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <main className="p-5 max-w-screen-lg w-full mx-auto">
      <div className="flex flex-col md:flex-row mb-5 gap-6">
        {user.image && (
          <Image
            src={user.image}
            alt="Profile picture"
            className="shadow-xl rounded-full"
            width={200}
            height={200}
          />
        )}
        <div>
          <h1 className="text-5xl font-semibold mb-4">{user.name}</h1>

          <div className="flex items-center mb-4 divide-x [&>*]:px-2 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0 ">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {user._count.posts} innlegg
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {user._count.followers} følgere
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {user._count.following} følger
              </p>
            </div>
          </div>
          <UserActions userId={user.id} />
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <p className="text-xs uppercase font-semibold">Brukernavn:</p>
          <p>{user.id}</p>
        </div>

        <div>
          <p className="text-xs uppercase font-semibold">Navn:</p>
          <p>{user.name}</p>
        </div>

        <div>
          <p className="text-xs uppercase font-semibold">E-post:</p>
          <p>{user.email}</p>
        </div>
      </div>
    </main>
  );
}
