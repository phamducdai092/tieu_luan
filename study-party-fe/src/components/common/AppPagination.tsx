import {Button} from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import {cn} from "@/lib/utils";

interface AppPaginationProps {
    page: number;          // Trang hiện tại (0-index)
    totalPages: number;    // Tổng số trang
    totalItems?: number;   // Tổng số item (để hiển thị text)
    onPageChange: (page: number) => void; // Hàm xử lý khi chuyển trang
    size?: "default" | "sm"; // Kích thước
    className?: string;
}

export function AppPagination({
                                  page,
                                  totalPages,
                                  totalItems,
                                  onPageChange,
                                  size = "default",
                                  className
                              }: AppPaginationProps) {

    // Nếu không có trang nào hoặc chỉ 1 trang thì ẩn luôn cho gọn (hoặc hiện tùy m)
    if (totalPages <= 1) return null;

    const isSmall = size === "sm";
    const btnSize = isSmall ? "h-8 w-8" : "h-9 w-9";
    const iconSize = isSmall ? "h-3.5 w-3.5" : "h-4 w-4";

    return (
        <div className={cn(
            "flex items-center justify-between w-full pt-4 border-t border-border",
            isSmall ? "pt-2 mt-2" : "mt-6",
            className
        )}>
            {/* Phần Text hiển thị info */}
            <div className={cn("text-muted-foreground font-medium", isSmall ? "text-xs" : "text-sm")}>
                {totalItems !== undefined ? (
                    <span>
                        <span className="hidden sm:inline">Tổng </span>
                        <span className="text-foreground font-bold">{totalItems}</span> kết quả
                    </span>
                ) : (
                    <span className="hidden sm:inline">Trang {page + 1} / {totalPages}</span>
                )}
            </div>

            {/* Phần Nút điều hướng */}
            <div className="flex items-center gap-1 sm:gap-2">

                {/* Nút về trang đầu (chỉ hiện khi size default) */}
                {!isSmall && (
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(btnSize, "hidden sm:flex")}
                        onClick={() => onPageChange(0)}
                        disabled={page === 0}
                    >
                        <ChevronsLeft className={iconSize}/>
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className={btnSize}
                    onClick={() => onPageChange(Math.max(0, page - 1))}
                    disabled={page === 0}
                >
                    <ChevronLeft className={iconSize}/>
                </Button>

                {/* Text trang (chỉ hiện ở giữa 2 nút trên mobile hoặc size small) */}
                <div className={cn(
                    "flex items-center justify-center min-w-[3rem] font-medium text-foreground",
                    isSmall ? "text-xs" : "text-sm"
                )}>
                    {page + 1} / {totalPages}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className={btnSize}
                    onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                >
                    <ChevronRight className={iconSize}/>
                </Button>

                {/* Nút về trang cuối (chỉ hiện khi size default) */}
                {!isSmall && (
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(btnSize, "hidden sm:flex")}
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={page >= totalPages - 1}
                    >
                        <ChevronsRight className={iconSize}/>
                    </Button>
                )}
            </div>
        </div>
    );
}