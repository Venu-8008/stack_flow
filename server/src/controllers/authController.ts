import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, organizationName, name } = req.body;

        if (!email || !password || !organizationName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (prisma) => {
            const org = await prisma.organization.create({
                data: { name: organizationName },
            });

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    organizationId: org.id,
                },
            });

            return { user, org };
        });

        const token = jwt.sign(
            { userId: result.user.id, orgId: result.org.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                organizationId: result.org.id,
                organizationName: result.org.name,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message, error.stack);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, orgId: user.organizationId },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                organizationId: user.organization.id,
                organizationName: user.organization.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message, error.stack);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
