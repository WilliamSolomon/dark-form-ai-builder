"use client"
import React, { useEffect, useState } from 'react'
import { JsonForms, UserResponses } from '@/configs/schema';
import { db } from '@/configs';
import { count, desc, eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import ResponseListItem from './_components/ResponseListItem'

function Responses() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        user && GetFormList();
    }, [user])

    const GetFormList = async () => {
        try {
            const result = await db.select({
                // Select all columns from JsonForms
                ...JsonForms,
                // Calculate count of associated userResponses
                userResponseCount: count(UserResponses.id),
            })
                .from(JsonForms)
                // Join with UserResponses table using formRef
                .leftJoin(UserResponses, eq(JsonForms.id, UserResponses.formRef))
                .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
                // Group by JsonForms.id to ensure correct counts for each form
                .groupBy(JsonForms.id)
                .orderBy(desc(JsonForms.id));

            // Parse jsonform field in each object
            const parsedResult = result.map(item => ({
                ...item,
                jsonform: JSON.parse(item.jsonform) // Parse jsonform field
            }));

            setFormList(parsedResult);
            console.log(parsedResult);

        } catch (error) {
            console.error("Error fetching form list:", error);
        }
    }

    return (
        <div className='p-10' style={{ minHeight: `calc(100vh - 110.414px)` }}
        //min-h-screen' // Property is not taking into account the Header height
        >
            <h2 className='font-bold text-3xl flex items-center justify-between my-5'>Responses</h2>

            <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
                {formList.map((form, index) => (
                    <div key={index}>
                        <h2 className='text-lg text-black'>{form.form_title}</h2>
                        <h3 className='text-sm text-gray-500'>{form.form_subheading}</h3>
                        <ResponseListItem
                            jsonForm={form.jsonform}
                            formId={form.id}
                            responseCount={form.userResponseCount}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Responses