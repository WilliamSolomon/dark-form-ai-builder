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

const testPrompt = `Description: provide a student registration form for a coding workshop on react and react native. On the basis of this description, please provide a form in JSON format format with a form title and form subheading. Include the following fields: 
form name, placeholder, name, and form label, fieldtype, field required. Again, in json format.`

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState();
    const {user}=useUser();

    const onCreateForm = async () => {
        console.log(userInput)
        setLoading(true)
        const result = await AIChatSession.sendMessage("Description:" + userInput + testPrompt);
        console.log(result.response.text());
        if (result.response.text()) 
        {
            const resp=await db.insert(JsonForms)
            .values({
                jsonform:result.response.text(),
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD/MM/YYYY')

            }).returning({id:JsonForms.id})
            console.log("New Form ID",resp[0].id)
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
                                    onClick={() => onCreateForm()}>Create</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm