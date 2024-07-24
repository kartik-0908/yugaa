import { auth } from "@clerk/nextjs/server";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import fetchLinks from "../../../actions/kb";

export const Url = async () => {
    const { sessionClaims } = auth();

    const kb = await fetchLinks(sessionClaims?.metadata.shopDomain as string);
    let faq,tnc,privacy;
    if (kb) {
        const { urls } = kb;
        urls.map((url) => {
            if (url.urlType === "faq") {
                faq = url.url;
            }
            if (url.urlType === "tnc") {
                tnc = url.url;
            }
            if (url.urlType === "privacy") {
                privacy = url.url;
            }
        })
        return (
            <Dialog >
                <DialogTrigger className="w-full">
                    <div className="p-2">
                        <div className="outline-dashed outline-1 outline-black/20 w-full rounded-lg relative w-full">
                            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                <svg
                                    className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span>
                                    &nbsp; the links
                                </p>
                                <p className="text-xs text-white ">
                                    PDF, TXT only
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Links</DialogTitle>
                        <DialogDescription>
                            <Label className="mt-2" htmlFor="url">FAQ URL</Label>
                            <Input defaultValue={faq} disabled={faq ? true : false} type="url" id="faq" placeholder="Enter your URL" />
                            <Label className="mt-2" htmlFor="url">TnC URL</Label>
                            <Input defaultChecked={tnc} disabled={tnc ? true : false} type="url" id="tnc" placeholder="Enter your URL" />
                            <Label className="mt-2" htmlFor="email">Privacy Policy URL</Label>
                            <Input defaultChecked={privacy} disabled={privacy ? true : false} type="url" id="privacy" placeholder="Enter your URL" />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
};
