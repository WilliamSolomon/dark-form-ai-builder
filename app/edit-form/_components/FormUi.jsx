import React, { useRef, useState } from 'react'
import { db } from '@/configs'
import { UserResponses } from '@/configs/schema'
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
    onFieldUpdate, deleteField, editable = true, formId = 0, requiredSignIn = false }) {
    const [formData, setFormData] = useState();
    let formRef = useRef();
    const { user, isSignedIn } = useUser();

    console.log("Initial jsonForm Data:", jsonForm);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        console.log("handleInputChange ", "event: ", event, "event.target: ", event.target, "name: ", name, "value: ", value);
        setFormData({
            ...formData,
            [name]: value
        })

        console.log("formData: ", formData);
    }

    const handleSelectChange = (name, value) => {

        console.log("handleSelectChange ", "name: ", name, "value: ", value);
        setFormData({
            ...formData,
            [name]: value
        })
        console.log("formData: ", formData);
    }

    const handleCheckBoxChange = (fieldName, item, value) => {

        // Change field name to lowercase to maintain consistency for column titles
        fieldName = fieldName.toLowerCase()
        const list = formData?.[fieldName] ? formData?.[fieldName] : [];


        console.log("handleCheckBoxChange ", "fieldName: ", fieldName, "item: ", item, "value: ", value, "List", list);

        if (value) {
            list.push({
                label: item,
                value: value
            })
            setFormData({
                ...formData,
                [fieldName]: list
            })
        }

        else {
            const result = list.filter((item) => item.label == item);
            setFormData({
                ...formData,
                [fieldName]: result
            })
        }

        console.log("formData: ", formData);
    }

    const onFormSubmit = async (event) => {
        event.preventDefault()

        if (formData) {
            const result = await db.insert(UserResponses)

                .values({
                    jsonResponse: formData,
                    createdAt: moment().format('DD/MM/YYYY'),
                    formRef: formId
                })

            if (result) {
                formRef.reset();
                toast('Response Submitted Successfully !')
            }
            else {
                toast('Error while saving your form !')

            }

        } else {
            console.log('No formData')
        }

    }






    return (
        <form
            ref={(event) => {
                formRef = event
            }}
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
                            <Select required={field?.required} onValueChange={(value) => handleSelectChange(field.name, value)}>
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
                                <RadioGroup required={field?.required}>
                                    {/* <RadioGroup defaultValue={option.label}> */}

                                    {field.options.map((item, index) => (

                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={item} id={item}
                                                onClick={() => handleSelectChange(field.name, item)}
                                            />
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
                                                    <Checkbox
                                                        // required={field?.required}
                                                        onCheckedChange={(value) => handleCheckBoxChange(field.label, item, value)}
                                                    />
                                                    {console.log("Checkbox, field name", field.label)}
                                                    <h2>{item}</h2>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                                    : <div className="flex my-3 gap-2 w-full">
                                        <Checkbox className="gap-2" required={field?.required} />
                                        <label className="text-sm text-gray-500 gap-2">{field.label}</label>
                                    </div>
                                : <div key={index} className="my-3 items-center w-full">
                                    <label htmlFor={field.name} className="text-sm text-gray-500">{field.label}</label>
                                    <Input
                                        type={field.field_type}
                                        id={field.name}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        required={field?.required}
                                        className="bg-transparent"
                                        onChange={(event) => handleInputChange(event)}
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
            {!requiredSignIn ?
                <button className='btn btn-primary'>Submit</button> :
                isSignedIn ?
                    <button type='submit' className='btn btn-primary'>Submit</button> :
                    <Button>
                        <SignInButton mode='modal' >Sign In before Submit</SignInButton>
                    </Button>}

        </form >
    )
}

export default FormUi

