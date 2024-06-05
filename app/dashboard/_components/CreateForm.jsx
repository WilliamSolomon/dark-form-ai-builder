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



function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState();

    const onCreateForm = () => {
        console.log(userInput)
    }

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            <Textarea className="my-2"
                                onChange={(event) => setUserInput(event.target.value)}
                                placeholder="Write a description of your form" />
                            <div className='flex gap-2 my-3 justify-end'>
                                <Button variant="destructive"
                                    onClick={() => setOpenDialog(false)}
                                >Cancel</Button>
                                <Button onClick={() => onCreateForm()}>Create</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm