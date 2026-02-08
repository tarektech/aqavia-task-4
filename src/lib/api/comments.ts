import type { CommentType, CommentFormdataType } from "@/lib/types/comment";

export async function fetchComments(): Promise<CommentType[]> {
  const response = await fetch("/api/comments");
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return await response.json();
}

export async function createComment(
  data: CommentFormdataType,
): Promise<CommentType> {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${response.status}`);
  }

  return await response.json();
}

export async function updateComment(
  id: number,
  data: CommentFormdataType,
): Promise<CommentType> {
  const response = await fetch("/api/comments", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${response.status}`);
  }

  return await response.json();
}

export async function deleteComment(id: number): Promise<void> {
  const response = await fetch(`/api/comments?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${response.status}`);
  }
}
