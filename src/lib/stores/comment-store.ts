import { create } from "zustand";
import type { CommentType, CommentFormdataType } from "@/lib/types/comment";
import * as api from "@/lib/api/comments";

type CommentStore = {
  comments: CommentType[];
  loading: boolean;
  error: string | null;
  editingComment: CommentType | null;

  fetchComments: () => Promise<void>;
  createComment: (data: CommentFormdataType) => Promise<void>;
  updateComment: (id: number, data: CommentFormdataType) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
  setEditingComment: (comment: CommentType | null) => void;
  clearError: () => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  loading: true,
  error: null,
  editingComment: null,

  fetchComments: async () => {
    try {
      set({ loading: true, error: null });
      const comments = await api.fetchComments();
      set({ comments });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch comments",
      });
    } finally {
      set({ loading: false });
    }
  },

  createComment: async (data: CommentFormdataType) => {
    try {
      const comment = await api.createComment(data);
      set((state) => ({ comments: [comment, ...state.comments] }));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to create comment");
    }
  },

  updateComment: async (id: number, data: CommentFormdataType) => {
    try {
      const comment = await api.updateComment(id, data);
      set((state) => ({
        comments: state.comments.map((c) => (c.id === id ? comment : c)),
        editingComment: null,
      }));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update comment");
    }
  },

  deleteComment: async (id: number) => {
    try {
      await api.deleteComment(id);
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== id),
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to delete comment",
      });
    }
  },

  setEditingComment: (comment: CommentType | null) =>
    set({ editingComment: comment }),

  clearError: () => set({ error: null }),
}));
