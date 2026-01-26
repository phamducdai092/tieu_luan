import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {
    Calendar as CalendarIcon,
    Camera,
    CheckCircle2,
    Image as ImageIcon,
    Loader2,
    Mail,
    Phone,
    ShieldCheck,
    User2,
} from "lucide-react";
import {cn} from "@/lib/utils";
import type {User, UserInformationUpdatePayload} from "@/types/user.type";
import {calcAge, toDateInput} from "@/utils/date";
import {useMemo, useState} from "react";
import {toast} from "sonner";
import useAuthStore from "@/store/auth.store.ts";
import {uploadToCloudinary} from "@/lib/cloudinary";
import {updateUserProfile} from "@/services/user.service.ts";
import {loadMe} from "@/services/auth.service.ts";
import Field from "@/components/shared/Field";
import InfoPill from "@/components/shared/InfoPill";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import {ScrollArea} from "@/components/ui/scroll-area";

export function UserInfoDialog({
                                   user,
                                   children,
                               }: {
    user?: User | null;
    children?: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const {setUser} = useAuthStore();

    const u: Partial<User> = user ?? {};

    // local form state
    const [displayName, setDisplayName] = useState(user?.displayName ?? "");
    const [bio, setBio] = useState(user?.bio ?? "");
    const [phone, setPhone] = useState(user?.phoneNumber ?? "");
    const [dob, setDob] = useState(toDateInput(u.dateOfBirth ?? ""));// yyyy-MM-dd

    // image states
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const avatarPreview = useMemo(
        () => (avatarFile ? URL.createObjectURL(avatarFile) : u.avatarUrl || undefined),
        [avatarFile, u?.avatarUrl]
    );
    const bannerPreview = useMemo(
        () => (bannerFile ? URL.createObjectURL(bannerFile) : u.bannerUrl || undefined),
        [bannerFile, u?.bannerUrl]
    );

    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const bannerInputRef = React.useRef<HTMLInputElement>(null);

    async function handleSave() {
        try {
            setSaving(true);

            // Upload ảnh nếu có
            const [avatarRes, bannerRes] = await Promise.all([
                avatarFile
                    ? uploadToCloudinary(avatarFile, {folder: "study-party/avatars"})
                    : Promise.resolve(null),
                bannerFile
                    ? uploadToCloudinary(bannerFile, {folder: "study-party/banners"})
                    : Promise.resolve(null),
            ]);

            // Build payload (chỉ field có giá trị)
            const payload: UserInformationUpdatePayload = {
                avatarUrl: avatarRes?.secure_url ?? u?.avatarUrl ?? undefined,
                bannerUrl: bannerRes?.secure_url ?? u?.bannerUrl ?? undefined,
                displayName: displayName?.trim() || undefined,
                bio: bio?.trim() || undefined,
                phoneNumber: phone?.trim() || undefined,
                dateOfBirth: dob ? new Date(dob).toISOString() : undefined,
            };
            const body = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));

            await updateUserProfile(body);
            const res = await loadMe();
            const data: User = res?.data?.user ?? res?.data;
            setUser?.(data);

            toast.success("Cập nhật thông tin thành công!");
            setOpen(false);
        } catch (e: any) {
            console.error("Update failed:", e?.response?.status, e?.response?.data || e);
            toast.error(e?.response?.data?.error?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    }

    function onOpenChange(v: boolean) {
        setOpen(v);
        if (v) return;
        if (avatarFile && avatarPreview) URL.revokeObjectURL(avatarPreview);
        if (bannerFile && bannerPreview) URL.revokeObjectURL(bannerPreview);
    }

    const age = u?.dateOfBirth ? calcAge(u.dateOfBirth) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children ? (
                <DialogTrigger asChild onClick={() => setOpen(true)}>{children}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">Thông tin</Button>
                </DialogTrigger>
            )}

            <DialogContent
                className="max-w-6xl w-[95vw] sm:max-w-none p-0 gap-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
                aria-describedby={undefined}
            >
                {/* Header cố định */}
                <div className="flex items-center justify-between p-6 border-b">
                    <DialogTitle>Thông tin cá nhân</DialogTitle>
                    <DialogDescription className="sr-only">
                        Thông tin chi tiết và chỉnh sửa hồ sơ cá nhân
                    </DialogDescription>
                </div>

                {/* Scroll nội dung */}
                <ScrollArea className="max-h-[80vh] px-4">
                    <div className="pb-6">
                        {/* Banner */}
                        <div
                            className="relative h-48 lg:h-56 bg-gradient-to-r from-[oklch(var(--hero-from))] to-[oklch(var(--hero-to))]">
                            {bannerPreview ? (
                                <div
                                    className="absolute inset-0 bg-center rounded-lg bg-cover"
                                    style={{backgroundImage: `url(${bannerPreview})`}}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-muted"/>
                            )}

                            <div className="absolute right-4 bottom-4 flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 bg-background/90 hover:bg-background"
                                    onClick={() => bannerInputRef.current?.click()}
                                >
                                    <Camera className="h-4 w-4"/> Thay banner
                                </Button>
                                <input
                                    ref={bannerInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                                />
                            </div>
                        </div>

                        {/* Header user row */}
                        <div className="px-6 mt-4">
                            <div className="flex flex-col lg:flex-row gap-6 items-start">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div
                                            className={cn(
                                                "h-28 w-28 md:h-32 md:w-32 -mt-8 flex items-center justify-center rounded-full border-4 border-background shadow-lg overflow-hidden bg-background",
                                                "ring-2 ring-primary/20"
                                            )}
                                        >
                                            <AvatarDisplay
                                                src={avatarPreview}
                                                fallback={u.displayName}
                                                alt={u.displayName}
                                                size={160}
                                                userId={u.id}
                                                showStatus={true}
                                            />
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="bg-primary-foreground absolute -bottom-0 -right-0 h-8 w-8 rounded-full shadow-md"
                                            onClick={() => avatarInputRef.current?.click()}
                                            title="Thay avatar"
                                        >
                                            <ImageIcon className="text-primary h-4 w-4"/>
                                        </Button>
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 pb-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h2 className="text-2xl md:text-3xl font-bold truncate">
                                            {u.displayName || "Chưa đặt tên"}
                                        </h2>
                                        {u.verified ? (
                                            <Badge className="bg-success/10 text-success border-success/20 gap-1">
                                                <ShieldCheck className="h-3 w-3"/> Đã xác minh
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Chưa xác minh</Badge>
                                        )}
                                        {age !== null && (
                                            <Badge variant="secondary" className="gap-1">
                                                <CalendarIcon className="h-3 w-3"/> {age} tuổi
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {u.bio || "Chưa có bio"}
                                    </p>

                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <Badge variant="secondary" className="gap-1">
                                            <Mail className="h-3 w-3"/> {u.email}
                                        </Badge>
                                        {u.phoneNumber && (
                                            <Badge variant="secondary" className="gap-1">
                                                <Phone className="h-3 w-3"/> {u.phoneNumber}
                                            </Badge>
                                        )}
                                        {u.dateOfBirth && (
                                            <Badge variant="secondary" className="gap-1">
                                                <CalendarIcon className="h-3 w-3"/>{" "}
                                                {new Date(u.dateOfBirth).toLocaleDateString()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6"/>

                        {/* Content — form + info card */}
                        <div className="px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left: form */}
                                <div className="lg:col-span-2 space-y-6">
                                    <Field label="Tên hiển thị" icon={User2}>
                                        <Input
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="VD: Đức Đại"
                                            className="w-full"
                                        />
                                    </Field>

                                    <Field label="Giới thiệu">
                                        <Textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={4}
                                            placeholder="Một vài dòng về bạn…"
                                            className="w-full resize-none"
                                        />
                                    </Field>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Số điện thoại" icon={Phone}>
                                            <Input
                                                type="number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="0987xxxxxx"
                                                className="w-full"
                                            />
                                        </Field>
                                        <Field label="Ngày sinh" icon={CalendarIcon}>
                                            <Input
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                className="w-full"
                                            />
                                        </Field>
                                    </div>
                                </div>

                                {/* Right: info card */}
                                <div className="lg:col-span-1">
                                    <Card className="border-primary/20 sticky top-4">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-4 w-4 flex-shrink-0"/>
                                                <span className="truncate">{u.email}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Email là định danh chính và không thể đổi.
                                            </div>
                                            <Separator/>
                                            <div className="grid grid-cols-1 gap-3 text-xs">
                                                <InfoPill
                                                    label="Trạng thái"
                                                    value={u.verified ? "Đã xác minh" : "Chưa xác minh"}
                                                    tone={u.verified ? "success" : "secondary"}
                                                />
                                                <InfoPill
                                                    label="SĐT"
                                                    value={u.phoneNumber || "Chưa cập nhật"}
                                                />
                                                <InfoPill
                                                    label="Sinh nhật"
                                                    value={
                                                        dob
                                                            ? new Date(dob).toLocaleDateString("vi-VN")
                                                            : "Chưa cập nhật"
                                                    }
                                                />
                                                <InfoPill
                                                    label="Hiển thị"
                                                    value={displayName || "Chưa cập nhật"}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Huỷ
                                </Button>
                                <Button onClick={handleSave} disabled={saving}
                                        className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                            Đang lưu…
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4"/>
                                            Lưu thay đổi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
