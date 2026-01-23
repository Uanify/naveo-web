import { z } from "zod"

export const transactionSchema = z.object({
    transaction_id: z.string(),
    transaction_date: z.string(),
    expense_status: z.string(),
    payment_status: z.string(),
    merchant: z.string(),
    category: z.string(),
    amount: z.number(),
    currency: z.string(),
    lastEdited: z.string(),
    continent: z.string(),
    country: z.string(),
})

export type Usage = {
    owner: string
    status: string
    costs: number
    region: string
    stability: number
    lastEdited: string
}

export type OverviewData = {
    date: string
    "Pedidos totales": number
    "Valor mercancía": number
    "Comisiones Naveo": number
    "Nuevos clientes": number
    "Distancia total (km)": number
    "Recargas Wallet": number
}

export type Transaction = z.infer<typeof transactionSchema>