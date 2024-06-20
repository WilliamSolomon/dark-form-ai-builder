"use client"
import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs';
import { desc, eq } from 'drizzle-orm';

import * as Progress from '@radix-ui/react-progress';
import Link from 'next/link';

function SideNav() {
    const { user } = useUser();
    const [formCount, setFormCount] = useState([]);
    const [formCountPerc, setFormCountPerc] = useState(0);

    const menuList = [
        {
            id: 1,
            name: 'My Forms',
            icon: LibraryBig,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Responses',
            icon: MessageSquare,
            path: '/dashboard/responses'
        },
        // {
        //     id: 3,
        //     name: 'Analytics',
        //     icon: LineChart,
        //     path: '/dashboard/analytics'
        // },
        {
            id: 4,
            name: 'Upgrade',
            icon: Shield,
            path: '/dashboard/upgrade'
        },
    ]

    const path = usePathname();
    useEffect(() => {
        //console.log(path)
    }, [path])

    useEffect(() => {
        user && GetFormList();
    }, [user])

    const GetFormList = async () => {
        try {
            const result = await db.select()
                .from(JsonForms)
                .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(JsonForms.id));
        
                setFormCount(result.length)

                const progPerc = (result.length/3) * 100
                setFormCountPerc(progPerc)


        } catch (error) {
            console.error("Error fetching form list:", error);
        }
    }

    return (
        <div className='h-screen shadow-md border'>
            <div className='p-5'>
                {menuList.map((menu, index) => (
                    <Link href={menu.path} key={index} className={`flex items-center gap-3 p-4 mb-3
                        hover:bg-primary hover:text-white rounded-lg
                        cursor-pointer text-gray-500
                        ${path == menu.path && 'bg-primary text-white'}
                    `}>
                        <menu.icon />
                        {menu.name}
                    </Link>

                ))}
            </div>
            <div className='fixed bottom-7 p-6 w-64'>
                <Button className='w-full'>+ Create Form</Button>
                <div className='my-7'>
                    <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full h-4">
                        <Progress.Indicator
                            className="bg-primary h-full flex-1 transition-all"
                            style={{ transform: `translateX(-${100 - (formCountPerc || 0)}%)` }}
                        />
                    </Progress.Root>

                    <h2 className='text-sm mt-2 text-gray-600'><strong>{formCount}</strong> out of <strong>3</strong> files created</h2>
                    <h2 className='text-xs mt-3 text-gray-600'>Upgrade your plan for <strong>unlimited</strong> Dark Forms!</h2>
                </div>
            </div>
        </div>
    )
}

export default SideNav