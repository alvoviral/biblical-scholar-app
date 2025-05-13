
import { Hymn } from "@/types/hymn";

// This is a fallback data source if the API is not available
export const sampleHymns: Hymn[] = Array.from({ length: 640 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  title: `Hino ${i + 1}`,
  verses: [
    `Exemplo de letra do hino ${i + 1}.`,
    `Segunda linha do hino ${i + 1}.`,
    `Terceira linha do hino ${i + 1}.`,
    `Quarta linha do hino ${i + 1}.`
  ]
}));
