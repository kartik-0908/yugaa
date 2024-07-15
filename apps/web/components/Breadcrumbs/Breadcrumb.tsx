"use client"
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

interface BreadcrumbProps {
  pageName: string[];
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <Breadcrumbs size="lg">
      {pageName.map((item, index) => (
        <BreadcrumbItem href={item} key={index}>
          {item}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
