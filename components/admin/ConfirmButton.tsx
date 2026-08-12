'use client';

import type { ReactNode } from 'react';

/**
 * Submit button that asks for confirmation before firing.
 * Optionally targets a different server action via `formAction`.
 */
export default function ConfirmButton({
  children,
  className,
  message = 'Are you sure? This cannot be undone.',
  formAction,
}: {
  children: ReactNode;
  className?: string;
  message?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
