import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { getLinks } from '../features/links';
import type { Link } from '../entities/model/link';
import { formatDate } from "../shared/format";
import type { ColumnType, Key } from 'antd/es/table/interface';

const Links: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  interface FilterDropdownProps {
    setSelectedKeys: (keys: Key[]) => void;
    selectedKeys: Key[];
    confirm: () => void;
    clearFilters?: () => void;
}

  useEffect(() => {
    getLinks()
      .then((data) => setLinks(data))
      .catch((error) => console.error(error));
  }, []);

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

  const handleReset = (clearFilters?: () => void, confirm?: () => void) => {
    clearFilters?.();
    confirm?.();
  };

  const getColumnSearchProps = <T,>(dataIndex: keyof T): ColumnType<T> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${String(dataIndex)}`}
        value={selectedKeys[0] as string}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90, marginRight: 8 }}> Поиск </Button>
      <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }} > Сброс </Button>
    </div>
  ),
  onFilter: (value: boolean | Key, record: T) => {
    const recordValue = record[dataIndex];
    return String(recordValue)
      .toLowerCase()
      .includes(String(value).toLowerCase());
  },
});

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