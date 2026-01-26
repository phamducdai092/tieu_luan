import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {BookOpen, Users, Video, GraduationCap} from 'lucide-react';
import {toast} from 'sonner';
import useAuthStore from '@/store/auth.store.ts';
import {useLocation, useNavigate} from 'react-router-dom';
import {AxiosError} from "axios";
import {reBootstrapGroups} from "@/bootstrap/bootstrap.ts";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {login, loadMe} = useAuthStore();

    // THAY ĐỔI 1: State error nên là string hoặc null để dễ hiển thị
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Gọi API Login -> Lấy Token
            // Giả sử hàm login của m trả về response (chứa token & user info)
            await login({email, password});
            await reBootstrapGroups();

            // 2. Thông báo thành công ngay lập tức
            toast.success('Đăng nhập thành công!');

            // 3. 🔥 TỐI ƯU TỐC ĐỘ:
            // Gọi loadMe() ở background (Fire & Forget) - KHÔNG DÙNG AWAIT
            // Để nó tự chạy ngầm, còn UI thì chuyển trang luôn cho mượt.
            loadMe();

            // 4. Điều hướng ngay lập tức
            // Nếu API login có trả về role thì check luôn để điều hướng cho chuẩn

            navigate(from || '/', {replace: true});

        } catch (err) {
            let errorMessage = "Đã có lỗi xảy ra vui lòng thử lại.";

            if (err instanceof AxiosError) {
                const responseMessage = err.response?.data?.message;
                if (responseMessage) {
                    if (Array.isArray(responseMessage)) {
                        errorMessage = responseMessage.join(', ');
                    } else {
                        errorMessage = String(responseMessage);
                    }
                } else {
                    errorMessage = err.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Login Error Details:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-3xl font-semibold text-gray-800">
                            <div className="flex justify-center items-center gap-2 mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                                    <GraduationCap className="w-8 h-8 text-white"/>
                                </div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-2">
                                    Đăng nhập
                                </h1>
                            </div>
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600">
                            Tham gia vào các nhóm học online của bạn
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-lg font-medium text-gray-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@student.edu.vn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-lg h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-lg font-medium text-gray-700">
                                    Mật khẩu
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* THAY ĐỔI 3: Render có điều kiện an toàn */}
                            {error && (
                                <div
                                    className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <p className="text-base text-red-600 font-medium text-center">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={onSubmit}
                                className="cursor-pointer text-lg w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <div className="w-full text-center space-y-4">
                            <div className="flex items-center justify-between text-base">
                                <a href="/forgot-password"
                                   className="text-blue-600 hover:text-blue-800 hover:underline">
                                    Quên mật khẩu?
                                </a>
                                <a href="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
                                    Đăng ký tài khoản
                                </a>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-center gap-6 text-base text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3 text-blue-500"/>
                                        <span>Nhóm học</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Video className="w-3 h-3 text-green-500"/>
                                        <span>Video call</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-3 h-3 text-purple-500"/>
                                        <span>Tài liệu</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}