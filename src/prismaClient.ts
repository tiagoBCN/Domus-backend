import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

// Usa DIRECT_URL (session-mode, sem pgbouncer) para o driver adapter,
// pois o PrismaPg precisa de uma conexão direta, não pooled.
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || '';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
