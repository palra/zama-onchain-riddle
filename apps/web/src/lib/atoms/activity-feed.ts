import { ActivityFeedEvent } from "@/lib/domain";
import { atomWithToggleAndStorage } from "@/lib/jotai/atomWithToggleAndStorage";
import { atom } from "jotai";
import { observe } from 'jotai-effect';
import { atomWithDefault, RESET } from "jotai/utils";

export type ActivityFeedEventItem = ActivityFeedEvent & { id: string; at: Date };

export const activityFeedAtom = atom<ActivityFeedEventItem[]>([]);

export const activityFeedCollapsedAtom = atomWithToggleAndStorage('activity-feed.collapsed', false);
export const unseenEventsAtom = atomWithDefault(() => 0);

export const pushEventAtom = atom(
  null,
  (get, set, event: ActivityFeedEvent) => {
    const at = new Date();
    const id = Math.random().toString(36).slice(2) + at.getTime().toString(36);
    set(activityFeedAtom, [{ ...event, id, at: new Date() }, ...get(activityFeedAtom)]);

    // Count unseen events
    const isCollapsed = get(activityFeedCollapsedAtom);
    if (!isCollapsed) return;
    set(unseenEventsAtom, get(unseenEventsAtom) + 1);
  }
);

export const resetActivityFeedAtom = atom(
  null,
  (get, set) => set(activityFeedAtom, [])
)

observe((get, set) => {
  const isCollapsed = get(activityFeedCollapsedAtom);
  if (!isCollapsed) set(unseenEventsAtom, RESET);
})