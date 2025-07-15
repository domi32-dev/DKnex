import AuthLayout from '@/components/layout/auth-layout';
import { SigninForm } from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <AuthLayout>
      <SigninForm />
    </AuthLayout>
  );
}
