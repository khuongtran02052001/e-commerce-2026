'use client';

import { create } from 'zustand';

export type AssistantTopic =
  | 'purchase_flow'
  | 'after_checkout'
  | 'payment_cod'
  | 'who_confirms'
  | 'admin_flow';

interface AssistantStore {
  isHovered: boolean;
  isOpen: boolean;
  activeTopic: AssistantTopic;
  setHovered: (value: boolean) => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setTopic: (topic: AssistantTopic) => void;
}

export const useAssistantStore = create<AssistantStore>((set) => ({
  isHovered: false,
  isOpen: false,
  activeTopic: 'purchase_flow',
  setHovered: (value) => set({ isHovered: value }),
  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setTopic: (topic) => set({ activeTopic: topic }),
}));
