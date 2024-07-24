"use client"
import { useState } from "react";
import { Button } from "../../../components/ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { fetchLinks, updateUrl } from "../../../actions/kb";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
const isValidUrl = (url: any) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};


export default function DescComponent() {
    const { user, isLoaded } = useUser();
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    const { data, isLoading } = useSWR({ shop: user?.publicMetadata.shopDomain, type: "links" }, fetchLinks, {
        refreshInterval: 1000
    });

    const [currFaq, setFaq] = useState('');
    const [currTnc, setTnc] = useState('');
    const [currPrivacy, setPrivacy] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ faq: '', tnc: '', privacy: '' });
    const validateInput = (value: any, field: any) => {
        if (value && !isValidUrl(value)) {
            setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL' }));
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleInputChange = (e: any, setter: any, field: any) => {
        const value = e.target.value;
        setter(value);
        validateInput(value, field);
    };

    const handleClick = async () => {
        if (Object.values(errors).some(error => error !== '')) {
            return; // Don't proceed if there are errors
        }

        setLoading(true);
        try {
            if (currFaq) {
                await updateUrl(currFaq, "faq", user?.publicMetadata.shopDomain as string);
                setFaq('');
            }
            if (currTnc) {
                await updateUrl(currTnc, "tnc", user?.publicMetadata.shopDomain as string);
                setTnc('');
            }
            if (currPrivacy) {
                await updateUrl(currPrivacy, "privacy", user?.publicMetadata.shopDomain as string);
                setPrivacy('');
            }
        } catch (error) {
            console.error("Error updating URLs:", error);
        } finally {
            setLoading(false);
        }
    };
    if (data === undefined || data === null) {
        return null;
    }
    return (
        <>
            <DialogHeader>
                <DialogTitle>Upload Links</DialogTitle>
                <DialogDescription>
                    <div className="font-bold mb-1"> FAQ URL</div>
                    <Input onChange={(e) => handleInputChange(e, setFaq, 'faq')} defaultValue={data.faq} disabled={data.faq ? true : false} type="url" id="faq" placeholder="Enter your URL" />
                    {errors.faq && <p className="text-red-500 text-sm mt-1">{errors.faq}</p>}
                    <div className="font-bold mb-1 mt-1"> TnC URL</div>
                    <Input onChange={(e) => handleInputChange(e, setTnc, 'tnc')} defaultValue={data.tnc} disabled={data.tnc ? true : false} type="url" id="tnc" placeholder="Enter your URL" />
                    {errors.tnc && <p className="text-red-500 text-sm mt-1">{errors.tnc}</p>}

                    <div className="font-bold mb-1 mt-1"> Privacy Policy URL</div>
                    <Input onChange={(e) => handleInputChange(e, setPrivacy, 'privacy')}
                        defaultValue={data.privacy} disabled={data.privacy ? true : false} type="url" id="privacy" placeholder="Enter your URL" />
                    {errors.privacy && <p className="text-red-500 text-sm mt-1">{errors.privacy}</p>}
                </DialogDescription>
            </DialogHeader >
            <DialogFooter>
                {loading ? <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button> : <Button onClick={handleClick} disabled={Object.values(errors).some(error => error !== '')}>Add</Button>}
            </DialogFooter>
        </>

    )
}