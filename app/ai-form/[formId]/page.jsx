"use client"
import FormUi from '@/app/edit-form/_components/FormUi'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { badgeVariants } from "@/components/ui/badge"


function LiveAiForm({ params }) {
    const [record, setRecord] = useState();
    const [jsonForm, setJsonForm] = useState([]);

    useEffect(() => {
        params && GetFormData();
    }, [params])

    const GetFormData = async () => {
        try {
            const result = await db.select().from(JsonForms)
                .where(eq(JsonForms.id, params?.formId),
                    // eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)

                );

            // setRecord(result[0])
            // setJsonForm(JSON.parse(result[0].jsonform))
            // setSelectedBackground(result[0].background)
            // setSelectedTheme(result[0].theme)
            // setSelectedStyle(JSON.parse(result[0].style))

            if (result && result.length > 0) {

                setRecord(result[0]);
                setJsonForm(JSON.parse(result[0].jsonform))

                // const parsedForm = JSON.parse(result[0].jsonform);
                // setJsonForm(parsedForm);
        
            } else {
                console.log("No form data found");
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
        //finally {
        //     setLoading(false);
        // }
    }


    return (
        <div className='p-10 flex justify-center items-center min-h-screen'
            style={{ backgroundImage: record?.background }}
        >
            {record && jsonForm.fields ? (
                <FormUi
                    jsonForm={jsonForm}
                    selectedTheme={record?.theme}
                    selectedStyle={JSON.parse(record?.style)}
                    onFieldUpdate={() => console.log}
                    deleteField={() => console.log}
                    editable={false}
                    formId={record.id}
                    requiredSignIn={record?.requireSignIn}
                />
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin" size={32} />
                </div>
            )}
            <Link className={`flex gap-2 items-center
            px-3 py-1 rounded-full
            fixed bottom-5 left-5 cursor-pointer 
            ${badgeVariants({ variant: "secondary" })}`}


                href={'/'}
            >
                <Image src={'/zapdoc-logo-icon.svg'} width={16} height={16} />
                Build a custom form with AI
            </Link>
        </div>
    )
}

export default LiveAiForm