import React, { useState } from "react";

export function ChatInput({ onSend }: { onSend: (content: string) => void }) {
    const [value, setValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Chặn xuống dòng
            if (value.trim()) {
                onSend(value);
                setValue(""); // Xóa input
            }
        }
    };

    return (
        <div className="flex gap-2 p-2">
            <input
                className="flex-grow text-sm border rounded-md p-2"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhắn tin..."
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                    if (value.trim()) {
                        onSend(value);
                        setValue("");
                    }
                }}
            >
                Gửi
            </button>
        </div>
    );
}