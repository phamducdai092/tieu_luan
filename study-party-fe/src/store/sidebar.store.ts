import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
    setOpen: (val: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true, // Giá trị mặc định nếu chưa có trong localStorage
            toggle: () => set((state) => ({ isOpen: !state.isOpen })),
            setOpen: (val) => set({ isOpen: val }),
        }),
        {
            name: 'sidebar-storage', // Tên key trong localStorage
            storage: createJSONStorage(() => localStorage), // Mặc định là localStorage
        }
    )
);