import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase';
import prisma from './prismaClient';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Estender a interface Request do Express para incluir o user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// ─── Middleware de Autenticação com Supabase ──────────────────────────
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }

  req.user = user;
  next();
};

// ─── Rota pública de status ──────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Servidor Domus.ai está rodando perfeitamente!',
    timestamp: new Date()
  });
});

// ═══════════════════════════════════════════════════════════════════════
//  ROTAS PROTEGIDAS (requerem JWT válido)
// ═══════════════════════════════════════════════════════════════════════

// ─── PACIENTES ───────────────────────────────────────────────────────

// Listar todos os pacientes do usuário
app.get('/api/pacientes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      where: { userId: req.user.id },
      include: {
        fichasACS: true,
        triagens: true,
        scoresEAD: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(pacientes);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar pacientes.', details: err.message });
  }
});

// Buscar paciente por ID
app.get('/api/pacientes/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const paciente = await prisma.paciente.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        fichasACS: { orderBy: { dataColeta: 'desc' } },
        triagens: { orderBy: { dataAvaliacao: 'desc' } },
        scoresEAD: { orderBy: { dataAvaliacao: 'desc' } },
      },
    });
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado.' });
    }
    res.json(paciente);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar paciente.', details: err.message });
  }
});

// Criar paciente
app.post('/api/pacientes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { nome, prontuario, idade, statusProtocolo } = req.body;
    const paciente = await prisma.paciente.create({
      data: {
        nome,
        prontuario,
        idade,
        statusProtocolo,
        userId: req.user.id,
      },
    });
    res.status(201).json(paciente);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao criar paciente.', details: err.message });
  }
});

// ─── FICHA ACS ───────────────────────────────────────────────────────

// Listar fichas ACS de um paciente
app.get('/api/acs/:pacienteId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const fichas = await prisma.fichaACS.findMany({
      where: { pacienteId: req.params.pacienteId, userId: req.user.id },
      orderBy: { dataColeta: 'desc' },
    });
    res.json(fichas);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar fichas ACS.', details: err.message });
  }
});

// Salvar ficha ACS
app.post('/api/acs', authenticateToken, async (req: Request, res: Response) => {
  try {
    const ficha = await prisma.fichaACS.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json(ficha);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar ficha ACS.', details: err.message });
  }
});

// ─── TRIAGEM ─────────────────────────────────────────────────────────

// Listar triagens de um paciente
app.get('/api/triagem/:pacienteId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const triagens = await prisma.triagem.findMany({
      where: { pacienteId: req.params.pacienteId, userId: req.user.id },
      orderBy: { dataAvaliacao: 'desc' },
    });
    res.json(triagens);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar triagens.', details: err.message });
  }
});

// Salvar triagem
app.post('/api/triagem', authenticateToken, async (req: Request, res: Response) => {
  try {
    const triagem = await prisma.triagem.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json(triagem);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar triagem.', details: err.message });
  }
});

// ─── SCORE EAD ───────────────────────────────────────────────────────

// Listar scores EAD de um paciente
app.get('/api/ead/:pacienteId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const scores = await prisma.scoreEAD.findMany({
      where: { pacienteId: req.params.pacienteId, userId: req.user.id },
      orderBy: { dataAvaliacao: 'desc' },
    });
    res.json(scores);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar scores EAD.', details: err.message });
  }
});

// Salvar score EAD
app.post('/api/ead', authenticateToken, async (req: Request, res: Response) => {
  try {
    const score = await prisma.scoreEAD.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });
    res.status(201).json(score);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar score EAD.', details: err.message });
  }
});


// ─── Iniciar servidor ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Domus Backend] Servidor iniciado na porta ${PORT}`);
});
