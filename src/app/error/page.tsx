// src/app/error/page.tsx
export default function ErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p>Error type: {searchParams.error}</p>
      <a href="/auth/signIn" className="text-blue-500 underline">Back to Sign In</a>
    </div>
  );
}