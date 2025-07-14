import { ActivityFeedEvent } from "@/lib/domain";
import { atomWithToggleAndStorage } from "@/lib/jotai/atomWithToggleAndStorage";
import { atom } from "jotai";
import { atomWithReducer } from "jotai/utils";
import { produce } from "immer";
import { match } from "ts-pattern";

export type ActivityFeedEventItem = ActivityFeedEvent & { id: string; at: Date };

export const activityFeedCollapsedAtom = atomWithToggleAndStorage('activity-feed.collapsed', false);

// --- State and Actions ---
type ActivityFeedState = {
  events: ActivityFeedEventItem[];
  unseen: number;
};

type ActivityFeedAction =
  | { type: 'pushEvent'; event: ActivityFeedEvent; isCollapsed: boolean }
  | { type: 'reset' };

const initialActivityFeedState: ActivityFeedState = {
  events: [],
  unseen: 0,
};

const activityFeedReducer = produce((draft: ActivityFeedState, action: ActivityFeedAction) => {
  match(action)
    .with({ type: 'pushEvent' }, ({ event, isCollapsed }) => {
      const at = new Date();
      const id = Math.random().toString(36).slice(2) + at.getTime().toString(36);
      const newEvent: ActivityFeedEventItem = { ...event, id, at };
      draft.events.unshift(newEvent);
      if (isCollapsed) {
        draft.unseen += 1;
      }
    })
    .with({ type: 'reset' }, () => {
      draft.events = [];
      draft.unseen = 0;
    })
    .exhaustive();
});

export const activityFeedReducerAtom = atomWithReducer(initialActivityFeedState, activityFeedReducer);

// --- Selectors ---
export const activityFeedEventsAtom = atom((get) => (get(activityFeedReducerAtom) as ActivityFeedState).events);
export const unseenEventsAtom = atom((get) => (get(activityFeedReducerAtom) as ActivityFeedState).unseen);


// TODO: add global side efect with jotai-effect to reset unseen when activityFeedCollapsedAtom is set to false
