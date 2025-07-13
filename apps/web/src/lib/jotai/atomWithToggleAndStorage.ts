import { WritableAtom, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export function atomWithToggleAndStorage(
  key: string,
  initialValue?: boolean,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atomWithStorage(key, initialValue)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      void set(anAtom, update)
    },
  )

  return derivedAtom as WritableAtom<boolean, [boolean?], void>
}