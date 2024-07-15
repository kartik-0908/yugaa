"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "./items";
import Element from "./Card";
import { Switch, cn } from "@nextui-org/react";
import RestrictOperator from "./RestrictOpeartor";
import RestrictDuration from "./RestrictDuration";

const InboxSidebar = () => {
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
            <p className="text-[#636E7B] font-bold text-xs mt-4 mb-2">
              Operator Restrictions
            </p>
            <RestrictOperator />
            <RestrictDuration />
            <Switch
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse ",
              ),
            }}
              size="sm"
              defaultSelected>
              <div
                className="group relative flex items-center justify-center p-2 gap-2.5 py-2  rounded-md font-medium "
              >
                Automatic Ticket Assignment
              </div>
            </Switch>

          </div>
        </nav>
      </div>
    </>
  );
};

export default InboxSidebar;
