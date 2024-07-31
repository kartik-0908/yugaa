import React, { } from "react";
import { menuItems } from "./memitems";
import Element from "./Card";

const MemberinboxSidebar = () => {
  return (
    <>
      <div className="no-scrollbar flex flex-col p-2 overflow-y-auto flex-grow min-w-[180px]">
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

export default MemberinboxSidebar;
