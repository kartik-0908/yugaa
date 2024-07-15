"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar/MainLayout";
import Header from "@/components/Header";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <div className=" min-h-screen z-10">
        <div className="fixed top-0 left-0 w-full z-9999">
          <Header />
        </div>
        <div className="flex flex-1 pt-[80px] ">
          <aside
            className={`text-black fixed h-[91%] flex w-[6%] max-w-16 z-10 flex-col overflow-y-hidden border-r-[#d3d3d3] border-r-[1px] }`}
          >
            <Sidebar />
          </aside>
          <div className="ml-[4%] w-[100%] p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
