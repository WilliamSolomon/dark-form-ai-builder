import React from 'react'
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




function FormUi({ jsonForm }) {
    console.log("jsonForm data:", jsonForm.fields);

    return (
        <div className='border p-5 md:w-[37.5rem] rounded-lg'>
            <h2 className='font-bold text-center text-2xl'>{jsonForm?.form_title}</h2>
            <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.form_subheading}</h2>

            {jsonForm?.fields.map((field, index) => (

                <div key={index} >
                    {field.field_type == 'select' ?
                        <div className="my-3">
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
                            <div className="my-3">
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
                                    <div className="my-3">
                                        <label className="text-sm text-gray-500 gap-2">{field.label}</label>
                                        {field.options.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className='flex gap-2 items-center'>
                                                    <Checkbox />
                                                    <h2>{item}</h2>
                                                    {console.log("Checkbox", item)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                                    : <div className="flex my-3 gap-2">
                                        <Checkbox className="gap-2" />
                                        <label className="text-sm text-gray-500 gap-2">{field.label}</label>
                                    </div>


                                : <div key={index} className="my-3 items-center">
                                    <label htmlFor={field.name} className="text-sm text-gray-500">{field.label}</label>
                                    <Input
                                        type={field.field_type}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                    />
                                </div>
                    }
                </div>
            ))
            }
        </div >
    )
}

export default FormUi