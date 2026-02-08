"use no memo";

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useFormContext } from "react-hook-form";
import type { CommentFormdataType } from "@/lib/types/comment";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AddComment({ pending = false }: { pending?: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommentFormdataType>();
  return (
    <>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldContent>
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder="Your name"
            disabled={pending}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Invalid email address" },
            })}
            type="email"
            placeholder="your.email@example.com"
            disabled={pending}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Comment</FieldLabel>
        <FieldContent>
          <Textarea
            {...register("body", { required: "Comment body is required" })}
            placeholder="Write your comment here..."
            rows={4}
            disabled={pending}
          />
          <FieldError errors={errors.body ? [errors.body] : undefined} />
        </FieldContent>
      </Field>
    </>
  );
}
