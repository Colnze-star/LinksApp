import type { ColumnType, Key } from 'antd/es/table/interface'; 
import {Button, Input} from 'antd';
import type { FilterDropdownProps } from '../model/filter';

const handleReset = (clearFilters?: () => void, confirm?: () => void) => {
  clearFilters?.();
  confirm?.();
};

export const getColumnSearchProps = <T,>(dataIndex: keyof T): ColumnType<T> => ({
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