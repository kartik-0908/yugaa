"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "./items";
import Element from "./Card";
import { Switch, cn } from "@nextui-org/react";
import RestrictOperator from "./RestrictOpeartor";
import RestrictDuration from "./RestrictDuration";

const ChatSidebar = () => {
  const pathname = usePathname();


  return (
    <>
      <div className="no-scrollbar flex flex-col p-2 overflow-y-auto flex-grow">
        <nav className="mt-5">
          <div>
            <ul className="flex flex-col gap-1.5">
              {menuItems.map((item, index) => (
                <li key={index} className="flex justify-start">
                  <Element link={item.link} content={item.content}>
                    {item.svg} {item.content}
                  </Element>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default ChatSidebar;
