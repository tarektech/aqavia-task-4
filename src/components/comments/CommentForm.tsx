"use no memo";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useCommentStore } from "@/lib/stores/comment-store";
import type { CommentFormdataType } from "@/lib/types/comment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddComment } from "./AddComment";

export function CommentForm() {
  const { editingComment, createComment, updateComment, setEditingComment } =
    useCommentStore();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editingComment;

  const form = useForm<CommentFormdataType>({
    defaultValues: { name: "", email: "", body: "" },
    shouldUnregister: false,
  });

  useEffect(() => {
    if (editingComment) {
      form.reset({
        name: editingComment.name,
        email: editingComment.email,
        body: editingComment.body,
      });
    } else {
      form.reset({ name: "", email: "", body: "" });
    }
  }, [editingComment, form]);

  async function onSubmit(data: CommentFormdataType) {
    setPending(true);
    setError(null);

    try {
      if (isEditing && editingComment) {
        await updateComment(editingComment.id, data);
      } else {
        await createComment(data);
        form.reset({ name: "", email: "", body: "" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  function handleCancel() {
    setEditingComment(null);
    form.reset({ name: "", email: "", body: "" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Comment" : "Add New Comment"}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AddComment pending={pending} />

            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {pending
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Comment"
                    : "Create Comment"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={pending}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
