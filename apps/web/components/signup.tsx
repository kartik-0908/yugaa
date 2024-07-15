"use client"
import { useFormState } from "react-dom"
import { handleSubmit } from "../../lib/actions"
import { useEffect } from "react"
import { showToast } from "./Toast"

export default function Customsignup() {
    const [state, formAction] = useFormState(handleSubmit, {
        status: '',
    })

    useEffect(() => {
        console.log(state)
        if (state?.status === "success") {
            showToast("success", <p>Go to your email Inbox</p>)
        }
        if (state?.status === "error") {
            showToast("error", <p>Some Technical Issues</p>)
        }
    }, [state])
    return (
        <div className="bg-black flex justify-center items-center min-h-screen py-12">
            <div className="bg-zinc-900 rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="grid w-full items-center gap-6">
                    <header className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" className="mx-auto size-10">
                            {/* SVG path content remains the same */}
                        </svg>
                        <h1 className="mt-4 text-xl font-medium tracking-tight text-white">Create an account</h1>
                    </header>
                    <form action={formAction}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Shopify Domain</label>
                                <div className="flex">
                                <input
                                        hidden
                                        name='role'
                                        defaultValue={"admin"}
                                    />
                                    <input
                                        required
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
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-md bg-neutral-800 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                                />
                            </div>
                            <button type="submit" className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-2  text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10">
                                Sign Up
                            </button>
                        </div>


                    </form>

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