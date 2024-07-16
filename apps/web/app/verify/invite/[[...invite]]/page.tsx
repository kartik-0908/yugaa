import axios from "axios";
import { Adminform } from "../../../../components/admin-signup";

export default async function Verify(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const { admin } = props.searchParams;
    const { member } = props.searchParams;
   
    if (admin) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/verify`, {
            code: admin
        })
        const { shopDomain } = res.data;
        console.log(shopDomain)
        if (shopDomain) {
            return (
                <Adminform  shopDomain={shopDomain} role={"admin"} />
            )
        }
    }
    else if (member) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/member/verify`, {
            code: admin
        })
        const { shopDomain } = res.data;
        console.log(shopDomain)
        if (shopDomain) {
            return (
                <Adminform shopDomain={shopDomain} role={"member"} />
            )
        }
    }
}

