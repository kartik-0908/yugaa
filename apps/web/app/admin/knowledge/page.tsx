import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import FileUploaderTest from "./doc-uploader"
import { Url } from "./url"

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            status: "pending",
            name: "pending",
            url: "m@example.com",
        },
        // ...
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="bg-white lg:ml-32 lg:mr-32 md:ml-16 md:mr-16  h-[100%]">
            <div className="w-full h-[20%] flex flex-row">
                <div className="w-1/2 p-4 lg:pr-32 lg:pl-32">
                    <FileUploaderTest />

                </div>
                <div className="w-1/2 p-4 lg:pr-32 lg:pl-32">
                    <Url />
                </div>

            </div>
            <div className="container mx-auto py-10">

                <DataTable columns={columns} data={data} />
            </div>
        </div>

    )
}
