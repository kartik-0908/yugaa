import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="">
        <div className="bg-black flex justify-center items-center  h-screen">
          <div className="mx-auto my-auto text-5xl ">
            <SignIn
              signUpUrl="/email/sign-up"
              appearance={{
                variables: {
                  fontSize: "16px"
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}