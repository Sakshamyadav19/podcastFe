import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn 
        routing="path" 
        path="/signin" 
        fallbackRedirectUrl="/home"
        signUpUrl="/signup"
      />
    </div>
  );
};

export default SignInPage;