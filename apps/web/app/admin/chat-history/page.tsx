export default async function Chat({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    page?: string;
  };
}) {
  const filter = searchParams?.filter || 'all';
  const currentPage = Number(searchParams?.page) || 1;

  return (
   <div>
    Select somthing
   </div>
  );
};




