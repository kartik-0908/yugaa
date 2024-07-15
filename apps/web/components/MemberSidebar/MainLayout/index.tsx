"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import Element from "./Card";
import { menuItems } from "./items";

const MemberSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="no-scrollbar flex flex-col p-2  overflow-y-auto flex-grow">
        <nav className="mt-5">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Element link={item.link} content={item.content}>
                    {item.svg}
                  </Element>
                </li>
              ))}
            </ul>
          </div>
        </nav>

      </div>
      <div className="my-auto px-4 py-4">
        <ul>
          <li>
            {/* <Link
              href="/upgrade"
              className={`flex items-center text-2xl font-bold justify-center  gap-2.5 rounded-sm py-2  py-2 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("upgrade") && "bg-graydark dark:bg-meta-4"
                }`}
            >
              Up
            </Link> */}
          </li>
        </ul>
      </div>
      </>
  );
};

export default MemberSidebar;
