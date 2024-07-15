'use client'
import { showToast } from "./Toast"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { handleSubmit } from "../../lib/actions"


export function Inviteform({ shopDomain, callback }: any) {
    const [state, formAction] = useFormState(handleSubmit, {
        status: '',
    })
    console.log(shopDomain)

    useEffect(() => {
        console.log(state)
        if (state?.status === "success") {
            showToast("success", <p>Invitation sent</p>)
        }
        if (state?.status === "error") {
            showToast("error", <p>Some Technical Issues</p>)
        }
    }, [state])

    return (
            <div className=" w-full max-w-md">
                <div className="grid w-full items-center gap-6">
                    <header className="text-center">
                        <h1 className="mt-4 text-xl font-medium tracking-tight text-black">Invite Member</h1>
                    </header>
                    <form action={formAction}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black">Select Role</label>
                                <div className="flex">
                                    <select
                                        name='role'
                                        required
                                        className="w-full rounded-md  px-3.5 py-2 text-sm text-black outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                                    >
                                        <option 
                                        // key="admin"
                                        >Admin</option>
                                        <option 
                                        // key="member"
                                        >Member</option>
                                    </select>
                                   
                                </div>
                            </div>
                            <div className="space-y-2">
                                <input
                                        hidden
                                        name='shopDomain'
                                        type="text"
                                        value={shopDomain}
                                        // placeholder="Enter your shopify domain"
                                        className="w-full rounded-l-md  px-3.5 py-2 text-sm text-black outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                                    />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-black">Email address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-md px-3.5 py-2 text-sm text-black outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                                />
                            </div>
                            <button type="submit" className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-2  text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10">
                                Send Invite
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    )
}