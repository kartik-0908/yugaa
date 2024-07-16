'use client'
import { NextUIProvider } from '@nextui-org/react'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { GeistProvider, CssBaseline } from '@geist-ui/core'


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <GeistProvider>
        <CssBaseline />
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </GeistProvider>

    </NextUIProvider>
  )
}