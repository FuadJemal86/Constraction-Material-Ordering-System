import React, { useEffect, useState } from 'react'
import api from '../../api'
import { Printer, FileSpreadsheet, Eye } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function DonePayment() {

    const [donePayment, setDonePayment] = useState([])
    const [orderItem, setOrderItem] = useState([])
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [totalPages, setTotalPages] = useState(1);

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Completed: "bg-green-100 text-green-800",
            Processing: "bg-blue-100 text-blue-800",
            Pending: "bg-yellow-100 text-yellow-800",
            Cancelled: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get(`/supplier/get-completed-payment/?page=${page}&limit=10`)

                if (result.data.status) {
                    setDonePayment(result.data.donePayments)
                    setPage(result.data.currentPage);
                    setTotalPages(result.data.totalPages);
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }

        }
        fetchData()
    }, [])

    const handleOrderItem = async (id) => {


        if (!isModalOpen) {
            setIsModalOpen(true)
        } else {
            setIsModalOpen(false)
        }

        try {
            const result = await api.get(`/supplier/get-order-item/${id}`)

            if (result.data.status) {
                setOrderItem(result.data.orderItem)
            } else {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handlePrint = () => {
        const printContent = document.getElementById("completed-payment-table");
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
    }

    return (
        <div>
            <div className="p-4 mt-16 bg-white rounded-lg shadow " id='product-table'>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Done Payment</h2>

                <div className="overflow-x-auto" id='completed-payment-table'>

                    <div className='flex justify-end gap-2'>
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

                    </div>
                    <div className='w-full overflow-x-auto border-collapse'>
                        <table className={`bg-gray-100 min-w-[1200px]`}>
                            <thead>
                                <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Phone</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">View Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donePayment.map((c, index) => (
                                    <tr
                                        key={c.id || index}
                                        className={index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-100 hover:bg-gray-100"}
                                    >
                                        <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                        <td className="p-3 text-sm text-gray-800">{c.customer.name}</td>
                                        <td className="p-3 text-sm text-gray-800">{c.customer.phone}</td>
                                        <td className="p-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${getStatusBadgeColor(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-800">{c.amount}</td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            }).replace(' ', '.')}
                                        </td>
                                        <td className='p-3 text-sm'>
                                            <span onClick={e => handleOrderItem(c.id)} className='text-blue-600 cursor-pointer'><Eye /></span>
                                        </td>
                                    </tr>
                                ))}
                                {donePayment.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-gray-500">
                                            No product found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                {isModalOpen && (
                    <div className="hidden md:flex fixed inset-0 bg-gray-600 bg-opacity-50 justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-1/2">
                            <h2 className="text-xl font-bold mb-4">Order Items for Order</h2>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500">Customer</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500">Product Name</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500">Category</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500">Quantity</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderItem.map(c => (
                                            <tr >
                                                <td className="p-3 text-sm">{c.order.customer.name}</td>
                                                <td className="p-3 text-sm">{c.product.name}</td>
                                                <td className="p-3 text-sm">{c.product.category.category}</td>
                                                <td className="p-3 text-sm">{c.quantity}</td>
                                                <td className="p-3 text-sm">{c.unitPrice}</td>
                                            </tr>

                                        ))
                                    }
                                </tbody>
                            </table>
                            <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 px-4">
                            <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                                <h2 className="text-lg md:text-xl font-bold mb-4 text-center">Order Items</h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 text-left font-medium text-gray-600">Customer</th>
                                                <th className="p-2 text-left font-medium text-gray-600">Product</th>
                                                <th className="p-2 text-left font-medium text-gray-600">Category</th>
                                                <th className="p-2 text-left font-medium text-gray-600">Qty</th>
                                                <th className="p-2 text-left font-medium text-gray-600">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItem.map((c, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2">{c.order.customer.name}</td>
                                                    <td className="p-2">{c.product.name}</td>
                                                    <td className="p-2">{c.product.category.category}</td>
                                                    <td className="p-2">{c.quantity}</td>
                                                    <td className="p-2">birr {c.unitPrice}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

export default DonePayment
