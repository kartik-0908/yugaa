'use client'

import { Button } from '@nextui-org/react'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
    const { pending } = useFormStatus()


    return (
        <Button type="submit" isLoading={pending}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
            Submit
        </Button>
    )
}