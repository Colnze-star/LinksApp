import type { Link } from '../model/link';


let Links: Link[] = [
  {
    id: 1,
    originalUrl: "https://www.google.com/search?q=typescript+tutorial",
    shortCode: "googts",
    createdAt: new Date('2023-01-15T10:30:00'),
    updatedAt: new Date('2023-01-15T10:30:00')
  },
  {
    id: 2,
    originalUrl: "https://github.com/features/copilot",
    shortCode: "ghcop",
    createdAt: new Date('2023-02-20T14:15:00'),
    updatedAt: new Date('2023-03-10T09:45:00') 
  },
  {
    id: 3,
    originalUrl: "https://stackoverflow.com/questions/tagged/typescript",
    shortCode: "sots",
    createdAt: new Date('2023-03-05T08:00:00'),
    updatedAt: new Date('2023-03-05T08:00:00')
  },
  {
    id: 4,
    originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    shortCode: "ytfun",
    createdAt: new Date('2023-04-01T18:20:00'),
    updatedAt: new Date('2023-04-03T11:10:00') 
  },
  {
    id: 5,
    originalUrl: "https://www.typescriptlang.org/docs/",
    shortCode: "tsdoc",
    createdAt: new Date('2023-05-12T12:00:00'),
    updatedAt: new Date('2023-05-12T12:00:00')
  }
];

// Функция-заглушка для POST /shortCode
export const getShortCode = (originalUrl: string): Promise<string> => {
  // алгоритм короткого кода
  return new Promise((resolve) => {
    let code = Math.random().toString(36).substring(2, 8); // ...
    setTimeout(() => resolve(code), 250); 
  });

}

// Функция-заглушка для GET /links
export const getLinks = (): Promise<Link[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Links), 250); // Имитация задержки сети
  });
};

