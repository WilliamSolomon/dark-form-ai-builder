"use client"
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import FormListItem from './FormListItem'
import { db } from '@/configs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        user && GetFormList();
    }, [user])

    const GetFormList = async () => {
        try {
            const result = await db.select()
                .from(JsonForms)
                .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(JsonForms.id));
    
            // Parse jsonform field in each object
            const parsedResult = result.map(item => ({
                ...item,
                jsonform: JSON.parse(item.jsonform) // Parse jsonform field
            }));
    
            setFormList(parsedResult);
        } catch (error) {
            console.error("Error fetching form list:", error);
        }
    }

    return (
        <div className='mt-5 grid grid-cols-2 md:grid-cols-4 gap-5'>
            {formList.map((form, index) => (
                <div key={index}>
                    <FormListItem 
                    jsonForm={form.jsonform} 
                    recordId={form?.id}
                    refreshData={GetFormList}
                    />
                </div>
            ))}
        </div>
    )
}

export default FormList
