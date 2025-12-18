import {bootstrapAuth} from "./auth";
import {bootstrapEnums} from "./enum.ts";
import {bootstrapGroups} from "./group.ts";
import {getAccess} from "@/lib/token.ts";

/**
 * Chạy mọi tác vụ khởi động cần thiết cho app.
 * Có thể thêm: feature flags, settings, i18n, theme tokens...
 */
export async function runBootstrap() {
    await Promise.all([
        bootstrapAuth(),
        bootstrapEnums(),
        // chỉ load group khi đã có access token
        getAccess() ? bootstrapGroups() : Promise.resolve(),
    ]);
}

export async function reBootstrapGroups() {
    await Promise.all([
        // chỉ load group khi đã có access token
        getAccess() ? bootstrapGroups() : Promise.resolve(),
    ]);
}
