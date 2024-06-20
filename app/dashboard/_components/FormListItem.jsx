import { Button } from '@/components/ui/button'
import { Edit, Share, Trash } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { RWebShare } from 'react-web-share'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

function FormListItem({ jsonForm, recordId, refreshData }) {
    const { user } = useUser();

    const onDeleteForm = async () => {
        const result = await db.delete(JsonForms)
            .where(and(eq(JsonForms.id, recordId),
                eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
            ))

        if (result) {
            toast("Form Deleted");
            refreshData();
        }
    }


    return (
        <div className='border shadow-sm rounded-lg p-4'>
            <div className='flex justify-between'>
                <h2></h2>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Trash className='h-5 w-5 text-red-600
                        cursor-pointer hover:scale-105 transition-all'
                        />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Please confirm</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this form from your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteForm()}>
                                Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
            <h2 className='text-lg text-black'>{jsonForm.form_title}</h2>
            <h3 className='text-sm text-gray-500'>{jsonForm.form_subheading}</h3>
            <hr className='my-4'></hr>
            <div className='flex justify-between'>

                <RWebShare
                    data={{
                        text: jsonForm.form_subheading + " , Build your form in seconds with Dark Form AI",
                        url: baseURL + "ai-form/" + recordId,
                        title: jsonForm.form_title,
                    }}
                    onClick={() => console.log("shared successfully!")}
                >
                    <Button variant='outline' size='sm' className='flex gap-2' ><Share className='h-5 w-5' />Share</Button>
                </RWebShare>
                <Link href={'/edit-form/' + recordId}>
                    <Button size='sm' className='flex gap-2'><Edit className='h-5 w-5' />Edit</Button>
                </Link>
            </div>
        </div>
    )
}

export default FormListItem