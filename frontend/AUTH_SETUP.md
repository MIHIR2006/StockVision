# NextAuth.js Integration for StockVision

This project uses [NextAuth.js](https://next-auth.js.org/) for authentication and authorization in the frontend.

## Features
- OAuth login with GitHub and Google
- Email/password login (demo logic, replace with your backend)
- Secure session management using JWT
- User-friendly, modern UI consistent with StockVision's design

## Setup Instructions

### 1. Install Dependencies

```
npm install next-auth
```

### 2. Environment Variables

Add the following to your `.env.local` in the `frontend` directory:

```
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

- Get OAuth credentials from [GitHub](https://github.com/settings/developers) and [Google](https://console.developers.google.com/).
- Generate a strong `NEXTAUTH_SECRET` (e.g., `openssl rand -base64 32`).

### 3. API Route

`app/api/auth/[...nextauth].ts` is set up for NextAuth.js configuration.

### 4. Session Provider

`pages/_app.tsx` wraps your app with `SessionProvider` for session state.

### 5. Login UI

- Visit `/login` to sign in/out.
- UI is styled to match StockVision's branding.

### 6. Usage in Components

Use `useSession`, `signIn`, and `signOut` from `next-auth/react` to access session state and authentication actions.

### 7. Customization

- Replace the demo email/password logic in `[...nextauth].ts` with your backend user validation.
- Add more providers as needed.

---

For more, see [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction).
