"use client";

import { MAX_COMMENT_LENGTH, commentSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { AlertTriangle, LoaderIcon, MoveUp, Reply, Share } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  commentId: string;
};

export function CommentActions({ postId, commentId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    const { status } = await axios.post(
      "/api/post/" + postId + "/comment/" + commentId,
      {
        content: data.content,
      },
      {
        validateStatus: () => true,
      }
    );

    setIsSubmitting(false);

    if (status === 201) {
      form.reset();
      router.refresh();
      setIsReplying(false);
      alert("Comment submitted!");
      return;
    }

    alert(`Somehting went wrong! Status: ${status}`);
  });

  const handleUpvote = async () => {
    const { status } = await axios.patch(
      `/api/post/${postId}/comment/${commentId}/upvote`,
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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      window.location.origin + "/post/" + postId + "/#" + commentId
    );
    alert("Kopiert til utklippstavle!");
  };

  const handleNotImplemented = () => {
    alert("Not implemented yet!");
  };

  return (
    <>
      <div className="flex items-center divide-x [&>*]:px-2 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0 ">
        <button
          className="text-sm flex items-center gap-2 text-muted-foreground hover:underline mb-2"
          onClick={handleUpvote}
        >
          <MoveUp className="h-4 w-4" />
        </button>
        <button
          className="text-sm text-muted-foreground flex items-center gap-1 hover:underline mb-2"
          onClick={() => setIsReplying((prev) => !prev)}
        >
          {isReplying ? (
            "Avbryt"
          ) : (
            <>
              Svar <Reply className="inline-block h-3 w-3" />
            </>
          )}
        </button>
        <button
          className="text-sm text-muted-foreground flex items-center gap-1 hover:underline mb-2"
          onClick={handleCopyToClipboard}
        >
          Del <Share className="inline-block h-3 w-3" />
        </button>
        <button
          className="text-sm text-muted-foreground flex items-center gap-1 hover:underline mb-2"
          onClick={handleNotImplemented}
        >
          Rapporter <AlertTriangle className="inline-block h-3 w-3" />
        </button>
      </div>

      {isReplying && (
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="border-l-2 border-gray-200 pl-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                const commentLength = form.watch("content")?.length ?? 0;

                return (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        autoComplete="off"
                        placeholder="Din kommentar..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription
                      className={cn({
                        "text-destructive": commentLength > MAX_COMMENT_LENGTH,
                      })}
                    >
                      {commentLength}/{MAX_COMMENT_LENGTH}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">
                    <LoaderIcon className="h-5 w-5" />
                  </span>
                  Sender...
                </span>
              ) : (
                "Kommenter"
              )}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
