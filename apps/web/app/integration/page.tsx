import axios from "axios";
import { redirect } from 'next/navigation'

export default async function Integration(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { shop } = props.searchParams;
  const { code } = props.searchParams;
  if (shop && code) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/shopify/access-token`, { shop, code });
    console.log(response);
    redirect('/');
  }
}
