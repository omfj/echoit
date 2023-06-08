"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userSettingsSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  user: User;
};

export function UserSettingsForm({ user }: Props) {
  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { status } = await axios.patch(
      `/api/user/${user.id}`,
      data satisfies z.infer<typeof userSettingsSchema>,
      {
        validateStatus: () => true,
      }
    );

    if (status === 200) {
      alert("Brukeren ble oppdatert");
      return;
    }

    alert("Noe gikk galt. Fikk ikke til å oppdatere brukeren.");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 border shadow-lg p-5">
        <h1 className="text-5xl font-semibold mb-4">Innstillinger</h1>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brukernavn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Brukernavnet for din profil</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Ditt navn</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Din e-post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Lagre</Button>
      </form>
    </Form>
  );
}
