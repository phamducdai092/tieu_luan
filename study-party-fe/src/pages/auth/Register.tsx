import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BookOpen, Users, Video, GraduationCap, ArrowLeft, Mail } from 'lucide-react';
import { AxiosError } from "axios";
import type { FieldError } from "@/types/api.type.ts";
import useAuthStore from "@/store/auth.store.ts";
import { accountService } from '@/services/account.service';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State cho OTP
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1); // 1: Form Đăng ký, 2: Form OTP

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<FieldError[]>([]);

    const { register, login } = useAuthStore(); // Lấy hàm login để auto-login

    // --- BƯỚC 1: GỬI FORM ĐĂNG KÝ ---
    async function onSubmit() {
        if (!email || !password || !confirmPassword) {
            setError([{ message: 'Vui lòng điền đầy đủ thông tin!' }]);
            return;
        }
        if (password !== confirmPassword) {
            setError([{ message: 'Mật khẩu xác nhận không khớp' }]);
            return;
        }

        setLoading(true);
        setError([]);

        try {
            // Gọi hàm register (API backend đã sửa trả về void/success)
            await register({ email, password });

            toast.success("Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.");
            setStep(2); // Chuyển sang màn nhập OTP
        } catch (err) {
            if (err instanceof AxiosError) {
                const msg = err.response?.data?.message || "Đăng ký thất bại";
                toast.error(msg);
                if (err.response?.data?.fieldErrors) {
                    setError(err.response?.data.fieldErrors);
                }
            }
        } finally {
            setLoading(false);
        }
    }

    // --- BƯỚC 2: XÁC THỰC OTP & AUTO LOGIN ---
    async function onVerifyOtp() {
        if (!otp || otp.length < 6) {
            toast.error("Vui lòng nhập mã OTP 6 số");
            return;
        }

        setLoading(true);
        try {
            // 1. Gọi API xác thực email
            await accountService.confirmVerifyEmail({
                email: email,
                otp: otp
            });

            toast.success("Xác thực tài khoản thành công!");

            // 2. Tự động đăng nhập luôn
            await login({ email, password });

            // 3. Chuyển về trang chủ
            navigate('/', { replace: true });

        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">

                    {/* Header chung */}
                    <CardHeader className="text-center pb-0">
                        <CardTitle className="text-3xl font-semibold text-gray-800">
                            <div className="flex justify-center items-center gap-2 mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-2">
                                    {step === 1 ? 'Đăng ký' : 'Xác thực OTP'}
                                </h1>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {/* --- FORM ĐĂNG KÝ (STEP 1) --- */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@student.edu.vn"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                {error.length > 0 && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                        {error.map((err, idx) => <div key={idx}>{err.message}</div>)}
                                    </div>
                                )}

                                <Button
                                    onClick={onSubmit}
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-medium"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                                </Button>
                            </div>
                        )}

                        {/* --- FORM NHẬP OTP (STEP 2) --- */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="text-center text-sm text-gray-500 mb-4">
                                    Chúng tôi đã gửi mã xác thực 6 số đến email <br/>
                                    <span className="font-bold text-gray-800">{email}</span>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="otp">Mã xác thực (OTP)</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                            placeholder="Nhập 6 số OTP"
                                            className="h-12 pl-10 text-center text-xl tracking-widest font-bold"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={onVerifyOtp}
                                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xác thực...' : 'Xác nhận & Đăng nhập'}
                                </Button>

                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1"
                                >
                                    <ArrowLeft className="w-4 h-4"/> Quay lại
                                </button>
                            </div>
                        )}
                    </CardContent>

                    {/* Footer */}
                    <CardFooter>
                        {step === 1 && (
                            <div className="w-full text-center space-y-4">
                                <div className="flex items-center justify-end text-base">
                                    <a href="/login" className="text-blue-600 hover:underline">
                                        Đã có tài khoản? Đăng nhập
                                    </a>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-center gap-6 text-base text-gray-600">
                                    <div className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-500"/> Nhóm học</div>
                                    <div className="flex items-center gap-1"><Video className="w-3 h-3 text-green-500"/> Video call</div>
                                    <div className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-purple-500"/> Tài liệu</div>
                                </div>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}