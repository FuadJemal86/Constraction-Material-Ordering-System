import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Printer, FileSpreadsheet, Trash2 } from "lucide-react";


function Product({ orders = [] }) {

    const [product, setProduct] = useState([])
    const [page, setPage] = useState(1);
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
        fetchData()
    }, [page])

    const fetchData = async () => {
        try {
            const result = await api.get(`/supplier/get-product?page=${page}&limit=10`)

            if (result.data.status) {
                setProduct(result.data.result)
                setPage(result.data.currentPage);
                setTotalPages(result.data.totalPages);

            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    // print the customer table
    const handlePrint = () => {
        const printContent = document.getElementById("product-table");
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

    const handleDelete = async (id) => {

        try {
            const result = await api.delete(`/supplier/delete-product/${id}`)

            if (result.data.status) {
                fetchData()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <span className='flex justify-end mt-2'>
                <Link to={'/supplier-page/add-product'} className='bg-blue-950 flex items-center rounded-lg text-gray-300 px-4 py-2'>Post Product</Link>
            </span>
            <div className="p-4 mt-16 bg-white rounded-lg shadow " id='product-table'>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product</h2>

                <div className="overflow-x-auto">

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
                    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {product.length > 0 ? (
                                        product.map((order, index) => (
                                            <tr key={order.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="py-4 px-4 text-indigo-600 font-medium">{order.id}</td>
                                                <td className="py-4 px-4 text-gray-900">{order.name}</td>
                                                <td className="py-4 px-4 text-gray-700">{order.category.category}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${getStatusBadgeColor(order.status)}`}>
                                                        birr {order.price}/{order.unit}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-500">{order.stock}</td>
                                                <td className="py-4 px-4">
                                                    <button onClick={() => handleDelete(order.id)} className="hover:scale-110 transition-transform duration-150">
                                                        <Trash2 className='text-red-600' size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                No product found
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
            </div>

        </div>
    )
}

export default Product
