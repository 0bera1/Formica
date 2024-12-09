import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../redux/store';
import { Button, Input, Form, message } from 'antd';
import { login } from '../redux/slices/authSlice';
import { MdEmail } from 'react-icons/md';
import { FaKey } from 'react-icons/fa';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            await dispatch(login(values)).unwrap(); // unwrap, başarısızlık durumunda hata fırlatır
            message.success('Login successful!');
            navigate('/dashboard'); // Başarılı giriş sonrası Dashboard'a yönlendirme
        } catch {
            message.error(`Login failed!`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen
            bg-gradient-to-br from-[#242424] via-black to-[#242424]">
            <div className="p-6 bg-gradient-to-br from-slate-400/20 via-white/15 to-slate-400/20 rounded-lg 
              lg:w-1/3 lg:h-2/5 backdrop-filter backdrop-blur-xl shadow-xl shadow-black border
            border-gray-200 md:w-3/5 border-opacity-30 w-11/12 
            ">
                <h2 className="text-3xl font-light text-center mb-6 ">Login</h2>
                <Form layout="vertical" className='space-y-8' onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input type="email" placeholder=" Enter your e-mail" prefix={<MdEmail color='gray' />}
                            className='py-2 text-base font-light' />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder=" Enter your password" prefix={<FaKey color='gray' size={12} />}
                            className='py-2 text-base font-light'
                        />
                    </Form.Item>
                    <Button
                        type="default"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="mt-1 bg-gradient-to-br from-[#242424] via-black to-[#242424] font-bold rounded-xl
                        border border-blue-500 border-opacity-30 text-white hover:scale-95 transition-all duration-500"
                    >
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Login;
