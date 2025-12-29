import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: 0,
        costPrice: '',
        sellingPrice: '',
        lowStockThreshold: 5,
        description: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            // In a real app we might have a specific endpoint or filter the list
            // For MVP shortcut: fetch all and find (or implement getById in backend if needed)
            // Wait, we didn't implement getById in backend routes explicitly for one item, but we can verify.
            // Actually we have update/delete, but not getOne.
            // Let's implement fetch all and filter for now as MVP shortcut or fetch list.
            // Ideally should add getById. Let's add getById to backend if needed.
            // But for now, we can iterate if the list is small. Or just fetch from list store if using state manager.
            // Since we don't have state manager, let's just fetch all.
            const res = await axios.get('/api/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const product = res.data.find((p: any) => p.id === id);
            if (product) {
                setFormData({
                    name: product.name,
                    sku: product.sku,
                    quantity: product.quantity,
                    costPrice: product.costPrice || '',
                    sellingPrice: product.sellingPrice || '',
                    lowStockThreshold: product.lowStockThreshold || 5,
                    description: product.description || ''
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEdit) {
                await axios.put(`/api/products/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post('/api/products', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate('/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto p-6 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input name="name" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">SKU</label>
                            <input name="sku" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.sku} onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input name="quantity" type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.quantity} onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                            <input name="lowStockThreshold" type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.lowStockThreshold} onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                            <input name="costPrice" type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.costPrice} onChange={handleChange} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                            <input name="sellingPrice" type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.sellingPrice} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{isEdit ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
