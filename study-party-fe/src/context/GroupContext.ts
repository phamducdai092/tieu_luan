import { createContext, useContext } from 'react';

interface RoomContextType {
    onJoinCall: () => void;
}

// Giá trị mặc định là hàm rỗng (để tránh lỗi crash nếu quên bọc Provider)
const RoomContext = createContext<RoomContextType>({
    onJoinCall: () => {},
});

export const useRoomContext = () => useContext(RoomContext);
export default RoomContext;