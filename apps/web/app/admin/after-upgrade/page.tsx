"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";



const Upgrade = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/upgrade");
    }, 5000);

    return () => clearTimeout(timer);
  }, [])


  return <Loader />;

};

export default Upgrade;
