import { Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import getSignedUrl from "../../../actions/gcpservices";

export default function ({ id, name, shopDomain }: { id: string, name: string, shopDomain: string }) {

    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const url = await getSignedUrl(id, name, shopDomain)
        window.open(url, "_blank");
        setLoading(false);
    }

    if (loading) {
        return (
            <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
            </Button >
        )
    }
    else {
        return (
            <Button onClick={handleClick} variant={"outline"} className="text-cneter">Doc</Button>
        )
    }

}