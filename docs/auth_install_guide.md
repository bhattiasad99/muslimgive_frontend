# Frontend Auth Install Guide (Copy-Paste)

This guide is for beginners. It shows how to copy the `auth` folder into a brand new Next.js app and plug it in.

Goal: “copy, paste, connect, done.”

---

## What You Are Copying

Copy this folder from the current project:

`muslimgive_frontend/src/auth/`

It contains:
- server actions (login/logout)
- cookie helpers
- API helpers
- form validators
- auth constants

---

## Step 1: Copy the Folder

In your new project, create:

```
src/auth/
```

Then paste all files from:

```
muslimgive_frontend/src/auth/*
```

You should have:
- `src/auth/actions.ts`
- `src/auth/cookies.ts`
- `src/auth/methods.ts`
- `src/auth/forms.ts`
- `src/auth/constants.ts`
- `src/auth/index.ts`

---

## Step 2: Add Backend URL

Add this to `.env`:

```
NEXT_PUBLIC_SERVER=http://localhost:3001
```

This must point to your backend.

---

## Step 3: Add Middleware (Route Protection)


Create File: `src/middleware.ts`

```ts
import { NextRequest } from "next/server";
import { configObj, middlewareFn } from "@/auth/middleware";

export default async function middleware(req: NextRequest) {
  return middlewareFn(req);
}

const MATCHER_PATHS = ["/dashboard", "/admin"];
export const config = configObj(MATCHER_PATHS);
```

Edit `MATCHER_PATHS` to match your protected routes.

---

## Step 4: Login Form

Example login page component:

```tsx
import { signIn } from "@/auth/actions";
import { LoginFormState } from "@/auth/forms";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action] = useActionState(signIn, {} as LoginFormState);

  return (
    <form action={action}>
      <input name="login__email" />
      <input name="login__password" type="password" />
      <button type="submit">Login</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

---

## Step 5: Use Protected API Calls

Example usage in a server action:

```ts
import { _get } from "@/auth/methods";

export const getProfile = async () => {
  return _get("/users/me");
};
```

Use `_post`, `_patch`, `_delete` the same way.

---

## Step 6: Logout Button

```tsx
import { signOut } from "@/auth/actions";

export default function LogoutButton() {
  return <button onClick={async () => await signOut()}>Logout</button>;
}
```

---

## Step 7: Quick Checklist

- `src/auth/` is copied
- `.env` has `NEXT_PUBLIC_SERVER`
- `middleware.ts` exists
- Login uses `signIn`
- Protected API calls use `_get/_post/_patch/_delete`

---

## That’s It

If all steps are done, your auth is plug-and-play.
