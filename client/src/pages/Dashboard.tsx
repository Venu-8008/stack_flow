import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface Product {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    lowStockThreshold: number;
}

const Dashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockItems = products.filter(p => p.quantity <= (p.lowStockThreshold || 5));

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm uppercase">Total Products</h3>
                        <p className="text-3xl font-bold mt-2">{totalProducts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm uppercase">Total Units in Stock</h3>
                        <p className="text-3xl font-bold mt-2">{totalStock}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm uppercase">Low Stock Alerts</h3>
                        <p className={`text-3xl font-bold mt-2 ${lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {lowStockItems.length}
                        </p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lowStockItems.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">{product.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.lowStockThreshold || 5}</td>
                                </tr>
                            ))}
                            {lowStockItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No items are low in stock.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
