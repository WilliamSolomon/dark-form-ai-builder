import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { db } from '@/configs';
import { UserResponses } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

function ResponseListItem( {jsonForm,formId,responseCount} ) {
    const [loading, setLoading] = useState(false)

    const getFormResponseCount = async () => {
        try {
            let parsedResponseData = []
            setLoading(true)
            const result = await db.select().from(UserResponses)
                .where(eq(UserResponses.formRef, formId))

            if (result) {
                setLoading(false);
                result.forEach((item) => {
                    const jsonItem = JSON.parse(item.jsonResponse) // Parse jsonform field
                    parsedResponseData.push(jsonItem)
                })
                handleExportToExcel(parsedResponseData)
            }
        } catch (error) {
            console.error("Error Exporting Data:", error);
        }

    }

    const handleExportData = async () => {
        try {
            let parsedResponseData = []
            setLoading(true)
            const result = await db.select().from(UserResponses)
                .where(eq(UserResponses.formRef, formId))

                console.log('Export data parse', result);

            if (result) {
                setLoading(false);
                result.forEach((item) => {
                    const jsonItem = JSON.parse(item.jsonResponse) // Parse jsonform field
                    parsedResponseData.push(jsonItem)
                })
                handleExportToExcel(parsedResponseData)
            }
        } catch (error) {
            console.error("Error Exporting Data:", error);
        }

    }

    // Converts JSON response data to Excel and allows for Download
    const handleExportToExcel = (jsonData) => {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, jsonForm.form_title+".xlsx");
    }

    return (
        <div className='border shadow-sm rounded-lg p-4'>

            <h2 className='text-lg text-black'>{jsonForm.form_title}</h2>
            <h3 className='text-sm text-gray-500'>{jsonForm.form_subheading}</h3>
            <hr className='my-4'></hr>
            <div className='flex justify-between items-center'>
                <h2><strong>{responseCount}</strong> Responses</h2>
                <Button className='text-sm' size='sm'
                    onClick={() => handleExportData()}
                    disabled={loading || !responseCount }
                >
                    {loading ? <Loader2 className='animate-spin' /> : 'Export'}
                </Button>
            </div>
        </div>
    )
}

export default ResponseListItem