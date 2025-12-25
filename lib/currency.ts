export function formatCurrency(amount: number): string {
    // Format dengan titik sebagai thousand separator
    return new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}
