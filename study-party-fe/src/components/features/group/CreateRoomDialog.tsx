import UpsertRoomDialog from "@/components/features/group/UpsertRoomDialog";
import type {EnumItem} from "@/types/enum.type";

export function CreateRoomDialog({groupTopics = []}: { groupTopics: EnumItem[] | unknown }) {
    return <UpsertRoomDialog mode="create" groupTopics={groupTopics} />;
}
export default CreateRoomDialog;
