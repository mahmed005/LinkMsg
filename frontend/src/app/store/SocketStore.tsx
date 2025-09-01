"use client";

import { Socket } from "socket.io-client";
import { create } from "zustand";

export interface Message {
  [x: string]: any;
  message?: string;
  media: string[];
  from: string;
  to: string;
  groupId?: string;
  receiverId?: string;
  remainingReceivers?: string[];
}

export interface SocketStoreState {
  messages: Message[];
  socket: Socket | null;
  notifications: Message[];
  isFetching: boolean;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setNotifications: (notifications: Message[]) => void;
  addNotification: (notification: Message) => void;
  updateSocket: (socket: Socket) => void;
  clearNotifications: () => void;
}

export const socketStore = create<SocketStoreState>((set) => ({
  socket: null,
  messages: [],
  notifications: [],
  isFetching: true,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  setNotifications: (notifications) =>
    set({ notifications, isFetching: false }),
  updateSocket: (socket) => set({ socket: socket }),
  clearNotifications: () => set({ notifications: [] }),
}));
