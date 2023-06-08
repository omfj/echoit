import { getSession } from "@/lib/session";
import { PostForm } from "./post-form";
import { AlertTriangle } from "lucide-react";

export default async function CreatePostPage() {
  const session = await getSession();

  return (
    <main className="p-5 mx-auto w-full max-w-screen-sm">
      <h1 className="text-4xl font-semibold mb-4">Opprett et innlegg</h1>

      {!session && (
        <div className="border-2 border-yellow-400 p-3 bg-yellow-200/30 mb-5">
          <h3 className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" aria-hidden="true" />
            Du må logge inn for å opprette et innlegg.
          </h3>
        </div>
      )}

      <PostForm />
    </main>
  );
}
