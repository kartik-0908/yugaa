import React from "react";
import Element from "./Card";
import { menuItems } from "./items";

const Sidebar = () => {

  return (
    <>
      <nav className="flex-grow mt-5  align-items-center flex flex-col">
        <div>
          <ul className="mb-6 ml-1 flex flex-col gap-1.5 text-center">
            {menuItems.map((item, index) => (
              <li key={index} className="pb-8">
                <Element link={item.link} content={item.content}>
                  {item.svg}
                </Element>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
