import MemberLayout from "@/components/Layouts/MemberLayout";

export default function LayoutMember({ children }: { children: React.ReactNode }) {
  return (
    <MemberLayout>
      {children}
    </MemberLayout>

  )
  // }

}
