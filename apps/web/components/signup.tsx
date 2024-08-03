"use client"
import { useState } from "react"
import { useToasts } from "@geist-ui/core"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import axios from "axios"

export default function Customsignup() {
    const { setToast } = useToasts()
    const [shopDomain, setShopDomain] = useState("")
    const [email, setEmail] = useState("")

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!shopDomain || !email) {
            setToast({
                text: "Please fill all the fields",
                type: "error"
            })
            return
        }
        setLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/invite`, {
                shop: shopDomain,
                email,
                role: "admin"
            })
            setToast({
                text: "Check your email for invite link",
                type: "success"
            })
        } catch (error) {
            setToast({
                text: "Something went wrong",
                type: "error"
            })
        }
        setLoading(false)

    }


    return (
        <div className="bg-black flex justify-center items-center min-h-screen py-12">
            <div className="bg-zinc-900 rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="grid w-full items-center gap-6">
                    <header className="text-center">
                        <h1 className="mt-4 text-xl font-medium tracking-tight text-white">Create an account</h1>
                    </header>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Shopify Domain</label>
                            <div className="flex">
                                <input
                                    onChange={(e) => setShopDomain(e.target.value)}
                                    name='shopDomain'
                                    type="text"
                                    placeholder="Enter your shopify domain"
                                    className="w-full rounded-l-md bg-neutral-800 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                                />
                                <div className="w-full rounded-r-md bg-neutral-800 px-3.5 py-2 text-sm border-[1.5px] text-white border-l-0 outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400">
                                    .myshopify.com
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Email address</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-md bg-neutral-800 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                            />
                        </div>
                        {loading ? (
                            <Button className="w-full" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}
                                className="w-full"
                            // className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-2  text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                            >
                                Sign up
                            </Button>
                        )}
                        {/* <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            <Button onClick={() => setLoading(true)} type="submit" className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-2  text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10">
                                Sign Up
                            </Button> */}
                    </div>
                    <p className="text-center text-sm text-zinc-400">
                        Have an account?{' '}
                        <a
                            href="/sign-in"
                            className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div >
    )
}