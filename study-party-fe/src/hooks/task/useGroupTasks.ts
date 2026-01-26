import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task.service";

export interface groupTaskQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
}

export const groupTaskKeys = {
    all: ['group-task'] as const,
    list: (params: groupTaskQueryParams) => [...groupTaskKeys.all, params] as const,
};

export const useGroupTasks = (groupId: number, params: groupTaskQueryParams) => {
    return useQuery({
        queryKey: groupTaskKeys.list(params),
        queryFn: async  () => {
            const res = await getTasks(groupId, params);
            return {
                items: res.data || [],
                meta: res.meta
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    })
};