"use client";

import {
  MAX_CONTENT_LENGTH,
  MAX_TITLE_LENGTH,
  postSchema,
} from "@/lib/validations";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function PostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    const { status } = await axios.post(
      "/api/post",
      {
        title: data.title,
        content: data.content,
      },
      {
        validateStatus: () => true,
      }
    );

    setIsSubmitting(false);

    if (status === 201) {
      form.reset();
      alert("Post created!");
      return;
    }

    alert(`Somehting went wrong! Status: ${status}`);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            const titleLength = form.watch("title")?.length ?? 0;

            return (
              <FormItem>
                <FormLabel>Tittel</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Din tittel..."
                    {...field}
                  />
                </FormControl>
                <FormDescription
                  className={cn({
                    "text-destructive": titleLength > MAX_TITLE_LENGTH,
                  })}
                >
                  {titleLength}/{MAX_TITLE_LENGTH}
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Innhold</FormLabel>
              <FormControl>
                <Textarea
                  autoComplete="off"
                  placeholder="Ditt innhold..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {form.watch("content")?.length ?? 0}/{MAX_CONTENT_LENGTH}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">
                <LoaderIcon className="h-5 w-5" />
              </span>
              Oppretter...
            </span>
          ) : (
            "Opprett"
          )}
        </Button>
      </form>
    </Form>
  );
}
