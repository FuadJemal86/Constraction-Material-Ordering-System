import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Printer, FileSpreadsheet } from "lucide-react";
import { BlinkBlur, FourSquare } from 'react-loading-indicators'



function Payment() {
    const [loading, setLoading] = useState(true)
    const [paymentStatus, setPaymentStatus] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState({
        status: ''
    })


    useEffect(() => {

        fetchData()

    }, [page])

    const fetchData = async () => {
        try {
            const result = await api.get(`/supplier/get-payment?page=${page}&limit=10`)

            if (result.data.status) {
                setPaymentStatus(result.data.payments)
                setPage(result.data.currentPage);
                setTotalPages(result.data.totalPages);
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }


    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            FAILED: "bg-red-100 text-red-800",
            PAYED: "bg-green-100 text-green-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }

    // print the customer table
    const handlePrint = () => {
        const printContent = document.getElementById("payment");
        const WindowPrt = window.open('', '', 'width=900,height=650');
        WindowPrt.document.write(`
                        <html>
                            <head>
                                <title>Customer</title>
                                <style>
                                    body { font-family: Arial; padding: 20px; }
                                    table { width: 100%; border-collapse: collapse; }
                                    th, td { padding: 8px; border: 1px solid #ccc; }
                                    th { background: #f0f0f0; }
                                </style>
                            </head>
                            <body>${printContent.innerHTML}</body>
                        </html>
                    `);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    };

    //  export Excel file
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(customer);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Customers.xlsx");
    };

    if (loading) {
        return (
            <div className='relative w-full h-full'>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#385d38" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment</h2>

            <div id='payment'>
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Printer />
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <FileSpreadsheet />
                    </button>
                </div>

                {/* Desktop View */}
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Transaction</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Payment</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">You Payment</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paymentStatus.length > 0 ? (
                                    paymentStatus.map((c, index) => (
                                        <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 whitespace-nowrap text-indigo-600 font-medium">{c.id}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-900">{c.customer.name}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{c.amount} birr</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{c.bankTransactionId}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-700">{c.customer.phone}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                                                {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(c.status)}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(c.payedStatus)}`}>
                                                    {c.payedStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            No product found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(num => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-1 border rounded ${num === page ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'
                            } hover:bg-indigo-100`}
                    >
                        {num}
                    </button>
                ))}

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Payment
