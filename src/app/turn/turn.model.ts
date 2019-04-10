export interface Turn {
  id: string;
  label: string;
  icon: string;
  candidates: ReadonlyArray<string>;
  currentIndex: number;
}
