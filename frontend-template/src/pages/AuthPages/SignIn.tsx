import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Learning Management System - Sign In"
        description="This is the sign in page of the learning management system."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
