import { PrismaClient } from '@prisma/client';
import { AppData, Card, List, Board, Workspace } from './types';

// Global Prisma Client instance to avoid multiple instantiation in Next.js dev server
const globalRef = global as any;
export const prisma = globalRef.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalRef.prisma = prisma;
}

export async function readDB(): Promise<AppData> {
  const workspacesRaw = await prisma.workspace.findMany();
  const boardsRaw = await prisma.board.findMany({
    include: { butlerRules: true }
  });
  const listsRaw = await prisma.list.findMany();
  const cardsRaw = await prisma.card.findMany({
    include: {
      labels: true,
      members: true,
      checklists: {
        include: { items: true }
      },
      comments: true,
      attachments: true,
      activities: true
    }
  });
  const membersRaw = await prisma.member.findMany();

  // Map workspaces
  const workspaces: Workspace[] = workspacesRaw.map((ws: any) => ({
    id: ws.id,
    name: ws.name,
    description: ws.description,
    emoji: ws.emoji
  }));

  // Map boards
  const boards: Board[] = boardsRaw.map((b: any) => ({
    id: b.id,
    name: b.name,
    workspaceId: b.workspaceId,
    background: b.background,
    emoji: b.emoji,
    butlerRules: (b.butlerRules || []).map((r: any) => ({
      id: r.id,
      trigger: r.trigger,
      action: r.action,
      active: r.active
    }))
  }));

  // Map lists
  const lists: List[] = listsRaw.map((l: any) => ({
    id: l.id,
    name: l.name,
    boardId: l.boardId,
    position: l.position
  }));

  // Map cards
  const cards: Card[] = cardsRaw.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    listId: c.listId,
    position: c.position,
    dueDate: c.dueDate,
    coverColor: c.coverColor,
    coverImage: c.coverImage,
    archived: c.archived,
    createdAt: c.createdAt.toISOString(),
    labels: c.labels.map((l: any) => ({
      color: l.color as any,
      text: l.text
    })),
    assignedTo: c.members.map((m: any) => m.name),
    checklists: c.checklists.map((ch: any) => ({
      id: ch.id,
      name: ch.name,
      items: ch.items.map((item: any) => ({
        id: item.id,
        text: item.text,
        completed: item.completed
      }))
    })),
    comments: c.comments.map((cm: any) => ({
      id: cm.id,
      author: cm.author,
      text: cm.text,
      createdAt: cm.createdAt.toISOString()
    })),
    attachments: c.attachments.map((att: any) => ({
      id: att.id,
      name: att.name,
      url: att.url,
      type: att.type
    })),
    activities: c.activities.map((act: any) => ({
      id: act.id,
      action: act.action,
      timestamp: act.timestamp.toISOString()
    }))
  }));

  const members = membersRaw.map((m: any) => m.name);

  return { workspaces, boards, lists, cards, members };
}

