"use client";

import { CommentList } from "./comments/CommentList";

export function CommentsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Comments Management</h1>
      </div>
      <CommentList />
    </div>
  );
}
