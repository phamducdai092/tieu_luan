import { z } from "zod";

export const createRoomSchema = z.object({
    name: z.string().trim().min(5, "Tên phòng phải dài hơn 5 ký tự").max(60, "Tên phòng không được vượt quá 60 ký tự"),
    description: z.string().trim().max(500, "Mô tả phòng không được vượt quá 500 ký tự").optional(),
    joinPolicy: z.enum(["OPEN", "ASK", "INVITE_ONLY"], {
        error: "Vui lòng chọn chính sách tham gia cho phòng"
    }),
    groupPrivacy: z.enum(["PUBLIC", "PRIVATE"], {
        error: "Vui lòng chọn chế độ hiển thị cho phòng"
    }),
    topic: z.string({
        error: "Chủ đề phòng là bắt buộc"
    }).min(1, "Vui lòng chọn chủ đề cho phòng"),
    maxMembers: z.coerce.number({
        error: "Vui lòng nhập số.",
    })
        .min(2, "Số thành viên tối thiểu là 2")
        .max(200, "Số thành viên tối đa là 100")
        .default(50),
});

export type CreateRoomFormValues = z.input<typeof createRoomSchema>;
export type CreateRoomPayload    = z.output<typeof createRoomSchema>;