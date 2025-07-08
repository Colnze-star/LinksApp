import { useState, useEffect } from 'react'
import { getLinks } from '../mocks/links';
import type { Link } from '../model/link';


const Links = () => {
    const [links, setLinks] = useState<Link[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
   
    
    useEffect(() => {
      getLinks()
        .then((data) => setLinks(data))
        .catch((error) => console.error(error));
    }, []);
  
    console.log(links);

    const handleEdit = (link: Link) => { // изменение оригинальной ссылки
      setEditingId(link.id);
      setEditValue(link.originalUrl);
    };

    const handleSave = (id: number) => {
        setLinks(links.map(link => 
        link.id === id ? { ...link, originalUrl: editValue, updatedAt: new Date() } : link
        ));
        setEditingId(null);
        // API-запрос на сохранение изменений
    };

    const handleDelete = (id: number) => {
        setLinks(links.filter(link => link.id !== id)); // API-запрос на удаление       
    };

    const handleShortLinkClick = async (event: React.MouseEvent, shortCode: string) => { 
    event.preventDefault(); 
    const originalUrl = "https://react.dev/learn/typescript"; // API-запрос на редирект
    window.open(originalUrl, '_blank');
  };

    // Функция для форматирования даты
    const formatDate = (date: Date) => {
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
      
      return (
      <div>
      <table>
        <thead>
          <tr>
            <th>Оригинальный URL</th>
            <th>Короткая ссылка</th>
            <th>Дата создания</th>
            <th>Дата обновления</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>
                {editingId === link.id ? (
                  <input
                    type="text"                 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                    {link.originalUrl}
                  </a>
                )}
              </td>
              <td>
                <a href="#" onClick={(e) => handleShortLinkClick(e, link.shortCode)}>
                  {window.location.host}/{link.shortCode}                
                </a>
              </td>
              <td>
                  {formatDate(link.createdAt)}
              </td>
              <td>
                  {formatDate(link.updatedAt)}
                  {link.updatedAt > link.createdAt && (
                      <span> (изменено)</span>
                  )}
              </td>
              <td>
                {editingId === link.id ? (
                  <>
                    <button onClick={() => handleSave(link.id)}> Сохранить </button>
                    <button onClick={() => setEditingId(null)}> Отмена </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(link)}> Изменить </button>
                    <button onClick={() => handleDelete(link.id)}> Удалить </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default  Links;