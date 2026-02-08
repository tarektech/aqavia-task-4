"use client";

import { useEffect } from "react";
import { useCommentStore } from "@/lib/stores/comment-store";
import { CommentCard } from "./CommentCard";
import { CommentForm } from "./CommentForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CommentList() {
  const { comments, loading, error, fetchComments, clearError } =
    useCommentStore();

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="space-y-6">
      <CommentForm />

      {error && (
        <Alert variant="destructive">
          <div className="flex items-center justify-between">
            <AlertDescription>{error}</AlertDescription>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
              >
                Dismiss
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchComments}
              >
                Retry
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={String(i)} className="p-6">
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No comments yet. Be the first to comment!
            </Card>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
