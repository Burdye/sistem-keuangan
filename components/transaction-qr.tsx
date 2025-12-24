"use client"

import { useEffect, useState } from "react"
import { generateQRCode, generateTransactionQRData } from "@/lib/qrcode"
import { type Transaction } from "@/contexts/TransactionsContext"

interface TransactionQRProps {
    transaction: Transaction
    className?: string
}

export function TransactionQR({ transaction, className }: TransactionQRProps) {
    const [qrCode, setQrCode] = useState<string>("")

    useEffect(() => {
        const generate = async () => {
            const qrData = generateTransactionQRData(transaction)
            const dataUrl = await generateQRCode(qrData)
            setQrCode(dataUrl)
        }
        generate()
    }, [transaction])

    if (!qrCode) {
        return <div className={`animate-pulse bg-muted rounded ${className}`} />
    }

    return <img src={qrCode} alt="QR Code" className={className} />
}
