import AuthLayout from '@/components/layout/auth-layout';
import SignInForm from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
