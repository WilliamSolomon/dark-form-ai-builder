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


const guidingPrompt = `
    Based on this user's description(UserInput), generate a form in JSON format. The form should include a form_title and form_subheading. For each field, include the following properties: name, placeholder, label, field_type, and required. Ensure the response excludes anything except the JSON object, starting with { and ending with }. Example descriptions could include 'little league signup' or 'company job application'. Here is an example of the required format:

    {
        "form_title": "Star Fleet Academy Signup",
        "form_subheading": "Embark on a journey to the stars!",
        "fields": [
        {
            "name": "first_name",
            "placeholder": "Enter your first name",
            "label": "First Name",
            "field_type": "text",
            "required": true
        },
        {
            "name": "last_name",
            "placeholder": "Enter your last full name",
            "label": "Last Full Name",
            "field_type": "text",
            "required": true
        },
        {
            "name": "email",
            "placeholder": "Enter your email address",
            "label": "Email",
            "field_type": "email",
            "required": true
        },
        {
            "name": "phone_number",
            "placeholder": "Enter your phone number",
            "label": "Phone Number",
            "field_type": "tel",
            "required": true
        },
        {
            "name": "birthdate",
            "placeholder": "Enter your birthdate (YYYY-MM-DD)",
            "label": "Birthdate",
            "field_type": "date",
            "required": true
        },
        {
            "name": "preferred_species",
            "placeholder": "Select your preferred species",
            "label": "Preferred Species",
            "field_type": "checkbox",
            "options": [
            "Human",
            "Vulcan",
            "Andorian",
            "Tellarite",
            "Klingon"
            ],
            "required": true
        },
        {
            "name": "academic_interests",
            "placeholder": "Select your academic interests",
            "label": "Academic Interests",
            "field_type": "radio",
            "options": [
            "Astrophysics",
            "Xenobiology",
            "Tactical Warfare",
            "Engineering",
            "Medicine"
        ],
            "required": true
        },
        {
            "name": "emergency_contact_name",
            "placeholder": "Enter your emergency contact's name",
            "label": "Emergency Contact Name",
            "field_type": "text",
            "required": true
        },
        {
            "name": "emergency_contact_phone",
            "placeholder": "Enter your emergency contact's phone number",
            "label": "Emergency Contact Phone",
            "field_type": "tel",
            "required": true
        },
        {
            "name": "agree_to_terms",
            "label": "I agree to the Star Fleet Academy terms and conditions",
            "field_type": "checkbox",
            "required": true
        }
        ]
    }
    `

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState();
    const { user } = useUser();
    const route = useRouter();


    const onCreateForm = async () => {
        console.log(userInput)
        setLoading(true)
        const result = await AIChatSession.sendMessage("UserInput: " + userInput + guidingPrompt);
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
                                        <Loader2 className='animate-spin' /> : 'Create'
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