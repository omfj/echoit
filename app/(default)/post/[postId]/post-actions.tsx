"use client";

import axios from "axios";
import { MoveUp } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
};

export function PostActions({ postId }: Props) {
  const router = useRouter();

  const handleUpvote = async () => {
    const { status } = await axios.patch(
      `/api/post/${postId}/upvote`,
      undefined,
      {
        validateStatus: () => true,
      }
    );

    if (status === 201) {
      router.refresh();
      return;
    }

    alert(`Something went wrong. Status: ${status}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-sm flex items-center gap-2 text-muted-foreground hover:underline"
        onClick={handleUpvote}
      >
        <MoveUp className="h-4 w-4" />
        Upvote
      </button>
    </div>
  );
}
