import { auth } from "@clerk/nextjs/server";
import InstallationCard from "../../../components/Chat/installationCard";
const Settings = () => {
    const { sessionClaims } = auth()
    return (
        <div className="mx-auto p-32 pt-8">
            <div className="grid grid-cols-5 gap-8">
                <InstallationCard shopDomain={sessionClaims?.metadata.shopDomain}/>
            </div>
        </div>
    );
};
export default Settings;
