"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DownloadIcon, FileTextIcon, QrCodeIcon, MoreVerticalIcon, SearchIcon, TrashIcon } from "lucide-react"
import { useTransactions, type Transaction } from "@/contexts/TransactionsContext"
import { formatCurrency } from "@/lib/currency"
import { generateNotaPDF } from "@/lib/nota-generator"
import { generateQRCode, generateTransactionQRData } from "@/lib/qrcode"
import { toast } from "sonner"
import { TransactionQR } from "@/components/transaction-qr"

export default function NotaPage() {
    const { transactions, deleteTransaction } = useTransactions()
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)

    const filteredRecords = transactions.filter(
        (t) =>
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.treasurer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleDownloadNota = async (transaction: Transaction) => {
        try {
            await generateNotaPDF(transaction)
            toast.success("Nota berhasil didownload!")
        } catch (error) {
            toast.error("Gagal mendownload nota")
        }
    }

    const handleDownloadQR = async (transaction: Transaction) => {
        try {
            const qrData = generateTransactionQRData(transaction)
            const qrDataURL = await generateQRCode(qrData)
            const link = document.createElement("a")
            link.href = qrDataURL
            link.download = `QR_${transaction.id}_${transaction.date}.png`
            link.click()
            toast.success("QR Code berhasil didownload!")
        } catch (error) {
            toast.error("Gagal mendownload QR Code")
        }
    }

    const handleDeleteClick = (id: string) => {
        setTransactionToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete)
            toast.success("Nota (Transaksi) berhasil dihapus")
            setDeleteDialogOpen(false)
            setTransactionToDelete(null)
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-6" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-medium">Nota</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Riwayat Nota</h2>
                            <p className="text-muted-foreground">
                                Semua nota dari data transaksi tersimpan ({transactions.length} total)
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nota..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Nota Grid */}
                    {filteredRecords.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileTextIcon className="size-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center">
                                    {searchQuery ? "Tidak ada nota yang cocok dengan pencarian" : "Belum ada transaksi"}
                                </p>
                                <p className="text-sm text-muted-foreground text-center mt-1">
                                    Nota otomatis tersedia untuk setiap transaksi
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredRecords.map((t) => (
                                <Card key={t.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1 flex-1">
                                                <CardTitle className="text-base line-clamp-1">{t.description}</CardTitle>
                                                <CardDescription className="text-xs">ID: {t.id}</CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <MoreVerticalIcon className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleDownloadNota(t)}>
                                                        <FileTextIcon className="size-4 mr-2" />
                                                        Download PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDownloadQR(t)}>
                                                        <QrCodeIcon className="size-4 mr-2" />
                                                        Download QR
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(t.id)}>
                                                        <TrashIcon className="size-4 mr-2" />
                                                        Hapus Transaksi
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={t.type === "MASUK" ? "default" : "secondary"}
                                                className={
                                                    t.type === "MASUK"
                                                        ? "bg-foreground text-background hover:bg-foreground/90"
                                                        : ""
                                                }
                                            >
                                                {t.type}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{t.category}</span>
                                        </div>

                                        <div className="space-y-1">
                                            <p
                                                className={`text-lg font-bold ${t.type === "MASUK" ? "text-foreground" : "text-muted-foreground"}`}
                                            >
                                                {t.type === "MASUK" ? "+" : "-"} {formatCurrency(t.amount)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(t.date).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t">
                                            <TransactionQR transaction={t} className="size-12 border rounded" />
                                            <div className="text-xs text-muted-foreground flex-1">
                                                <p>Bendahara: {t.treasurer}</p>
                                                <p className="text-[10px] text-muted-foreground/60">
                                                    Realtime Sync
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDownloadNota(t)}>
                                                <DownloadIcon className="size-3 mr-1" />
                                                PDF
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDownloadQR(t)}>
                                                <QrCodeIcon className="size-3 mr-1" />
                                                QR
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </SidebarInset>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Nota & Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data transaksi ini secara permanen dari database. Nota tidak akan tersedia lagi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarProvider>
    )
}
