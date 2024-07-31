import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <UserProfile path="/member/profile" />
    </div>
  )
};
