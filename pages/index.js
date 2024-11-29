// pages/index.js
import Link from 'next/link';

export default function Landing() {
  return (
    <div>
      <h1>Welcome to Supabase CRUD with Next.js</h1>
      <p>Please <Link href="/login">Login</Link> or <Link href="/signup">Sign Up</Link> to continue.</p>
    </div>
  );
}
