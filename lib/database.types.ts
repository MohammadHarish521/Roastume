export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          blurb: string | null;
          file_url: string | null;
          file_type: "image" | "pdf" | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          blurb?: string | null;
          file_url?: string | null;
          file_type?: "image" | "pdf" | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          blurb?: string | null;
          file_url?: string | null;
          file_type?: "image" | "pdf" | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          resume_id: string;
          user_id: string;
          text: string;
          parent_id: string | null;
          upvotes_count: number;
          downvotes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          user_id: string;
          text: string;
          parent_id?: string | null;
          upvotes_count?: number;
          downvotes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          user_id?: string;
          text?: string;
          parent_id?: string | null;
          upvotes_count?: number;
          downvotes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comment_votes: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          vote_type: "upvote" | "downvote";
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          vote_type: "upvote" | "downvote";
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          vote_type?: "upvote" | "downvote";
          created_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          resume_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "like" | "comment" | "reply";
          resume_id: string | null;
          actor_id: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "like" | "comment" | "reply";
          resume_id?: string | null;
          actor_id: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "like" | "comment" | "reply";
          resume_id?: string | null;
          actor_id?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
