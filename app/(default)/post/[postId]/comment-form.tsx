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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
};

export function CommentForm({ postId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    const { status } = await axios.post(
      "/api/post/" + postId + "/comment",
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
      return;
    }

    alert(`Somehting went wrong! Status: ${status}`);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            const commentLength = form.watch("content")?.length ?? 0;

            return (
              <FormItem>
                <FormLabel>Tittel</FormLabel>
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
  );
}
