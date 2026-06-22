export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Activity {
  id: string;
  action: string;
  timestamp: string;
}

export type LabelColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface Label {
  color: LabelColor;
  text: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  position: number;
  dueDate: string | null;
  labels: Label[];
  assignedTo: string[];
  checklists: { id: string; name: string; items: ChecklistItem[] }[];
  comments: Comment[];
  attachments: Attachment[];
  activities: Activity[];
  createdAt: string;
  coverColor?: string | null;
  coverImage?: string | null;
  archived?: boolean;
}

export interface List {
  id: string;
  name: string;
  boardId: string;
  position: number;
}

export interface ButlerRule {
  id: string;
  trigger: string; // e.g. "move-list:[listId]" or "checklists-done"
  action: string;  // e.g. "complete-all" or "add-label:[labelColor]"
  active: boolean;
}

export interface Board {
  id: string;
  name: string;
  workspaceId: string;
  background: string;
  emoji: string;
  butlerRules?: ButlerRule[];
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface AppData {
  workspaces: Workspace[];
  boards: Board[];
  lists: List[];
  cards: Card[];
  members: string[];
}

