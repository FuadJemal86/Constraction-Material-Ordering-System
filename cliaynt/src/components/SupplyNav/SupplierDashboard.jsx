import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, TrendingUp, DollarSign, Truck, Star, AlertCircle, Users } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, change, color, prefix = '', suffix = '' }) => (
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
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{title}</p>
        </div>
    </div>
);

const SupplierDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalRevenue: 245680,
        totalOrders: 1847,
        totalProducts: 324,
        activeCustomers: 892,
        pendingOrders: 47,
        averageOrderValue: 133,
        returnRate: 2.4,
        customerSatisfaction: 4.7
    });

    // Sample data for charts
    const revenueData = [
        { month: 'Jan', revenue: 42000, orders: 145, customers: 120 },
        { month: 'Feb', revenue: 38000, orders: 132, customers: 110 },
        { month: 'Mar', revenue: 52000, orders: 178, customers: 145 },
        { month: 'Apr', revenue: 48000, orders: 165, customers: 135 },
        { month: 'May', revenue: 65000, orders: 210, customers: 180 },
        { month: 'Jun', revenue: 58000, orders: 195, customers: 165 }
    ];

    const topProductsData = [
        { name: 'Electronics', sales: 45, color: '#3B82F6' },
        { name: 'Clothing', sales: 30, color: '#10B981' },
        { name: 'Home & Garden', sales: 18, color: '#F59E0B' },
        { name: 'Sports', sales: 12, color: '#EF4444' },
        { name: 'Books', sales: 8, color: '#8B5CF6' },
        { name: 'Others', sales: 7, color: '#6B7280' }
    ];

    const orderStatusData = [
        { day: 'Mon', completed: 28, pending: 8, shipped: 15 },
        { day: 'Tue', completed: 32, pending: 12, shipped: 18 },
        { day: 'Wed', completed: 25, pending: 6, shipped: 14 },
        { day: 'Thu', completed: 38, pending: 15, shipped: 22 },
        { day: 'Fri', completed: 42, pending: 9, shipped: 25 },
        { day: 'Sat', completed: 35, pending: 11, shipped: 20 },
        { day: 'Sun', completed: 22, pending: 5, shipped: 12 }
    ];

    const performanceData = [
        { metric: 'Product Views', current: 12580, previous: 11200 },
        { metric: 'Add to Cart', current: 3240, previous: 2980 },
        { metric: 'Purchases', current: 1847, previous: 1620 },
        { metric: 'Customer Returns', current: 44, previous: 67 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Revenue"
                    value={metrics.totalRevenue}
                    icon={DollarSign}
                    change={12.5}
                    color="bg-blue-500"
                    prefix="$"
                />
                <MetricCard
                    title="Total Orders"
                    value={metrics.totalOrders}
                    icon={ShoppingCart}
                    change={8.2}
                    color="bg-green-500"
                />
                <MetricCard
                    title="Active Products"
                    value={metrics.totalProducts}
                    icon={Package}
                    change={5.7}
                    color="bg-purple-500"
                />
                <MetricCard
                    title="Active Customers"
                    value={metrics.activeCustomers}
                    icon={Users}
                    change={15.3}
                    color="bg-orange-500"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Pending Orders"
                    value={metrics.pendingOrders}
                    icon={AlertCircle}
                    change={-3.2}
                    color="bg-yellow-500"
                />
                <MetricCard
                    title="Avg Order Value"
                    value={metrics.averageOrderValue}
                    icon={TrendingUp}
                    change={6.8}
                    color="bg-indigo-500"
                    prefix="$"
                />
                <MetricCard
                    title="Return Rate"
                    value={metrics.returnRate}
                    icon={Truck}
                    change={-12.4}
                    color="bg-red-500"
                    suffix="%"
                />
                <MetricCard
                    title="Customer Rating"
                    value={metrics.customerSatisfaction}
                    icon={Star}
                    change={4.1}
                    color="bg-pink-500"
                    suffix="/5"
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

            {/* Order Status & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Order Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderStatusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="shipped" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="pending" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">Completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">Shipped</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-700">Pending</span>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
                    <div className="space-y-6">
                        {performanceData.map((item, index) => {
                            const change = ((item.current - item.previous) / item.previous * 100).toFixed(1);
                            const isPositive = change >= 0;
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.metric}</p>
                                        <p className="text-sm text-gray-500">
                                            Current: {item.current.toLocaleString()} | Previous: {item.previous.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        <TrendingUp className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} />
                                        {Math.abs(change)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Conversion Funnel */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4">Conversion Funnel</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Views to Cart</span>
                                <span className="font-medium">25.8%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25.8%' }}></div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Cart to Purchase</span>
                                <span className="font-medium">57.0%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '57%' }}></div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Overall Conversion</span>
                                <span className="font-medium">14.7%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '14.7%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;