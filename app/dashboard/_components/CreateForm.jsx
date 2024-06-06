"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AIChatSession } from '@/configs/aiModel'
import { useUser } from '@clerk/nextjs'
import { JsonForms } from '@/configs/schema'
import { db } from '@/configs/index'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'


const testPrompt = "Based on the information above, create provide a form in JSON format. It should include a form_Title and form_Subheading. Include the following properties for each field: name, placeholder, label, field_type, required. The response object's. The response should exclude anything except the JSON object, starting with { and ending with }"

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState();
    const { user } = useUser();
    const route = useRouter();


    const onCreateForm = async () => {
        console.log(userInput)
        setLoading(true)
        const result = await AIChatSession.sendMessage("Description:" + userInput + testPrompt);
        console.log("result.response.text()", result.response.text());
        if (result.response.text()) {
            const resp = await db.insert(JsonForms)
                .values({
                    jsonform: result.response.text(),
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD/MM/YYYY')

                }).returning({ id: JsonForms.id })
            console.log("New Form ID", resp[0].id)
            if (resp[0].id) {
                route.push('/edit-form/' + resp[0].id)
            }
            setLoading(false)
        }
        setLoading(false)
    }

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            <Textarea className="my-2" disabled={loading}
                                onChange={(event) => setUserInput(event.target.value)}
                                placeholder="Write a description of your form" />
                            <div className='flex gap-2 my-3 justify-end'>
                                <Button variant="destructive"
                                    onClick={() => setOpenDialog(false)}
                                >Cancel</Button>
                                <Button
                                    disabled={loading}
                                    onClick={() => onCreateForm()}>
                                    {loading ?
                                        <Loader2 className='animate-spin'/> : 'Create'
                                    }
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm