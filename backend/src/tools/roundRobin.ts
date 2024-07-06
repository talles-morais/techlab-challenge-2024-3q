let currentIndex = 0;

export function getNextIndex(length: number): number {
  if (length === 0) return -1;

  const index = currentIndex;
  currentIndex = (currentIndex + 1) % length;
  return index;
}