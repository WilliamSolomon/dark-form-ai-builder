"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Header() {
    const { user, isSignedIn } = useUser();
    const path=usePathname();

    return !path.includes('ai-form') && (
        <nav className='p-5 border-b shadow-sm'>
            <div className='flex items-center justify-between'>
                <Image src={'/darkform-logo-icon.svg'} width={120} height={50} alt='logo' />
                {isSignedIn ?
                    <div className='flex items-center gap-5'>
                        <Link href={'/dashboard'}>
                            <Button variant='outline'>Dashboard</Button>
                        </Link>
                        <UserButton />
                    </div> :
                    <SignInButton>
                        <Button>Get Started</Button>
                    </SignInButton>
                }

            </div>
        </nav>
    )
}

export default Header