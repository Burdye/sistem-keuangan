"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { type Transaction, type Comment } from "@/contexts/TransactionsContext"
import { MessageCircleIcon } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface CommentDialogProps {
    transaction: Transaction | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddComment: (name: string, text: string) => void
}

export function CommentDialog({ transaction, open, onOpenChange, onAddComment }: CommentDialogProps) {
    const [name, setName] = useState("")
    const [commentText, setCommentText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim() || !commentText.trim()) {
            toast.error("Nama dan komentar harus diisi")
            return
        }

        setIsSubmitting(true)
        try {
            await onAddComment(name.trim(), commentText.trim())
            toast.success("Komentar berhasil ditambahkan")
            setName("")
            setCommentText("")
        } catch (error) {
            toast.error("Gagal menambahkan komentar")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!transaction) return null

    const comments = transaction.comments || []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircleIcon className="size-5" />
                        Komentar Transaksi
                    </DialogTitle>
                    <DialogDescription>
                        {transaction.description} - {new Date(transaction.date).toLocaleDateString("id-ID")}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {/* Form Input Komentar */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid gap-2">
                            <Label htmlFor="comment-name">Nama Anda</Label>
                            <Input
                                id="comment-name"
                                placeholder="Masukkan nama Anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="comment-text">Komentar</Label>
                            <Textarea
                                id="comment-text"
                                placeholder="Tulis komentar Anda..."
                                className="resize-none"
                                rows={3}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
                        </Button>
                    </form>

                    <Separator />

                    {/* List Komentar */}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold">
                                Komentar ({comments.length})
                            </h4>
                        </div>

                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                Belum ada komentar. Jadilah yang pertama!
                            </div>
                        ) : (
                            <ScrollArea className="h-[250px] pr-3">
                                <div className="space-y-3">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="p-3 rounded-lg bg-muted/50 border space-y-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm">
                                                    {comment.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.timestamp), {
                                                        addSuffix: true,
                                                        locale: localeId,
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground/90">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
