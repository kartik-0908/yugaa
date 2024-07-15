import { redirect } from "next/navigation";
import { Metadata } from "next";
export const metadata: Metadata = {
  title:
    "Yugaa",
  description: "Modern way to interact with your customers",
};
export default async function Home(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { shop } = props.searchParams;
  if (shop) {
    const clientId = process.env.NEXT_PUBLIC_clientId;
    const scopes = process.env.NEXT_PUBLIC_scopes;
    const redirectUri = process.env.NEXT_PUBLIC_redirectUri;
    const shopifyAuthUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
    // console.log(shopifyAuthUrl)
    redirect(shopifyAuthUrl);
  }
}
