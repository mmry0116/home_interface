import { ColumnDef } from "@tanstack/vue-table"
import { h } from 'vue'
import { types } from './data'
import { File } from './index'
// import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { formatFileSize } from "@/tool/mmryUtil"
import DataTableColumnHeader from "./DataTableColumnHeader.vue"
import DataUpdate from "./DataUpdate.vue"


export const columns: ColumnDef<File>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
      'class': 'translate-y-0.5 h-5 w-5 pl-2',
    }),
    cell: ({ row }) => h(Checkbox, {
      'checked': row.getIsSelected(),
      'onUpdate:checked': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
      'class': 'translate-y-0.5 h-5 w-5 pl-2'
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'type',
    accessorKey: 'type',
    // header: ({ column }) => h('div', { class: 'pl-6 h-10 w-6' }, '类型'),
    header: '',
    // header: () => h('span', { class: 'pl-0 pr-0 mr-0' }, '类型'),
    cell: ({ row }) => {
      const type = types.find(
        status => status.value === row.getValue('type'),
      )
      if (!type)
        return null

      // return h('div', { class: 'flex w-[30px] items-center' }, [
      return h('div', { class: 'translate-y-0   items-center' }, [
        type.icon && h(type.icon, { class: 'pl-0 pr-0 mr-0 h-6 w-6' }),
        // h('span', type.label),
      ])
    },
    filterFn: (row, id, value) => {
      let flag = false;
      flag = value.includes(row.getValue(id))
      //如果检索标记为false 那么在判断该row的文件类型是否是文件
      //如果是文件则判断是检索内容是否有文件的类型
      if (!flag && 'video-music-image'.includes(row.getValue('type'))) {
        return value.includes('file')
      }
      return flag;
    },
    enableHiding: false,
  },
  {
    id: 'id',
    // header: '修改时间',
    header: '',
    // accessorFn: (row) => `${row.name}`, 

    // enableSorting: false,
    // enableColumnFilter: false,
    // enableHiding: false,
    // enableGlobalFilter: false
  },
  {
    id: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '文件名', class: 'pl-0 h-6 ' }),
    accessorKey: 'name',
    cell: ({ row, table }) => h(DataUpdate, { 'row': row, 'table': table, class: 'ml-0 pl-0  ' },)
  },
  {
    id: 'path',
    header: '路径',
    accessorKey: 'path',
    enableSorting: false,
    // enableColumnFilter: false
    enableHiding: true,
    // enableGlobalFilter: false
  },
  {
    id: '修改时间',
    // header: '修改时间',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '修改时间', class: 'pl-4 h-6 ' }),
    accessorFn: row => `${row.lastModifiedTime.substring(0, 16)}`,

  },
  {
    id: '创建时间',
    // header: '创建时间',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '创建时间', class: 'pl-4 h-6 ' }),
    accessorFn: row => `${row.lastModifiedTime.substring(0, 16)}`,
  },
  {
    id: '最后访问',
    // header: '最后访问',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '最后访问', class: 'pl-4 h-6 ' }),
    accessorFn: row => `${row.lastAccessTime.substring(0, 16)}`,
  },
  {
    id: '大小',
    // header: '大小',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: '大小', class: 'pl-2 h-6 ' }),
    accessorKey: 'size',
    accessorFn: row => `${row.type == 'hide_directory' || row.type == 'directory' ? '-' : formatFileSize(Number(row.size))}`,
    // cell: info => info.getValue() == '0B' ? '-' : info.getValue(),
  },
  // {
  //   header: '优先级',
  //   accessorKey: 'sortPriority',
  //   enableSorting: false,
  //   enableHiding: true,
  // },

]