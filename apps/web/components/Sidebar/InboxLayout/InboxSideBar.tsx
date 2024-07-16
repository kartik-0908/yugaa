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
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  const [isAutoAssignment, setIsAutoAssignment] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/autoAssignment`, {
        shopDomain: user?.publicMetadata.shopDomain || "",
      })
      console.log(res.data)
      const { isAutoAssignment } = res.data
      setIsAutoAssignment(isAutoAssignment)
    }
    fetchData()
  }, [])
  return (
      <div className="">
        <Accordion
          showDivider={false}
          className="p-2 flex flex-col max-w-[200px]"
          itemClasses={{
            base: "py-0 p-2",
            titleWrapper:"p-0",
            title: "font-normal text-medium ",
            trigger: "py-0 p-2 pr-4 rounded-lg flex items-center",
            indicator: "text-medium",
            content: "text-sm px-2",
          }}>
          <AccordionItem classNames={{
          }} key="1" aria-label="Accordion 1" title="Title ???">
            {menuItems.map((item, index) => (
              <li key={index} className="flex justify-start hover:bg-blue-200 hover:rounded-xl cursor-pointer">
                <Element link={item.link} content={item.content}>
                  {item.svg} {item.content}
                </Element>
              </li>
            ))}
          </AccordionItem>
          <AccordionItem className="overflow-x-hidden" key="2" aria-label="Accordion 2" title="Operator Restrictions">
            <RestrictOperator />
            <RestrictDuration />
            <Switch
              onValueChange={(key: boolean) => {
                axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/updateAutoAssignment`, {
                  shopDomain: user?.publicMetadata.shopDomain || "",
                  isAutoAssignment: key,
                })
                setIsAutoAssignment(key)
              }}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse ",
                  "justify-between ",
                ),
              }}
              size="sm"
              isSelected={isAutoAssignment}
            >
              <div
                className="text-black group relative flex items-center justify-center  rounded-md  "
              >
                Automatic Ticket Assignment
              </div>
            </Switch>
          </AccordionItem>
        </Accordion>
      </div >
  );
};

export default InboxSidebar;
