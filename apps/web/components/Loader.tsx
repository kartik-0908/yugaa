import { Spinner } from "@nextui-org/react";

export default function NextLoader() {
    return (
        <div className='h-full w-full flex justify-center items-center'>
            <Spinner label="Loading..." color="warning" />
        </div>
    );
}