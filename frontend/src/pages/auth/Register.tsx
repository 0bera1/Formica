import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { register } from "../../redux/slices/authSlice";
import { FaKey, FaTasks } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";

function Register() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
        if (values.password !== values.confirmPassword) {
            message.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await dispatch(register(values)).unwrap(); // unwrap, başarısızlık durumunda hata fırlatır
            message.success('Register successful!');
            navigate('/'); // Başarılı giriş sonrası Dashboard'a yönlendirme
        } catch {
            message.error("Register failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="flex w-4/5 max-w-6xl bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg">
                {/* Left: Login Form */}
                <div className="w-1/2 p-10 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-gray-100 mb-6 text-center">Welcome</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Register to manage your tasks and collaborate with your team efficiently.
                    </p>
                    <Form layout="vertical" className="space-y-6" onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Please input your name!" }]}
                        >
                            <Input
                                type="text"
                                placeholder="Name"
                                prefix={<IoPersonCircleOutline className="text-gray-400" size={20} />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: "Please input your email!" }]}
                        >
                            <Input
                                type="email"
                                placeholder="Email Address"
                                prefix={<MdEmail className="text-gray-400" size={20} />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password
                                placeholder="Password"
                                prefix={<FaKey className="text-gray-400" size={16} />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: "Please confirm your password!" }]}
                        >
                            <Input.Password
                                placeholder="Confirm Password"
                                prefix={<FaKey className="text-gray-400" size={16} />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Button
                            type="default"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="custom-button"
                        >
                            Register
                        </Button>
                    </Form>

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Are you have an account ? {" "}
                            <a
                                href="/"
                                className="text-blue-500 hover:text-blue-300 transition duration-200"
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right: Icon and Slogan */}
                <div className="w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col items-center justify-center text-white p-10">
                    <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                        {/* Replace with your app logo */}
                        <FaTasks className="text-blue-800" size={64} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Task & User Management</h3>
                    <p className="text-center text-lg px-6">
                        Simplify your workflow and achieve more with our intuitive platform.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register