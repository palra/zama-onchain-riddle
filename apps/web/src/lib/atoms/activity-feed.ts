import { ActivityFeedEvent } from "@/lib/domain";
import { atomWithToggleAndStorage } from "@/lib/jotai/atomWithToggleAndStorage";
import { atom } from "jotai";
import { observe } from "jotai-effect";
import { atomWithImmer } from "jotai-immer";

export type ActivityFeedEventItem = ActivityFeedEvent & { id: string; at: Date };

export const activityFeedCollapsedAtom = atomWithToggleAndStorage('activity-feed.collapsed', false);

// --- State ---
type ActivityFeedState = {
  events: ActivityFeedEventItem[];
  unseen: number;
  _countUnseen: boolean;
};

const initialActivityFeedState: ActivityFeedState = {
  events: [],
  unseen: 0,
  _countUnseen: true,
};

export const activityFeedAtom = atomWithImmer<ActivityFeedState>(initialActivityFeedState);

// --- Immer-style updaters ---
export const pushEventAtom = atom(null, (get, set, event: ActivityFeedEvent) => {
  set(activityFeedAtom, (draft) => {
    const at = new Date();
    const id = Math.random().toString(36).slice(2) + at.getTime().toString(36);
    const newEvent: ActivityFeedEventItem = { ...event, id, at };
    draft.events.unshift(newEvent);
    if (draft._countUnseen) {
      draft.unseen += 1;
    }
  });
});

export const resetUnseenAtom = atom(null, (get, set) => {
  set(activityFeedAtom, (draft) => {
    draft.unseen = 0;
  });
});

export const setCountUnseenAtom = atom(null, (get, set, countUnseen: boolean) => {
  set(activityFeedAtom, (draft) => {
    draft._countUnseen = countUnseen;
  });
});

// --- Selectors ---
export const activityFeedEventsAtom = atom((get) => get(activityFeedAtom).events);
export const unseenEventsAtom = atom((get) => get(activityFeedAtom).unseen);

// --- Global side effects ---
observe((get, set) => {
  const isCollapsed = get(activityFeedCollapsedAtom);
  if (!isCollapsed) {
    set(resetUnseenAtom);
  }
  set(setCountUnseenAtom, isCollapsed);
});


