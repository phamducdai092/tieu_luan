import type {FlashcardSet} from "@/types/flashcard.type.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { BookOpen } from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import { motion } from "framer-motion";
import {Badge} from "@/components/ui/badge";

export default function FlashcardCard({ set }: { set: FlashcardSet }) {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-base gap-1"><BookOpen className="h-4 w-4" />{set.count} thẻ</Badge>
                    </div>
                    <CardTitle className="mt-2 text-2xl">{set.topic}</CardTitle>
                    <CardDescription>Bộ thẻ ghi nhớ</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="text-base text-muted-foreground">Mã: {set.id}</div>
                    <Button size="sm" variant="outline">Mở bộ thẻ</Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
