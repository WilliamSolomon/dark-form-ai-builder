import { Edit, Trash } from 'lucide-react'
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';


function FieldEdit({ defaultValue, onUpdate }) {
    const [label, setLabel] = useState(defaultValue?.label);
    const [placeholder, setPlaceholder] = useState(defaultValue.placeholder);


    return (
        <div className='flex gap-2'>

            <Popover>
                <PopoverTrigger>
                    <Edit className='h-4 w-5 text-gray-500' />
                </PopoverTrigger>
                <PopoverContent>
                    <h2>Edit Field</h2>
                    <div>
                        <label className='text-xs'>Label Name</label>
                        <Input type="text" defaultValue={defaultValue.label}
                            onChange={(event) => setLabel(event.target.value)}
                        />
                    </div>
                    <div>
                        <label className='text-xs'>Placeholder Name</label>
                        <Input type="text" defaultValue={defaultValue.placeholder}
                            onChange={(event) => setPlaceholder(event.target.value)}
                        />
                    </div>
                    <Button size='sm' className= "mt-3"
                    onClick = {() => onUpdate({
                        label: label,
                        placeholder: placeholder
                    })}
                    >Update</Button>
                </PopoverContent>
            </Popover>

            <Trash className='h-4 w-5 text-red-500' />




        </div>
    )
}

export default FieldEdit