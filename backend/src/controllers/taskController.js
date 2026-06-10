const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTasks(req, res) {
  const { status, priority, search } = req.query;

  const where = { userId: req.userId };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (search) where.title = { contains: search };

  try {
    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
}

async function createTask(req, res) {
  const { title, description, priority, dueDate } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.userId,
      },
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : null },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Tarefa deletada' });
  } catch {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
}

async function getStats(req, res) {
  try {
    const [total, pending, in_progress, done] = await Promise.all([
      prisma.task.count({ where: { userId: req.userId } }),
      prisma.task.count({ where: { userId: req.userId, status: 'pending' } }),
      prisma.task.count({ where: { userId: req.userId, status: 'in_progress' } }),
      prisma.task.count({ where: { userId: req.userId, status: 'done' } }),
    ]);

    res.json({ total, pending, in_progress, done });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask, getStats };
