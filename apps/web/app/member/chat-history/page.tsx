import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChatCard2 from "@/components/Chat/ChatCard2";
import { useEffect, useState } from "react";
import ConversationDetails from "@/components/Chat/ConversationCard";
import ConversationDetailsEmpty from "@/components/Chat/ConversationCardempty";
import AdminLayout from "@/components/Layouts/AdminLayout";




export default async function Chat({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    page?: string;
  };
}) {
  const filter = searchParams?.filter || 'all';
  const currentPage = Number(searchParams?.page) || 1;

  return (
   <div>
    Select somthing
   </div>
  );
};




