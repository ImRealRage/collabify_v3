import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center auth-background">
      <SignIn />
    </div>
  );
}
