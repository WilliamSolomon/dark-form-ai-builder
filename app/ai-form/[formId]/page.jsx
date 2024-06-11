"use client"
import FormUi from '@/app/edit-form/_components/FormUi'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

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

                console.log("GetFormData", result);

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
        <div className='p-10 flex justify-center'
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
                />
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin" size={32} />
                </div>
            )}
        </div>
    )
}

export default LiveAiForm