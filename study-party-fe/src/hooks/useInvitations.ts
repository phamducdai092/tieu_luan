import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { inviteService } from "@/services/invite.service";

// Key Factory
export const invitationKeys = {
    all: ['invitations'] as const,
    list: (filters: any) => [...invitationKeys.all, 'list', filters] as const,
};

type UseInvitationsOptions = {
    page?: number;
    size?: number;
    status?: string; // 'PENDING' | 'ACCEPTED' | ...
    sort?: string;
    enabled?: boolean;
}

export function useInvitations(options: UseInvitationsOptions = {}) {
    const {
        page = 0,
        size = 10,
        status = 'PENDING',
        sort = 'createdAt',
        enabled = true
    } = options;

    const queryParams = { page, size, status, sort };

    return useQuery({
        queryKey: invitationKeys.list(queryParams),
        queryFn: async () => {
            const res = await inviteService.getUserInvitations(queryParams);
            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // Cache 2 phút
        enabled: enabled,
    });
}