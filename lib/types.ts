export type Messages={
    id: string;
    content: string;
    role: 'user' | 'system';
    createdAt: string;
}

export type Chat={
    id: string;
    createdAt: string;
    messages: Messages[];
}

export type ChatContextType={
    currentChat: number | null
}
export type InitialMessageContext={
    content: string
}
