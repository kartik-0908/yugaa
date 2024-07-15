import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InstallationCard from "@/components/Chat/installationCard";
import { auth } from "@clerk/nextjs/server";
const Settings = () => {
    const { sessionClaims } = auth()
    return (
        <div className="mx-auto max-w-270">
            <Breadcrumb pageName="Installation" />
            <div className="grid grid-cols-5 gap-8">
                <InstallationCard shopDomain={sessionClaims?.metadata.shopDomain}/>
            </div>
        </div>
    );
};
export default Settings;
