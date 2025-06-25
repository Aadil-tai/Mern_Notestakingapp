import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../../utils/userAction';

const RegisterScreen = () => {
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, userInfo } = useSelector((state) => state.userRegister);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (userInfo) {
            toast.success("Registration successful! 🎉");
            navigate('/verify-account', { state: { userId: userInfo._id } });
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const onSubmit = (formData) => {
        if (formData.Password !== formData.ConfirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const data = new FormData();
        data.append("name", formData.Name);
        data.append("email", formData.Email);
        data.append("password", formData.Password);
        if (avatar) data.append("avatar", avatar);

        dispatch(registerUser(data));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500 ">
            <div className="bg-white  rounded-2xl shadow-lg max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">
                {/* Form Section */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-2">
                        <img src="https://flowbite.com/docs/images/logo.svg" alt="Logo" className="h-6" />
                        <h1 className="text-xl font-semibold text-gray-900">Quick Note</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">Create your Account</h2>
                    <p className="text-sm text-gray-500">
                        Start your website in seconds. Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">Login here.</Link>
                    </p>

                    {/* Upload Photo */}
                    <div className="">
                        <label
                            htmlFor="file_input"
                            className="block mb-2 text-sm font-medium "
                        >
                            Upload your picture
                        </label>
                        <input
                            id="file_input"
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm px-4 py-2 border border-gray-600 rounded-lg cursor-pointer  focus:outline-none focus:border-blue-500"
                            onChange={handleAvatarChange}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px).
                        </p>
                    </div>


                    {/* Form Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Bonnie Green"
                                {...register('Name', { required: 'Name is required' })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.Name && <p className="text-red-500 text-xs">{errors.Name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Your Email</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                {...register('Email', { required: 'Email is required' })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.Email && <p className="text-red-500 text-xs">{errors.Email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                {...register('Password', {
                                    required: 'Password is required',
                                    maxLength: { value: 15, message: 'Max 15 characters' },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.Password && <p className="text-red-500 text-xs">{errors.Password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                {...register('ConfirmPassword', {
                                    required: 'Confirm your password',
                                    validate: value => value === getValues('Password') || 'Passwords do not match',
                                })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.ConfirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.ConfirmPassword && <p className="text-red-500 text-xs">{errors.ConfirmPassword.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loading ? 'Registering...' : 'Create an account'}
                    </button>
                </form>

                {/* Illustration Section */}
                <div className="hidden md:flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                    <img src="/login.png" alt="Illustration" className="w-4/5" />
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;