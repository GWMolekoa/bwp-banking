import React, { useState } from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

// Implement Date-Picker
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import DatePicker CSS for styling
import { format } from 'date-fns'

const formSchema = authFormSchema('sign-up');

interface CustomInput{
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string, 
    placeholder: string
}

const CustomInput = ({control, name, label, placeholder}: CustomInput) => {
    // Date Picker Feature
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // Show Password Feature
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to prevent non-numeric input
    const handleNumericInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    // Allow numeric characters, control keys (e.g., backspace, tab), and arrow keys
    if (!/^[0-9]$/.test(key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
        event.preventDefault(); // Prevent the input if it's not numeric
    }
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
                     {name === "dateOfBirth" ? (
                            // Render DatePicker for dateOfBirth
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    field.onChange(date ? format(date, 'yyyy-MM-dd') : ''); // Update field value
                                }}
                                dateFormat="yyyy-MM-dd"
                                className="input-class h-10 text-justify pl-2" // Ensure consistent styling
                                placeholderText={placeholder}
                                 // Set full width for the wrapper
                                showMonthDropdown // Enable month dropdown
                                showYearDropdown // Enable year dropdown
                                dropdownMode="select" // Year and month selection as dropdowns
                                minDate={new Date(1900, 0, 1)} // Set minimum date for year
                                maxDate={new Date()} // Set maximum date as today
                            />
                        ) : name === "state" ? (
                            // Render dropdown for State field
                            <select
                                {...field}
                                className="input-class h-10 text-justify pl-2"
                            >
                                <option value="">Select State</option>
                                <option value="NY">NY</option>
                                <option value="GA">GA</option>
                                <option value="FL">FL</option>
                                <option value="LA">LA</option>
                                <option value="TX">TX</option>
                            </select>
                        ) : (
                        
                        <div className="relative">
                            <Input
                            placeholder={placeholder}
                            className="input-class pr-10"
                            type={name === "password" && !showPassword ? "password" : "text"}
                            maxLength={
                                    name === "ssn" ? 4 : name === "postalCode" ? 5 : undefined
                                } 
                            // Set maxLength for ssn and postalCode
                            onKeyDown={
                                name === "ssn" || name === "postalCode"
                                    ? handleNumericInput
                                    : undefined
                            } // Apply numeric restriction for ssn and postalCode
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
                        )}
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
