"use client";

import { useState } from "react";
import type { CommentType } from "@/lib/types/comment";
import { useCommentStore } from "@/lib/stores/comment-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";

type CommentCardProps = {
  comment: CommentType;
};

export function CommentCard({ comment }: CommentCardProps) {
  const { deleteComment, setEditingComment } = useCommentStore();
  const [deleting, setDeleting] = useState(false);
  async function handleDelete() {
    setDeleting(true);
    await deleteComment(comment.id);
    setDeleting(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{comment.name}</h3>
          <p className="text-sm text-muted-foreground">#{comment.id}</p>
        </div>
        <p className="text-sm text-muted-foreground">{comment.email}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingComment(comment)}
          disabled={deleting}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
}
