import React, { useState, useRef } from "react";
import { Paperclip, X, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (content: string, files: File[]) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    // Chỉ cần 1 ref cho file input chung
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!value.trim() && files.length === 0) return;

        onSend(value, files);

        // Reset form
        setValue("");
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
        e.target.value = "";
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    const isSendable = value.trim().length > 0 || files.length > 0;
    const isImageFile = (file: File) => file.type.startsWith('image/');

    return (
        <div className="border-t bg-white dark:bg-slate-950 transition-all p-3">
            {/* 1. Preview Files */}
            {files.length > 0 && (
                <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide snap-x">
                    {files.map((f, i) => (
                        <div key={i} className="relative group shrink-0 snap-start">
                            {isImageFile(f) ? (
                                <div className="relative h-20 w-20 rounded-xl overflow-hidden border shadow-sm">
                                    <img
                                        src={URL.createObjectURL(f)}
                                        alt="preview"
                                        className="h-full w-full object-cover"
                                        onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                    />
                                </div>
                            ) : (
                                <div className="relative h-20 w-40 flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-900 shadow-sm">
                                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                                        <FileText className="h-5 w-5"/>
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <p className="text-xs font-medium truncate">{f.name}</p>
                                        <p className="text-[10px] text-slate-500">{(f.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute -top-1.5 -right-1.5 bg-slate-200 text-slate-600 hover:bg-red-500 hover:text-white rounded-full p-0.5 shadow-sm transition-all"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. Main Input Area */}
            <div className="flex items-end gap-2">

                {/* --- INPUT TEXT (Trái) --- */}
                <div className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-[24px] px-4 py-2 flex items-center min-h-[44px]">
                    <textarea
                        ref={textareaRef}
                        className="w-full bg-transparent border-none focus:ring-0 focus-visible:ring-0 resize-none max-h-36 text-[15px] scrollbar-hide placeholder:text-slate-500 dark:placeholder:text-slate-400 py-1 !outline-none"
                        value={value}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhắn tin..."
                        rows={1}
                        disabled={disabled}
                        style={{ height: 'auto' }}
                    />
                </div>

                {/* --- BUTTONS (Phải) --- */}
                <div className="flex items-center gap-1 pb-1 shrink-0">

                    {/* Nút File (Paperclip) */}
                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileSelect} />
                    <Button
                        type="button" variant="ghost" size="icon" disabled={disabled}
                        className="text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800 rounded-full h-9 w-9"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    {/* Nút Gửi (Icon Send - Không nền) */}
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={disabled || !isSendable}
                        onClick={handleSend}
                        className={cn(
                            "rounded-full h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-slate-800",
                            isSendable
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-300 dark:text-slate-600"
                        )}
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}