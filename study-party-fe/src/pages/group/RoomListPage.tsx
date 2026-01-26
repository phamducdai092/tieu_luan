import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useGroups, type GroupListType} from "@/hooks/useGroups";
import {AppPagination} from "@/components/common/AppPagination";
import RoomCard from "@/components/features/group/RoomCard";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {ArrowLeft, LaptopMinimalCheck, Star, Globe2} from "lucide-react";
import {useEnumStore} from "@/store/enum.store";
import {getEnumItem} from "@/utils/enumItemExtract";

export default function GroupListPage() {
    const {type} = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const groupEnum = useEnumStore().get("GroupTopic");

    // 1. Validate type từ URL
    // Nếu type không hợp lệ thì fallback về 'joined'
    let listType: GroupListType = 'joined';
    if (type === 'owned') listType = 'owned';
    if (type === 'discover') listType = 'discover'; // 👇 Handle case discover

    // 2. Cấu hình UI dựa trên Type (Icon, Title, Description)
    const viewConfig = {
        joined: {
            title: "Phòng đã tham gia",
            icon: LaptopMinimalCheck,
            desc: "Danh sách tất cả các nhóm học tập bạn đang tham gia."
        },
        owned: {
            title: "Phòng của tôi",
            icon: Star,
            desc: "Quản lý các nhóm học tập do bạn tạo ra."
        },
        discover: { // 👇 Config cho màn hình khám phá
            title: "Khám phá phòng học",
            icon: Globe2,
            desc: "Tìm kiếm và tham gia các nhóm học tập thú vị."
        }
    };

    const currentView = viewConfig[listType];
    const Icon = currentView.icon;

    // 3. Gọi Hook
    const {data, isLoading} = useGroups({
        type: listType,
        page: page,
        size: 12
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* --- HEADER --- */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Icon className="h-6 w-6 text-primary"/>
                            {currentView.title}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {currentView.desc}
                        </p>
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-[200px] rounded-xl"/>
                        ))}
                    </div>
                ) : (data?.items?.length ?? 0) === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">Không tìm thấy nhóm nào.</p>

                        {/* Logic hiển thị nút bấm khi trống */}
                        {listType === 'owned' && (
                            <Button variant="link" onClick={() => navigate('/')} className="mt-2">
                                Tạo nhóm mới ngay
                            </Button>
                        )}
                        {listType === 'joined' && (
                            <Button variant="link" onClick={() => navigate('/groups/list/discover')} className="mt-2">
                                Khám phá ngay
                            </Button>
                        )}
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {data?.items.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                enumItem={getEnumItem(groupEnum, room.topic)}
                                onClick={() => navigate(`/rooms/${room.slug}`)}
                            />
                        ))}
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {data?.meta && (
                    <div className="mt-8 flex justify-center border-t pt-4">
                        <AppPagination
                            page={data.meta.page}
                            totalPages={data.meta.totalPages}
                            totalItems={data.meta.totalItems}
                            onPageChange={(p) => {
                                setPage(p);
                                window.scrollTo({top: 0, behavior: 'smooth'});
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}