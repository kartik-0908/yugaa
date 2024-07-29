'use client'
import { NextUIProvider } from '@nextui-org/react'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { Toaster } from '../components/ui/toaster'


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <GeistProvider>
        {/* <CssBaseline /> */}
        <ClerkProvider>

          {children}
        </ClerkProvider>
        <Toaster />
      </GeistProvider>

    </NextUIProvider>
  )
}