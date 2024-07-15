"use client"

//Dont covert this into server component
import React, { useEffect, useState } from "react";
import { menuItems } from "./items";
import Element from "./Card";
import { Accordion, AccordionItem, Switch, cn } from "@nextui-org/react";
import RestrictOperator from "./RestrictOpeartor";
import RestrictDuration from "./RestrictDuration";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const InboxSidebar = () => {
  const { user, isLoaded } = useUser()
  if(!isLoaded){
    return <div>Loading...</div>
  }
  const [isAutoAssignment, setIsAutoAssignment] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/autoAssignment`, {
        shopDomain: user?.publicMetadata.shopDomain || "",
      })
      console.log(res.data)
      const {isAutoAssignment} = res.data
      setIsAutoAssignment(isAutoAssignment)
    }
    fetchData()
  }, [])
  return (
    <>
      <div className="no-scrollbar flex flex-col p-2 pl-0 pr-1 overflow-y-auto flex-grow">
        <Accordion itemClasses={{
          title: "font-normal text-medium",
          content: "text-sm overflow-x-hidden",
        }}>
          <AccordionItem key="1" aria-label="Accordion 1" title="Title ???">
            <ul className="flex flex-col gap-1">
              {menuItems.map((item, index) => (
                <li key={index} className="flex justify-start">
                  <Element link={item.link} content={item.content}>
                    {item.svg} {item.content}
                  </Element>
                </li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem className="overflow-x-hidden" key="2" aria-label="Accordion 2" title="Operator Restrictions">
            <RestrictOperator />
            <RestrictDuration />
            <Switch
            onValueChange={(key: boolean)=>{
              axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/updateAutoAssignment`, {
                shopDomain: user?.publicMetadata.shopDomain || "",
                isAutoAssignment: key,
              })
              setIsAutoAssignment(key)
            }}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full items-center text-white",
                  "justify-between cursor-pointer ",
                ),
              }}
              size="sm"
              isSelected={isAutoAssignment}
            >
              <div
                className="text-[#64748b] text-sm group relative flex items-center justify-center p-1 gap-2.5 py-2  rounded-md  "
              >
                Automatic Ticket Assignment
              </div>
            </Switch>

          </AccordionItem>
        </Accordion>
      </div >
    </>
  );
};

export default InboxSidebar;
