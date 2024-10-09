import React, { useState } from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import {Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'



const formSchema = authFormSchema('sign-up');

interface CustomInput{
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string, 
    placeholder: string
}

const CustomInput = ({control, name, label, placeholder}: CustomInput) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <div className='form-item'>
                <FormLabel className='form-label'>
                    {label}
                </FormLabel>
                <div className='flex w-full flex-col'>
                    <FormControl>
                        <div className="relative">
                            <Input
                            placeholder={placeholder}
                            className="input-class pr-10"
                            type={name === "password" && !showPassword ? "password" : "text"}
                            {...field}
                            />
                            {name === "password" && (
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-2"
                            >
                                {showPassword ? (
                                <EyeOffIcon className="w-5 h-5 text-gray-500" />
                                ) : (
                                <EyeIcon className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage
                        className='form-message mt-2'
                    />
                </div>
            </div>
        )}
    />
  )
}

export default CustomInput