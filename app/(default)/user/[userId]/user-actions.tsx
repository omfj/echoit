"use client";

import { Button } from "@/components/ui/button";

type Props = {
  userId: string;
};

export function UserActions({ userId }: Props) {
  const handleFollow = async () => {
    alert("Not implemented yet!");
  };

  return (
    <div className="flex flex-row items-center gap-2 mb-8">
      <Button onClick={handleFollow}>Følg</Button>
    </div>
  );
}
