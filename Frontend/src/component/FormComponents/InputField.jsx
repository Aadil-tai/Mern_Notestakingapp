// components/FormInput.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormInput = ({ name, type = 'text', placeholder, validation = {} }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, validation)}
                className={`w-full px-4 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
};

export default FormInput;
