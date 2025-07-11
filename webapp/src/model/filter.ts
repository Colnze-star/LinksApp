import type { Key } from 'antd/es/table/interface';

export type FilterDropdownProps = {
  setSelectedKeys: (keys: Key[]) => void;
  selectedKeys: Key[];
  confirm: () => void;
  clearFilters?: () => void;
}