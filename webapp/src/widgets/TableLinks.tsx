import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { api } from '../features/api';
import type { ApiResponse } from '../model/link';
import type { Link } from '../model/link';
import { formatDate } from "../shared/format";
import { getColumnSearchProps } from '../features/search-props';
import '../App.css'

const Links: React.FC = () => {

  const [links, setLinks] = useState<Link[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await api.get<ApiResponse>('links/all', { 
        params: {
          page: 0,
          size: 5,
          sort: 'desc',
        },
      });
        const linksWithDates = response.data.content.map(link => ({
      ...link,
      createdAt: new Date(link.createdAt),  
      updatedAt: new Date(link.updatedAt),  
    }));
      setLinks(linksWithDates);
      setLoading(false);
    } catch (error) {
      setError('Не удалось загрузить данные');
      setLoading(false);
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  if (loading) return <div className='message'>Загрузка...</div>;
  if (error) return <div  className='message'>{error}</div>;

  const handleEdit = (link: Link) => { 
    setEditingId(link.id);
    setEditValue(link.originalUrl);
  };

  const handleSave = (id: number) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, originalUrl: editValue, updatedAt: new Date() } : link
    ));
    setEditingId(null); // API-запрос на сохранение изменений
  };

  const handleDelete = (id: number) => {
    setLinks(links.filter(link => link.id !== id)); 
    // API-запрос на удаление      
  };

  const handleShortLinkClick = (shortCode: string) => {
    const originalUrl = "https://react.dev/learn/typescript"; // API-запрос на редирект
    window.open(originalUrl, '_blank');
  };

const columns: TableColumnsType<Link> = [
  {
    title: 'Оригинальный URL',
    dataIndex: 'originalUrl',
    ...getColumnSearchProps('originalUrl'),
    render: (text: string, record: Link) => {
      if (editingId === record.id) {
        return (
          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ width: '100%' }} />
        );
      }
      return (
        <a href={record.originalUrl} target="_blank" rel="noopener noreferrer">
          {record.originalUrl}
        </a>
      );
    },
  },
  {
    title: 'Короткая ссылка',
    dataIndex: 'shortCode',
    ...getColumnSearchProps('shortCode'),
    render: (text: string) => (
      <a onClick={() => handleShortLinkClick(text)}>
        {`${window.location.host}/${text}`}
      </a>
    ),
  },
  {
    title: 'Дата создания',
    dataIndex: 'createdAt',
    render: (date: Date) => formatDate(date),
    sorter: (a: Link, b: Link) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  },
  {
    title: 'Дата обновления',
    dataIndex: 'updatedAt',
    render: (date: Date, record: Link) => (
      <>
        {formatDate(date)}
        {record.updatedAt > record.createdAt && (
          <Tag color="blue" style={{ marginLeft: 8 }}>изменено</Tag>
        )}
      </>
    ),
    sorter: (a: Link, b: Link) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  },
  {
    title: 'Действия',
    render: (_: unknown, record: Link): React.ReactNode => {
      if (editingId === record.id) {
        return (
          <>
            <Button type="link" onClick={() => handleSave(record.id)}> Сохранить </Button>
            <Button danger onClick={() => setEditingId(null)}> Отмена </Button>
          </>
        );
      }
      return (
        <>
          <Button type="link" onClick={() => handleEdit(record)}> Изменить </Button>
          <Button danger onClick={() => handleDelete(record.id)}> Удалить </Button>
        </>
      );
    },
  },
];

  return (
    <div style={{ marginTop: 20}} >
      <Table<Link>
        columns={columns}
        dataSource={links}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};


export default Links;