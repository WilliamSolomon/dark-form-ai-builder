import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Themes from '../../_data/Themes'
import GradientBg from '../../_data/GradientBg'
import { Button } from '@/components/ui/button'
import Styles from '../../_data/Styles'
import { Checkbox } from '@/components/ui/checkbox'

function Controller({ selectedTheme, selectedBackground, currentTheme, selectedStyle, setSignInEnabled }) {
    const [indexLimit, setIndexLimit] = useState(6)
    // const [selectedOption, setSelectedOption] = useState(selectedTheme)

    // Calculate the nearest multiple of indexLimit that is less than the length of GradientBg
    const nearestMultiple = (Math.floor(GradientBg.length / 6) * 6) + 1;

    const clickHandlerShowMore = () => {
        setIndexLimit(indexLimit + 6);
    };

    const clickHandlerShowLess = () => {
        setIndexLimit(indexLimit - 6);
    };

    return (
        <section>
            {/* Theme selection controller */}
            <h2 className='my-1'>Theme</h2>
            <Select onValueChange={(themeValue) => selectedTheme(themeValue)} {...(currentTheme ? { value: currentTheme } : {})}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {Themes.map((theme, index) => (
                        <SelectItem value={theme.theme} key={index}>

                            <div className='flex gap-3'>
                                <div className='flex'>
                                    <div className='h-5 w-5 rounded-l-md'
                                        style={{ backgroundColor: theme.primary }}
                                    ></div>
                                    <div className='h-5 w-5'
                                        style={{ backgroundColor: theme.secondary }}
                                    ></div>
                                    <div className='h-5 w-5'
                                        style={{ backgroundColor: theme.accent }}
                                    ></div>
                                    <div className='h-5 w-5 rounded-r-md'
                                        style={{ backgroundColor: theme.neutral }}
                                    ></div>
                                </div>
                                {theme.theme}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Background selection controller */}
            <h2 className='mt-8 my-1'>Background</h2>
            <div className='grid grid-cols-3 gap-5'>
                {GradientBg.map((bg, index) =>
                    (index < indexLimit) && (
                        <div key={index}
                            onClick={() => selectedBackground(bg.gradient)}
                            className='w-full h-[4.5rem] rounded-lg
                                hover:border-2 hover:border-black
                                flex items-center justify-center cursor-pointer'
                            style={{ background: bg.gradient }}
                        >
                            {index === 0 && 'None'}
                        </div>
                    ))}
            </div>
            {GradientBg.length > 6 && (
                <div className="w-full my-3 flex justify-center">
                    {indexLimit > 6 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mx-1"
                            onClick={clickHandlerShowLess}
                        >
                            Show Less
                        </Button>
                    )}
                    {/* Hide the Show More button when indexLimit reaches the nearest multiple */}
                    {indexLimit < nearestMultiple && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mx-1"
                            onClick={clickHandlerShowMore}
                        >
                            Show More
                        </Button>
                    )}
                </div>


            )}

            {/* Style Selection Controller  */}
            <div>
                <label>Style</label>
                <div className='grid grid-cols-3  gap-3'>
                    {Styles.map((item, index) => (
                        <div key={index}>
                            <div className='cursor-pointer hover:border-2 rounded-lg' onClick={() => selectedStyle(item)}>
                                <img src={item.img} width={600} height={80} className='rounded-lg' />

                            </div>
                            <h2 className='text-center'>{item.name}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex gap-2 my-4 items-center mt-10'>
                <Checkbox
                    onCheckedChange={(event) => setSignInEnabled(event)}
                /> <h2>Require Social Authentication(Facebook/Google) before submitting the form</h2>
            </div>


        </section>
    )
}

export default Controller
