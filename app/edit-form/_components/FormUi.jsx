import React, { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import FieldEdit from "./FieldEdit"
import { SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import { toast } from 'sonner'




function FormUi({ jsonForm, selectedTheme, selectedStyle,
    onFieldUpdate, deleteField, editable = true, formId = 0, enabledSignIn = false }) {
    const [formData, setFormData] = useState();
    let formRef = useRef();
    const { user, isSignedIn } = useUser();
    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     })
    // }

    // const handleSelectChange = (name, value) => {
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     })
    // }

    const onFormSubmit = async (event) => {
        event.preventDefault()
        console.log(formData);

        const result = await db.insert(userResponses)
            .values({
                jsonResponse: formData,
                createdAt: moment().format('DD/MM/yyy'),
                formRef: formId
            })

        if (result) {
            formRef.reset();
            toast('Response Submitted Successfully !')
        }
        else {
            toast('Error while saving your form !')

        }
    }




    return (
        <form
            ref={(event) => formRef = event}
            onSubmit={onFormSubmit}
            className='border p-5 md:w-[37.5rem] rounded-lg'
            data-theme={selectedTheme}
            style={{
                boxShadow: selectedStyle?.key == 'boxshadow' && '5px 5px 0px black',
                border: selectedStyle?.key == 'border' && selectedStyle.value
            }}
        >
            <h2 className='font-bold text-center text-2xl'>{jsonForm?.form_title}</h2>
            <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.form_subheading}</h2>
            {jsonForm?.fields.map((field, index) => (

                <div key={index} className='flex items-center gap-2' >
                    {field.field_type == 'select' ?
                        <div className="my-3 w-full">
                            <label className="text-sm text-gray-500">{field.label}</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options.map((item, index) => (
                                        <SelectItem key={index} value={item}>{item}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        : field.field_type == 'radio' ?
                            <div className="my-3 w-full">
                                <label className="text-sm text-gray-500">{field.label}</label>
                                <RadioGroup>
                                    {/* <RadioGroup defaultValue={option.label}> */}

                                    {field.options.map((item, index) => (

                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={item} id={item} />
                                            <Label htmlFor={item} > {item} </Label>
                                        </div>
                                    ))}


                                </RadioGroup>
                            </div>

                            : field.field_type == 'checkbox' ?

                                field.options ? (
                                    // Code to run if field.options is present
                                    <div className="my-3 w-full">
                                        <label className="text-sm text-gray-500 gap-2">{field.label}</label>
                                        {field.options.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className='flex gap-2 items-center'>
                                                    <Checkbox />
                                                    <h2>{item}</h2>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                                    : <div className="flex my-3 gap-2 w-full">
                                        <Checkbox className="gap-2" />
                                        <label className="text-sm text-gray-500 gap-2">{field.label}</label>
                                    </div>
                                : <div key={index} className="my-3 items-center w-full">
                                    <label htmlFor={field.name} className="text-sm text-gray-500">{field.label}</label>
                                    <Input
                                        type={field.field_type}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                    />
                                </div>
                    }
                    <div>
                        {editable && <div>
                            <FieldEdit defaultValue={field}
                                onUpdate={(value) => onFieldUpdate(value, index)}
                                deleteField={() => deleteField(index)}
                            />
                        </div>}
                    </div>
                </div>
            ))}
            {!enabledSignIn ?
                <button className='btn btn-primary'>Submit</button> :
                isSignedIn ?
                    <button className='btn btn-primary'>Submit</button> :
                    <Button>
                        <SignInButton mode='modal' >Sign In before Submit</SignInButton>
                    </Button>}

        </form >
    )
}

export default FormUi