'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, Card, List, Board, Workspace, ChecklistItem, Comment, Label, Activity, ButlerRule } from '@/lib/types';

type ViewType = 'board' | 'calendar' | 'timeline';

interface AppContextType {
  data: AppData | null;
  loading: boolean;
  selectedWorkspace: Workspace | null;
  selectedBoard: Board | null;
  selectedCard: Card | null;
  activeView: ViewType;
  commandPaletteOpen: boolean;
  setSelectedWorkspace: (ws: Workspace | null) => void;
  setSelectedBoard: (board: Board | null) => void;
  setSelectedCard: (card: Card | null) => void;
  setActiveView: (view: ViewType) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLabels: string[];
  setFilterLabels: (labels: string[]) => void;
  filterMembers: string[];
  setFilterMembers: (members: string[]) => void;

  addCard: (listId: string, title: string) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, targetListId: string, targetPosition: number) => void;
  addList: (boardId: string, name: string) => void;
  deleteList: (listId: string) => void;
  updateListName: (listId: string, name: string) => void;
  moveList: (listId: string, targetPosition: number) => void;
  addBoard: (workspaceId: string, name: string, background: string, emoji: string) => void;
  addComment: (cardId: string, author: string, text: string) => void;

  // Archive
  archiveCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;

  // Multi-checklist
  addChecklist: (cardId: string, name: string) => void;
  deleteChecklist: (cardId: string, checklistId: string) => void;
  renameChecklist: (cardId: string, checklistId: string, name: string) => void;
  addChecklistItemTo: (cardId: string, checklistId: string, text: string) => void;
  toggleChecklistItemIn: (cardId: string, checklistId: string, itemId: string) => void;

  // Butler Rules
  addButlerRule: (boardId: string, trigger: string, action: string) => void;
  deleteButlerRule: (boardId: string, ruleId: string) => void;

  getBoardLists: (boardId: string) => List[];
  getListCards: (listId: string) => Card[];
  getBoardCards: (boardId: string) => Card[];
  getWorkspaceBoards: (workspaceId: string) => Board[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const [filterMembers, setFilterMembers] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      const json: AppData = await res.json();
      setData(json);
      if (!selectedWorkspace && json.workspaces.length > 0) {
        setSelectedWorkspace(json.workspaces[0]);
      }
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-select first board when workspace changes
  useEffect(() => {
    if (data && selectedWorkspace) {
      const boards = data.boards.filter(b => b.workspaceId === selectedWorkspace.id);
      if (boards.length > 0 && (!selectedBoard || selectedBoard.workspaceId !== selectedWorkspace.id)) {
        setSelectedBoard(boards[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace, data]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setSelectedCard(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const persist = useCallback(async (newData: AppData) => {
    setData(newData);
    try {
      await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    } catch (e) {
      console.error('Failed to persist data:', e);
    }
  }, []);

  const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const addCard = useCallback((listId: string, title: string) => {
    if (!data) return;
    const listCards = data.cards.filter(c => c.listId === listId);
    const card: Card = {
      id: genId('c'),
      title,
      description: '',
      listId,
      position: listCards.length,
      dueDate: null,
      labels: [],
      assignedTo: [],
      checklists: [],
      comments: [],
      attachments: [],
      activities: [{ id: genId('act'), action: 'Card dibuat', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      archived: false,
    };
    const newData = { ...data, cards: [...data.cards, card] };
    persist(newData);
  }, [data, persist]);

  const updateCard = useCallback((card: Card) => {
    if (!data) return;
    const newData = { ...data, cards: data.cards.map(c => c.id === card.id ? card : c) };
    persist(newData);
    if (selectedCard?.id === card.id) {
      setSelectedCard(card);
    }
  }, [data, persist, selectedCard]);

  const deleteCard = useCallback((cardId: string) => {
    if (!data) return;
    const newData = { ...data, cards: data.cards.filter(c => c.id !== cardId) };
    persist(newData);
    if (selectedCard?.id === cardId) setSelectedCard(null);
  }, [data, persist, selectedCard]);

  // Butler Rule Runner
  const runButlerRules = useCallback((card: Card, triggerType: string, triggerDetail: string, currentData: AppData) => {
    const list = currentData.lists.find(l => l.id === card.listId);
    if (!list) return card;
    const board = currentData.boards.find(b => b.id === list.boardId);
    if (!board || !board.butlerRules) return card;

    let updatedCard = { ...card };
    let ruleFired = false;

    board.butlerRules.forEach(rule => {
      if (!rule.active) return;
      
      // Match trigger
      const triggerMatch = rule.trigger === `${triggerType}:${triggerDetail}` || rule.trigger === triggerType;
      if (!triggerMatch) return;

      ruleFired = true;

      // Apply Action
      if (rule.action === 'complete-all') {
        updatedCard.checklists = updatedCard.checklists.map(ch => ({
          ...ch,
          items: ch.items.map(item => ({ ...item, completed: true }))
        }));
        updatedCard.activities.push({
          id: genId('act'),
          action: `[Butler] Semua checklist ditandai selesai otomatis`,
          timestamp: new Date().toISOString()
        });
      } else if (rule.action.startsWith('add-label:')) {
        const color = rule.action.split(':')[1];
        if (!updatedCard.labels.some(l => l.color === color)) {
          updatedCard.labels.push({ color: color as any, text: 'Auto Label' });
          updatedCard.activities.push({
            id: genId('act'),
            action: `[Butler] Label ${color} ditambahkan otomatis`,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    return updatedCard;
  }, []);

  const moveCard = useCallback((cardId: string, targetListId: string, targetPosition: number) => {
    if (!data) return;
    const cards = [...data.cards];
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    let card = { ...cards[cardIndex] };
    const sourceListId = card.listId;
    card.listId = targetListId;
    card.position = targetPosition;

    // Run Butler Check for moving to list
    card = runButlerRules(card, 'move-list', targetListId, data);

    cards[cardIndex] = card;

    // Reorder source list
    if (sourceListId !== targetListId) {
      cards.filter(c => c.listId === sourceListId && c.id !== cardId)
        .sort((a, b) => a.position - b.position)
        .forEach((c, i) => {
          const idx = cards.findIndex(x => x.id === c.id);
          cards[idx] = { ...cards[idx], position: i };
        });
    }

    // Reorder target list
    const targetCards = cards.filter(c => c.listId === targetListId && c.id !== cardId)
      .sort((a, b) => a.position - b.position);
    targetCards.splice(targetPosition, 0, card);
    targetCards.forEach((c, i) => {
      const idx = cards.findIndex(x => x.id === c.id);
      cards[idx] = { ...cards[idx], position: i };
    });

    card.activities = [...card.activities, {
      id: genId('act'),
      action: sourceListId !== targetListId
        ? `Card dipindahkan ke ${data.lists.find(l => l.id === targetListId)?.name || 'list baru'}`
        : 'Card di-reorder',
      timestamp: new Date().toISOString(),
    }];

    persist({ ...data, cards });
  }, [data, persist, runButlerRules]);

  const addList = useCallback((boardId: string, name: string) => {
    if (!data) return;
    const boardLists = data.lists.filter(l => l.boardId === boardId);
    const list: List = {
      id: genId('l'),
      name,
      boardId,
      position: boardLists.length,
    };
    persist({ ...data, lists: [...data.lists, list] });
  }, [data, persist]);

  const deleteList = useCallback((listId: string) => {
    if (!data) return;
    const newData = {
      ...data,
      lists: data.lists.filter(l => l.id !== listId),
      cards: data.cards.filter(c => c.listId !== listId),
    };
    persist(newData);
  }, [data, persist]);

  const updateListName = useCallback((listId: string, name: string) => {
    if (!data) return;
    const newData = { ...data, lists: data.lists.map(l => l.id === listId ? { ...l, name } : l) };
    persist(newData);
  }, [data, persist]);

  const moveList = useCallback((listId: string, targetPosition: number) => {
    if (!data || !selectedBoard) return;
    const lists = data.lists.map(l => ({ ...l }));
    const boardLists = lists.filter(l => l.boardId === selectedBoard.id).sort((a, b) => a.position - b.position);
    const listIndex = boardLists.findIndex(l => l.id === listId);
    if (listIndex === -1) return;
    const [moved] = boardLists.splice(listIndex, 1);
    boardLists.splice(targetPosition, 0, moved);
    boardLists.forEach((l, i) => {
      const idx = lists.findIndex(x => x.id === l.id);
      lists[idx].position = i;
    });
    persist({ ...data, lists });
  }, [data, persist, selectedBoard]);

  const addBoard = useCallback((workspaceId: string, name: string, background: string, emoji: string) => {
    if (!data) return;
    const board: Board = { id: genId('b'), name, workspaceId, background, emoji, butlerRules: [] };
    const defaultLists: List[] = [
      { id: genId('l'), name: 'To Do 📌', boardId: board.id, position: 0 },
      { id: genId('l'), name: 'In Progress 🔧', boardId: board.id, position: 1 },
      { id: genId('l'), name: 'Done ✅', boardId: board.id, position: 2 },
    ];
    persist({ ...data, boards: [...data.boards, board], lists: [...data.lists, ...defaultLists] });
  }, [data, persist]);

  const addComment = useCallback((cardId: string, author: string, text: string) => {
    if (!data) return;
    const comment: Comment = { id: genId('cm'), author, text, createdAt: new Date().toISOString() };
    const cards = data.cards.map(c => c.id === cardId ? { ...c, comments: [...c.comments, comment] } : c);
    persist({ ...data, cards });
  }, [data, persist]);

  // Card Archiving
  const archiveCard = useCallback((cardId: string) => {
    if (!data) return;
    const cards = data.cards.map(c => c.id === cardId ? {
      ...c,
      archived: true,
      activities: [...c.activities, { id: genId('act'), action: 'Card diarsipkan', timestamp: new Date().toISOString() }]
    } : c);
    persist({ ...data, cards });
    if (selectedCard?.id === cardId) {
      setSelectedCard(null);
    }
  }, [data, persist, selectedCard]);

  const restoreCard = useCallback((cardId: string) => {
    if (!data) return;
    const cards = data.cards.map(c => c.id === cardId ? {
      ...c,
      archived: false,
      activities: [...c.activities, { id: genId('act'), action: 'Card dipulihkan dari arsip', timestamp: new Date().toISOString() }]
    } : c);
    persist({ ...data, cards });
  }, [data, persist]);

  // Multi-checklist
  const addChecklist = useCallback((cardId: string, name: string) => {
    if (!data) return;
    const cards = data.cards.map(c => {
      if (c.id !== cardId) return c;
      const checklists = c.checklists || [];
      return {
        ...c,
        checklists: [...checklists, { id: genId('ckl'), name: name || 'Checklist', items: [] }],
        activities: [...c.activities, { id: genId('act'), action: `Checklist "${name}" dibuat`, timestamp: new Date().toISOString() }]
      };
    });
    persist({ ...data, cards });
  }, [data, persist]);

  const deleteChecklist = useCallback((cardId: string, checklistId: string) => {
    if (!data) return;
    const cards = data.cards.map(c => {
      if (c.id !== cardId) return c;
      const ch = c.checklists.find(x => x.id === checklistId);
      return {
        ...c,
        checklists: c.checklists.filter(x => x.id !== checklistId),
        activities: [...c.activities, { id: genId('act'), action: `Checklist "${ch?.name || ''}" dihapus`, timestamp: new Date().toISOString() }]
      };
    });
    persist({ ...data, cards });
  }, [data, persist]);

  const renameChecklist = useCallback((cardId: string, checklistId: string, name: string) => {
    if (!data) return;
    const cards = data.cards.map(c => {
      if (c.id !== cardId) return c;
      return {
        ...c,
        checklists: c.checklists.map(x => x.id === checklistId ? { ...x, name } : x)
      };
    });
    persist({ ...data, cards });
  }, [data, persist]);

  const addChecklistItemTo = useCallback((cardId: string, checklistId: string, text: string) => {
    if (!data) return;
    const cards = data.cards.map(c => {
      if (c.id !== cardId) return c;
      return {
        ...c,
        checklists: c.checklists.map(ch => ch.id === checklistId ? {
          ...ch,
          items: [...ch.items, { id: genId('ck'), text, completed: false }]
        } : ch)
      };
    });
    persist({ ...data, cards });
  }, [data, persist]);

  const toggleChecklistItemIn = useCallback((cardId: string, checklistId: string, itemId: string) => {
    if (!data) return;
    const cards = data.cards.map(c => {
      if (c.id !== cardId) return c;
      let newChecklists = c.checklists.map(ch => {
        if (ch.id !== checklistId) return ch;
        return {
          ...ch,
          items: ch.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        };
      });

      const checkedItem = newChecklists.find(ch => ch.id === checklistId)?.items.find(i => i.id === itemId);
      let activities = [...c.activities, {
        id: genId('act'),
        action: `Item "${checkedItem?.text || ''}" ${checkedItem?.completed ? 'diselesaikan' : 'dibatalkan'}`,
        timestamp: new Date().toISOString()
      }];

      let updatedCard = { ...c, checklists: newChecklists, activities };

      // Butler trigger: checklists-done
      const allCompleted = newChecklists.every(ch => ch.items.every(item => item.completed));
      if (allCompleted && newChecklists.some(ch => ch.items.length > 0)) {
        updatedCard = runButlerRules(updatedCard, 'checklists-done', '', data);
      }

      return updatedCard;
    });

    persist({ ...data, cards });
  }, [data, persist, runButlerRules]);

  // Butler Rules DB operations
  const addButlerRule = useCallback((boardId: string, trigger: string, action: string) => {
    if (!data) return;
    const boards = data.boards.map(b => {
      if (b.id !== boardId) return b;
      const rules = b.butlerRules || [];
      return {
        ...b,
        butlerRules: [...rules, { id: genId('rule'), trigger, action, active: true }]
      };
    });
    persist({ ...data, boards });
  }, [data, persist]);

  const deleteButlerRule = useCallback((boardId: string, ruleId: string) => {
    if (!data) return;
    const boards = data.boards.map(b => {
      if (b.id !== boardId) return b;
      const rules = b.butlerRules || [];
      return {
        ...b,
        butlerRules: rules.filter(r => r.id !== ruleId)
      };
    });
    persist({ ...data, boards });
  }, [data, persist]);

  const getBoardLists = useCallback((boardId: string) => {
    if (!data) return [];
    return data.lists.filter(l => l.boardId === boardId).sort((a, b) => a.position - b.position);
  }, [data]);

  const getListCards = useCallback((listId: string) => {
    if (!data) return [];
    // Only return unarchived cards
    return data.cards.filter(c => c.listId === listId && !c.archived).sort((a, b) => a.position - b.position);
  }, [data]);

  const getBoardCards = useCallback((boardId: string) => {
    if (!data) return [];
    const listIds = data.lists.filter(l => l.boardId === boardId).map(l => l.id);
    // Only return unarchived cards
    return data.cards.filter(c => listIds.includes(c.listId) && !c.archived);
  }, [data]);

  const getWorkspaceBoards = useCallback((workspaceId: string) => {
    if (!data) return [];
    return data.boards.filter(b => b.workspaceId === workspaceId);
  }, [data]);

  return (
    <AppContext.Provider value={{
      data,
      loading,
      selectedWorkspace,
      selectedBoard,
      selectedCard,
      activeView,
      commandPaletteOpen,
      setSelectedWorkspace,
      setSelectedBoard,
      setSelectedCard,
      setActiveView,
      setCommandPaletteOpen,

      searchQuery,
      setSearchQuery,
      filterLabels,
      setFilterLabels,
      filterMembers,
      setFilterMembers,

      addCard,
      updateCard,
      deleteCard,
      moveCard,
      addList,
      deleteList,
      updateListName,
      moveList,
      addBoard,
      addComment,

      archiveCard,
      restoreCard,

      addChecklist,
      deleteChecklist,
      renameChecklist,
      addChecklistItemTo,
      toggleChecklistItemIn,

      addButlerRule,
      deleteButlerRule,

      getBoardLists,
      getListCards,
      getBoardCards,
      getWorkspaceBoards,
      refreshData: fetchData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
