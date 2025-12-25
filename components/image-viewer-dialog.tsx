"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ImageViewerDialogProps {
    imageUrl: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
    description?: string
}

export function ImageViewerDialog({ imageUrl, open, onOpenChange, description }: ImageViewerDialogProps) {
    if (!imageUrl) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="size-5" />
                    </Button>
                    <div className="p-4">
                        {description && (
                            <DialogHeader className="mb-4">
                                <DialogTitle>{description}</DialogTitle>
                            </DialogHeader>
                        )}
                        <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="Transaction"
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
