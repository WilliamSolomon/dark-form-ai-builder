import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
    return (
        <nav className='p-5 border-b shadow-sm'>
            <div className='flex items-center justify-between'>
                <Image src={'/zapdoc-logo.svg'} width={120} height={50} alt='logo' />
                <Button>Get Started</Button>
            </div>
        </nav>
    )
}

export default Header