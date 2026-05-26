type StreakListener = () => void;

const listeners = new Set<StreakListener>();

export function subscribeToStreakChanges(listener: StreakListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyStreakChanged(): void {
  listeners.forEach((listener) => listener());
}
