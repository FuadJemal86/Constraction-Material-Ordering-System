import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, TrendingUp, DollarSign, Truck, Star, AlertCircle, Users } from 'lucide-react';

import api from '../../api';

const MetricCard = ({ title, value, icon: Icon, change, color, prefix = '', suffix = '' }) => {
    // Helper function to safely render values
    const renderValue = (val) => {
        if (val === null || val === undefined) return 'N/A';
        if (typeof val === 'object') {
            console.error('Object detected in MetricCard value:', val);
            return 'Error';
        }
        if (typeof val === 'number') return val.toLocaleString();
        return String(val);
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(change)}%
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                    {prefix}
                    {renderValue(value)}
                    {suffix}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{title}</p>
            </div>
        </div>
    );
};

const SupplierDashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [activeCustomers, setActiveCustomers] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [returnRate, setReturnRate] = useState(0);
    const [doneOrder, setDoneOrder] = useState(0);
    const [revenueData, setRevenueData] = useState([]);
    const [topProductsData, setTopProductsData] = useState([]);

    const [metrics, setMetrics] = useState({
        totalOrders: 1847,
        totalProducts: 324,
        averageOrderValue: 133,
        returnRate: 2.4,
        customerSatisfaction: 4.7
    });

    // Helper function to safely extract numeric values
    const safeExtractValue = (data, fallback = 0) => {
        if (data === null || data === undefined) return fallback;
        if (typeof data === 'object') {
            console.error('Unexpected object received:', data);
            return fallback;
        }
        const numValue = Number(data);
        return isNaN(numValue) ? fallback : numValue;
    };

    // total Revenue
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-total-birr')

                if (result.data.status) {
                    setTotalRevenue(safeExtractValue(result.data.totalPayment))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    // total product 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-total-product')

                if (result.data.status) {
                    setTotalProducts(safeExtractValue(result.data.totalProduct))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    // total orders
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-total-order')

                if (result.data.status) {
                    setTotalOrders(safeExtractValue(result.data.totalOrders))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    // active customer
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-total-customer')

                if (result.data.status) {
                    setActiveCustomers(safeExtractValue(result.data.totalCustomer))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    // pending order
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-pending-order')

                if (result.data.status) {
                    setPendingOrders(safeExtractValue(result.data.pendingOrder))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    // total Process Order Birr

    let averageOrder = 0

    if (totalOrders !== 0) {
        averageOrder = totalRevenue / totalOrders
    }

    // return rate 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-return-rate')

                if (result.data.status) {
                    setReturnRate(safeExtractValue(result.data.returnRate))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    let returnOrderRate = 0

    if (totalRevenue !== 0) {
        returnOrderRate = (returnRate * 100) / totalOrders
    }


    // done Orders

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-done-order')

                if (result.data.status) {
                    setDoneOrder(safeExtractValue(result.data.doneOrder))
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])


    // chart Data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-chart-data')

                if (result.data.status) {
                    setRevenueData(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])


    // pi chart data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/supplier/get-pi-chart-data')

                if (result.data.status) {
                    setTopProductsData(result.data.topProductsData)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])



    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Revenue"
                    value={totalRevenue}
                    icon={DollarSign}
                    change={12.5}
                    color="bg-blue-500"
                    prefix="Birr"
                />

                <MetricCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={ShoppingCart}
                    change={8.2}
                    color="bg-green-500"
                />

                <MetricCard
                    title="Active Products"
                    value={totalProducts}
                    icon={Package}
                    change={5.7}
                    color="bg-purple-500"
                />

                <MetricCard
                    title="Active Customers"
                    value={activeCustomers}
                    icon={Users}
                    change={15.3}
                    color="bg-orange-500"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Pending Orders"
                    value={pendingOrders}
                    icon={AlertCircle}
                    change={-3.2}
                    color="bg-yellow-500"
                />

                <MetricCard
                    title="Avg Order Value"
                    value={averageOrder}
                    icon={TrendingUp}
                    change={6.8}
                    color="bg-indigo-500"
                    prefix="Birr"
                />

                <MetricCard
                    title="Return Rate"
                    value={returnRate}
                    icon={Truck}
                    change={-12.4}
                    color="bg-red-500"
                    suffix="%"
                />

                <MetricCard
                    title="Completed Rate"
                    value={doneOrder}
                    icon={Star}
                    change={4.1}
                    color="bg-pink-500"
                    suffix=""
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue & Orders Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3B82F6"
                                fill="url(#colorRevenue)"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#10B981' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Product Categories */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topProductsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="sales"
                            >
                                {topProductsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {topProductsData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-gray-700">{item.name}</span>
                                </div>
                                <span className="font-medium text-gray-900">{item.sales}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SupplierDashboard;