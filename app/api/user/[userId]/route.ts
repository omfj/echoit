import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { userSettingsSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";

const contextSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .max(255)
      .regex(/^[a-zA-Z0-9_]+$/),
  }),
});

export async function PATCH(
  request: Request,
  context: z.infer<typeof contextSchema>
) {
  try {
    const session = await getSession();

    if (!session?.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const parsedContext = contextSchema.parse(context);
    const payload = userSettingsSchema.parse(await request.json());

    if (session.user.id !== parsedContext.params.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      },
    });

    return NextResponse.json(
      {
        message: "User updated",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
