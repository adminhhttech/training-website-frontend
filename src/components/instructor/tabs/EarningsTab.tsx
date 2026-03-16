// components/instructor/tabs/EarningsTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, DollarSign, Clock, TrendingUp, Calendar } from "lucide-react"

interface Payout {
    id: string
    amount: number
    status: "pending" | "processing" | "completed" | "failed"
    method: string
    date: string
    invoiceUrl?: string
}

const mockPayouts: Payout[] = [
    {
        id: "1",
        amount: 4895.50,
        status: "completed",
        method: "Bank Transfer",
        date: "2023-11-01T00:00:00Z",
        invoiceUrl: "https://example.com/invoice-1.pdf",
    },
    {
        id: "2",
        amount: 3245.75,
        status: "pending",
        method: "PayPal",
        date: "2023-11-15T00:00:00Z",
        invoiceUrl: "https://example.com/invoice-2.pdf",
    },
    {
        id: "3",
        amount: 5678.25,
        status: "processing",
        method: "Bank Transfer",
        date: "2023-11-10T00:00:00Z",
        invoiceUrl: "https://example.com/invoice-3.pdf",
    },
]

const mockStats = {
    balanceAvailable: 3245.50,
    pendingPayout: 1245.75,
    lifetimeRevenue: 24567.25,
}

export const EarningsTab = () => {
    const [isRequesting, setIsRequesting] = useState(false)

    const handleRequestPayout = async () => {
        setIsRequesting(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Success
        } catch (error) {
            // Error handling
        } finally {
            setIsRequesting(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "processing":
                return "bg-blue-100 text-blue-800"
            case "failed":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Earnings & Payouts</h2>
                <Button
                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                    onClick={handleRequestPayout}
                    disabled={isRequesting}
                >
                    {isRequesting ? "Requesting..." : "Request Payout"}
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Balance Available</p>
                                    <p className="text-2xl font-bold text-gray-900">${mockStats.balanceAvailable.toFixed(2)}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Payout</p>
                                    <p className="text-2xl font-bold text-gray-900">${mockStats.pendingPayout.toFixed(2)}</p>
                                </div>
                                <Clock className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Lifetime Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">${mockStats.lifetimeRevenue.toFixed(2)}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Payout History Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Payout History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Invoice</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockPayouts.map((payout, index) => (
                                    <motion.tr
                                        key={payout.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                                        <TableCell>${payout.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(payout.status)}>
                                                {getStatusText(payout.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{payout.method}</TableCell>
                                        <TableCell>
                                            {payout.invoiceUrl ? (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a
                                                        href={payout.invoiceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </a>
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6 text-center">
                        <Calendar className="h-8 w-8 text-[#0080ff] mx-auto mb-2" />
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">$4,895.50</p>
                        <p className="text-xs text-green-600">+12.5%</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6 text-center">
                        <TrendingUp className="h-8 w-8 text-[#0080ff] mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Avg. Payout</p>
                        <p className="text-2xl font-bold text-gray-900">$2,456.75</p>
                        <p className="text-xs text-green-600">+8.2%</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6 text-center">
                        <DollarSign className="h-8 w-8 text-[#0080ff] mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Total Payouts</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-xs text-green-600">+2 this month</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm lg:col-span-2">
                    <CardContent className="p-6 text-center">
                        <Clock className="h-8 w-8 text-[#0080ff] mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Avg. Processing</p>
                        <p className="text-2xl font-bold text-gray-900">2.5 days</p>
                        <p className="text-xs text-red-600">-0.5 days</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}