export async function writeDB(data: AppData): Promise<void> {
  // Use a transaction to ensure atomic updates
  await prisma.$transaction(async (tx: any) => {
    // 1. Sync workspaces
    const wsIds = data.workspaces.map(w => w.id);
    await tx.workspace.deleteMany({ where: { id: { notIn: wsIds } } });
    for (const ws of data.workspaces) {
      await tx.workspace.upsert({
        where: { id: ws.id },
        create: { id: ws.id, name: ws.name, description: ws.description, emoji: ws.emoji },
        update: { name: ws.name, description: ws.description, emoji: ws.emoji }
      });
    }

    // 2. Sync boards
    const boardIds = data.boards.map(b => b.id);
    await tx.board.deleteMany({ where: { id: { notIn: boardIds } } });
    for (const b of data.boards) {
      await tx.board.upsert({
        where: { id: b.id },
        create: { id: b.id, name: b.name, workspaceId: b.workspaceId, background: b.background, emoji: b.emoji },
        update: { name: b.name, background: b.background, emoji: b.emoji }
      });

      // Sync Butler Rules
      const rules = b.butlerRules || [];
      const ruleIds = rules.map(r => r.id);
      await tx.butlerRule.deleteMany({ where: { boardId: b.id, id: { notIn: ruleIds } } });
      for (const r of rules) {
        await tx.butlerRule.upsert({
          where: { id: r.id },
          create: { id: r.id, trigger: r.trigger, action: r.action, active: r.active, boardId: b.id },
          update: { trigger: r.trigger, action: r.action, active: r.active }
        });
      }
    }

    // 3. Sync lists
    const listIds = data.lists.map(l => l.id);
    await tx.list.deleteMany({ where: { id: { notIn: listIds } } });
    for (const l of data.lists) {
      await tx.list.upsert({
        where: { id: l.id },
        create: { id: l.id, name: l.name, boardId: l.boardId, position: l.position },
        update: { name: l.name, position: l.position }
      });
    }

    // 4. Sync cards and relations
    const cardIds = data.cards.map(c => c.id);
    await tx.card.deleteMany({ where: { id: { notIn: cardIds } } });
    for (const c of data.cards) {
      await tx.card.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          title: c.title,
          description: c.description || '',
          listId: c.listId,
          position: c.position,
          dueDate: c.dueDate,
          coverColor: c.coverColor,
          coverImage: c.coverImage,
          archived: c.archived || false,
          createdAt: new Date(c.createdAt)
        },
        update: {
          title: c.title,
          description: c.description || '',
          listId: c.listId,
          position: c.position,
          dueDate: c.dueDate,
          coverColor: c.coverColor,
          coverImage: c.coverImage,
          archived: c.archived || false
        }
      });

      // Sync CardLabels
      await tx.cardLabel.deleteMany({ where: { cardId: c.id } });
      if (c.labels) {
        for (const l of c.labels) {
          await tx.cardLabel.create({
            data: { cardId: c.id, color: l.color, text: l.text }
          });
        }
      }

      // Sync CardMembers
      await tx.cardMember.deleteMany({ where: { cardId: c.id } });
      if (c.assignedTo) {
        for (const m of c.assignedTo) {
          await tx.cardMember.create({
            data: { cardId: c.id, name: m }
          });
        }
      }

      // Sync Checklists
      const chs = c.checklists || [];
      const chIds = chs.map(ch => ch.id);
      await tx.checklist.deleteMany({ where: { cardId: c.id, id: { notIn: chIds } } });
      for (const ch of chs) {
        await tx.checklist.upsert({
          where: { id: ch.id },
          create: { id: ch.id, name: ch.name, cardId: c.id },
          update: { name: ch.name }
        });

        // Sync ChecklistItems
        const itemIds = ch.items.map(i => i.id);
        await tx.checklistItem.deleteMany({ where: { checklistId: ch.id, id: { notIn: itemIds } } });
        for (const item of ch.items) {
          await tx.checklistItem.upsert({
            where: { id: item.id },
            create: { id: item.id, text: item.text, completed: item.completed, checklistId: ch.id },
            update: { text: item.text, completed: item.completed }
          });
        }
      }

      // Sync Comments
      const comments = c.comments || [];
      const commentIds = comments.map(cm => cm.id);
      await tx.comment.deleteMany({ where: { cardId: c.id, id: { notIn: commentIds } } });
      for (const cm of comments) {
        await tx.comment.upsert({
          where: { id: cm.id },
          create: { id: cm.id, author: cm.author, text: cm.text, createdAt: new Date(cm.createdAt), cardId: c.id },
          update: { text: cm.text }
        });
      }

      // Sync Attachments
      const attachments = c.attachments || [];
      const attIds = attachments.map(a => a.id);
      await tx.attachment.deleteMany({ where: { cardId: c.id, id: { notIn: attIds } } });
      for (const att of attachments) {
        await tx.attachment.upsert({
          where: { id: att.id },
          create: { id: att.id, name: att.name, url: att.url, type: att.type, cardId: c.id },
          update: { name: att.name, url: att.url, type: att.type }
        });
      }

      // Sync Activities
      const activities = c.activities || [];
      const actIds = activities.map(a => a.id);
      await tx.activity.deleteMany({ where: { cardId: c.id, id: { notIn: actIds } } });
      for (const act of activities) {
        await tx.activity.upsert({
          where: { id: act.id },
          create: { id: act.id, action: act.action, timestamp: new Date(act.timestamp), cardId: c.id },
          update: { action: act.action }
        });
      }
    }

    // 5. Sync Members List
    for (const name of data.members) {
      await tx.member.upsert({
        where: { name },
        create: { name },
        update: {}
      });
    }
  });
}
