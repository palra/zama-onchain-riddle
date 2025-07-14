import { ActivityFeedEvent } from "@/lib/domain";
import { atomWithToggleAndStorage } from "@/lib/jotai/atomWithToggleAndStorage";
import { produce } from "immer";
import { atom } from "jotai";
import { observe } from "jotai-effect";
import { atomWithReducer } from "jotai/utils";
import { match } from "ts-pattern";

export type ActivityFeedEventItem = ActivityFeedEvent & { id: string; at: Date };

export const activityFeedCollapsedAtom = atomWithToggleAndStorage('activity-feed.collapsed', false);

// --- State and Actions ---
type ActivityFeedState = {
  events: ActivityFeedEventItem[];
  unseen: number;
  _countUnseen: boolean;
};

type ActivityFeedAction =
  | { type: 'pushEvent'; event: ActivityFeedEvent; }
  | { type: '_resetUnseen' }
  | { type: '_setCountUnseen', countUnseen: boolean }
  ;

const initialActivityFeedState: ActivityFeedState = {
  events: [],
  unseen: 0,
  _countUnseen: true,
};

const activityFeedReducer = produce((draft: ActivityFeedState, action: ActivityFeedAction) => {
  match(action)
    .with({ type: 'pushEvent' }, ({ event }) => {
      const at = new Date();
      const id = Math.random().toString(36).slice(2) + at.getTime().toString(36);
      const newEvent: ActivityFeedEventItem = { ...event, id, at };
      draft.events.unshift(newEvent);

      if (draft._countUnseen) {
        draft.unseen += 1;
      }
    })
    .with({ type: '_resetUnseen' }, () => {
      draft.unseen = 0;
    })
    .with({ type: '_setCountUnseen' }, ({ countUnseen }) => {
      draft._countUnseen = countUnseen;
    })
    .exhaustive();
});

export const activityFeedReducerAtom = atomWithReducer(initialActivityFeedState, activityFeedReducer);

// --- Selectors ---
export const activityFeedEventsAtom = atom((get) => (get(activityFeedReducerAtom) as ActivityFeedState).events);
export const unseenEventsAtom = atom((get) => (get(activityFeedReducerAtom) as ActivityFeedState).unseen);

// --- Global side effects ---

observe((get, set) => {
  const isCollapsed = get(activityFeedCollapsedAtom);
  if (!isCollapsed) {
    set(activityFeedReducerAtom, { type: "_resetUnseen" });
  }

  set(activityFeedReducerAtom, { type: '_setCountUnseen', countUnseen: isCollapsed });
});


