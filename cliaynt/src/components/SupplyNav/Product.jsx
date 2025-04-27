import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Printer, FileSpreadsheet } from "lucide-react";


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
                    <div className='w-full overflow-x-auto border-collapse'>
                        <table className="bg-gray-100 min-w-[1185px]">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((order, index) => (
                                    <tr
                                        key={order.id || index}
                                        className={index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-100 hover:bg-gray-100"}
                                    >
                                        <td className="p-3 text-sm text-indigo-600 font-medium">{order.id}</td>
                                        <td className="p-3 text-sm text-gray-800">{order.name}</td>
                                        <td className="p-3 text-sm text-gray-800">{order.category.category}</td>
                                        <td className="p-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${getStatusBadgeColor(order.status)}`}>
                                                birr {order.price}/{order.unit}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-500">{order.stock}</td>
                                        <td className="p-3 text-sm text-gray-800"></td>
                                    </tr>
                                ))}
                                {product.length === 0 && (
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
            </div>

        </div>
    )
}

export default Product
