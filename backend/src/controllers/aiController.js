const Anthropic = require('@anthropic-ai/sdk');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function suggest(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      select: { title: true, status: true, priority: true },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const taskList = tasks
      .map(t => `- "${t.title}" [${t.status}, ${t.priority}]`)
      .join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `Sou um usuário de um app de tarefas. Minhas tarefas recentes são:\n${taskList}\n\nDê 3 sugestões curtas e práticas de produtividade baseadas nas minhas tarefas. Responda em português, de forma amigável e concisa. Formato: lista numerada.`,
        },
      ],
    });

    const suggestion = message.content[0].text;
    res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar sugestão de IA' });
  }
}

module.exports = { suggest };
