"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useCategories } from "@/contexts/CategoriesContext"
import { PlusIcon, TrashIcon, TagIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ManageCategoriesDialogProps {
    trigger?: React.ReactNode
}

export function ManageCategoriesDialog({ trigger }: ManageCategoriesDialogProps) {
    const { categories, addCategory, deleteCategory, isDefault } = useCategories()
    const [newCategory, setNewCategory] = useState("")
    const [open, setOpen] = useState(false)

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (newCategory.trim()) {
            addCategory(newCategory)
            setNewCategory("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <TagIcon className="size-4" />
                        Kelola Kategori
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Kelola Kategori Transaksi</DialogTitle>
                    <DialogDescription>
                        Tambah atau hapus kategori untuk transaksi Anda
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Add Category Form */}
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Nama kategori baru..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="icon">
                            <PlusIcon className="size-4" />
                        </Button>
                    </form>

                    {/* Categories List */}
                    <div className="space-y-2">
                        <Label>Kategori ({categories.length})</Label>
                        <ScrollArea className="h-[300px] rounded-md border p-3">
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{category}</span>
                                            {isDefault(category) && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                        {!isDefault(category) && (
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => deleteCategory(category)}
                                                title="Hapus kategori"
                                            >
                                                <TrashIcon className="size-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        💡 Kategori default tidak bisa dihapus
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
