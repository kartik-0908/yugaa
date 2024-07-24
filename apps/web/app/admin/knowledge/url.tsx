import { Dialog, DialogContent, DialogTrigger } from "../../../components/ui/dialog";
import DescComponent from "./urldescription";

export const Url = async () => {
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
                <DescComponent />
            </DialogContent>
        </Dialog>
    );
}