import { type NextRequest, NextResponse } from "next/server";
import type { CommentFormdataType, CommentType } from "@/lib/types/comment";

const API_URL = "https://jsonplaceholder.typicode.com/comments";
const DEFAULT_POST_ID = 1;

// All comments live here — loaded from JSONPlaceholder on first GET
let comments: CommentType[] = [];
let initPromise: Promise<void> | null = null;

async function loadInitialComments() {
  if (!initPromise) {
    initPromise = (async () => {
      const res = await fetch(`${API_URL}?_limit=5`);
      if (res.ok) comments = await res.json();
    })();
  }
  return initPromise;
}

function nextId(): number {
  return comments.length > 0
    ? Math.max(...comments.map((c) => c.id)) + 1
    : 1;
}

export async function GET() {
  try {
    await loadInitialComments();
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CommentFormdataType;

    if (!body.name?.trim() || !body.email?.trim() || !body.body?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and body are required" },
        { status: 400 },
      );
    }

    const id = nextId();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: body.name,
        email: body.email,
        body: body.body,
        postId: DEFAULT_POST_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.statusText}`);
    }

    const comment: CommentType = {
      id,
      postId: DEFAULT_POST_ID,
      name: body.name,
      email: body.email,
      body: body.body,
    };
    comments.push(comment);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as CommentType;

    if (!body.id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 },
      );
    }

    if (!body.name?.trim() || !body.email?.trim() || !body.body?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and body are required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_URL}/${body.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        body: body.body,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update comment: ${response.statusText}`);
    }

    const comment: CommentType = {
      postId: body.postId ?? DEFAULT_POST_ID,
      id: body.id,
      name: body.name,
      email: body.email,
      body: body.body,
    };

    const idx = comments.findIndex((c) => c.id === body.id);
    if (idx !== -1) comments[idx] = comment;

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }

    comments = comments.filter((c) => c.id !== Number(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
