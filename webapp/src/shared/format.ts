export const formatDate = (date: string | Date): string => {
  if (!date) return "—";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Обновлений не было";
  return dateObj.toLocaleString("ru-RU");
};

