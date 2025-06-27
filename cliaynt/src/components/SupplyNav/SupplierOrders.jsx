import React, { useEffect, useState } from 'react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, Printer, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function SupplierOrders() {
    // Status badge colors

    const [order, setOrder] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [orderItem, setOrderItem] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [statusState, setStatusState] = useState({
        status: ''
    })
    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            CANSELLED: "bg-red-100 text-red-800",
            DELIVERED: "bg-red-100 text-red-800"

        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    useEffect(() => {

        fetchData()
    }, [page])

    const fetchData = async () => {
        console.log(page)
        try {
            const result = await api.get(`/supplier/get-order?page=${page}&limit=10`)
            if (result.data.status) {
                setOrder(result.data.order)
                setPage(result.data.currentPage);
                setTotalPages(result.data.totalPages);
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }



    const handleStatus = async (newStatus, id) => {
        try {
            const result = await api.put(`/supplier/update-order-status/${id}`, {
                ...statusState,
                status: newStatus
            });
            if (result.data.status) {
                setStatusState({ status: newStatus });
                toast.success(result.data.message);
                fetchData();
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };

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

    // print the customer table
    const handlePrint = () => {
        const printContent = document.getElementById("order-table");
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



    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orders</h2>

            {/* Desktop View */}
            <div className=" overflow-x-auto" id='order-table'>
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
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Item</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.length > 0 ? (
                                    order.map((c, index) => (
                                        <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 text-indigo-600 font-medium">{c.id}</td>
                                            <td className="py-4 px-4 text-gray-900">{c.customer.name}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.address && c.address.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {c.address && c.address.length > 0 ? c.address : 'No'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-500">
                                                {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td className="py-4 px-4 text-gray-900 font-medium">birr {c.totalPrice}</td>
                                            <td className="py-4 px-4">
                                                <select
                                                    value={c.status || "PROCESSING"}
                                                    onChange={e => handleStatus(e.target.value, c.id)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(c.status)}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span onClick={() => handleOrderItem(c.id)} className="text-blue-600 cursor-pointer hover:underline">
                                                    <Eye />
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
            {isModalOpen && (
                <div className="hidden md:flex fixed inset-0 bg-gray-600 bg-opacity-50 justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">Order Items for Order</h2>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Customer</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Phone</th>
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
                                            <td className="p-3 text-sm">{c.order.customer.phone}</td>
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
    );
}

export default SupplierOrders;