"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

const DEFAULT_CATEGORIES = [
    "Iuran Anggota",
    "Donasi",
    "Operasional",
    "Konsumsi",
    "Perlengkapan",
    "Lainnya",
]

interface CategoriesContextType {
    categories: string[]
    addCategory: (category: string) => void
    deleteCategory: (category: string) => void
    isDefault: (category: string) => boolean
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("categories")
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCategories(parsed)
                }
            } catch (error) {
                console.error("Failed to parse categories:", error)
            }
        }
    }, [])

    // Save to localStorage whenever categories change
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    const addCategory = (category: string) => {
        const trimmed = category.trim()

        if (!trimmed) {
            toast.error("Nama kategori tidak boleh kosong")
            return
        }

        if (categories.includes(trimmed)) {
            toast.error("Kategori sudah ada")
            return
        }

        setCategories((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'id')))
        toast.success(`Kategori "${trimmed}" berhasil ditambahkan`)
    }

    const deleteCategory = (category: string) => {
        if (DEFAULT_CATEGORIES.includes(category)) {
            toast.error("Kategori default tidak bisa dihapus")
            return
        }

        setCategories((prev) => prev.filter((c) => c !== category))
        toast.success(`Kategori "${category}" berhasil dihapus`)
    }

    const isDefault = (category: string) => {
        return DEFAULT_CATEGORIES.includes(category)
    }

    return (
        <CategoriesContext.Provider value={{ categories, addCategory, deleteCategory, isDefault }}>
            {children}
        </CategoriesContext.Provider>
    )
}

export function useCategories() {
    const context = useContext(CategoriesContext)
    if (!context) {
        throw new Error("useCategories must be used within CategoriesProvider")
    }
    return context
}
