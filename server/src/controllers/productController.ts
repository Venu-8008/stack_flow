import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        userId: string;
        orgId: string;
    };
}

export const getProducts = async (req: AuthRequest, res: Response) => {
    try {
        const orgId = req.user?.orgId;
        if (!orgId) return res.status(401).json({ message: 'Unauthorized' });

        const products = await prisma.product.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const orgId = req.user?.orgId;
        if (!orgId) return res.status(401).json({ message: 'Unauthorized' });

        const { name, sku, quantity, description, costPrice, sellingPrice, lowStockThreshold } = req.body;

        const existingProduct = await prisma.product.findFirst({
            where: { organizationId: orgId, sku },
        });

        if (existingProduct) {
            return res.status(400).json({ message: 'SKU already exists in your organization' });
        }

        const product = await prisma.product.create({
            data: {
                organizationId: orgId,
                name,
                sku,
                quantity: parseInt(quantity) || 0,
                description,
                costPrice: costPrice ? parseFloat(costPrice) : null,
                sellingPrice: sellingPrice ? parseFloat(sellingPrice) : null,
                lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 5,
            },
        });

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const orgId = req.user?.orgId;
        if (!orgId) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;

        const product = await prisma.product.updateMany({
            where: { id, organizationId: orgId },
            data: req.body,
        });

        if (product.count === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const orgId = req.user?.orgId;
        if (!orgId) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;

        const result = await prisma.product.deleteMany({
            where: { id, organizationId: orgId },
        });

        if (result.count === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};
