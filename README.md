# InertiaPixel React/NextJs Auth Library

![InertiaPixel Auth](https://www.inertiapixel.com/images/logo-min.svg)

## react-auth
Authentication library for **React** and **Next.js**. Supports credential and social login, JWT token handling, and context-based auth state — built for scalable, multi-project use.

## 🚀 Installation

Install the package via npm:

```sh
npm install @inertiapixel/react-auth
```

## 🚀 Features

- ✅ Easy setup with `AuthProvider`
- 🔒 JWT-based authentication
- 🔑 Supports:
  - Credentials login (email + password)
  <!-- - OTP-based login
  - Social logins (Google, Facebook) -->
- 🧠 Context-driven auth state
- 📦 Built-in utilities like `useAuth`, `Protect`, `SignedIn`, `SignedOut`
- 🧪 Type-safe API (written in TypeScript)
- ⚙️ Plug-and-play for scalable projects

## 🛠️ Basic Usage

### 1. Wrap your App with `AuthProvider`

```tsx
// pages/_app.tsx
import { AuthProvider, SignedIn, SignedOut } from '@inertiapixel/react-auth'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider config={{ tokenKey: 'token', redirectTo: '/' }}>
      <SignedIn>
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
    </AuthProvider>
  )
}
``` 

## Authors

- **Md Asif** - [LinkedIn](https://www.linkedin.com/in/md-asif-ba446aa3/)

### Website
🔗 www.inertiapixel.com/

## License

This icon set is **free** and open-source under the **MIT License**.  
See the full license [here](https://github.com/inertiapixel/react-auth/blob/master/LICENSE).

**Crafted in India by [InertiaPixel](https://www.inertiapixel.com/)**