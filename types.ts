export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string; // Base64 string
  isThinking?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  prompt: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
