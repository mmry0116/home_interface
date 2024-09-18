<template>
  <div class="space-y-4 "  >
    <DataTableToolbar :table="table" :filterr="filterr"/>
    <!-- <input placeholder="aaaa" v-model="filter"> -->
    <div class="rounded-md border  " >
      <Table >
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <!-- <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" /> -->
              <FlexRender   :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
              
            >
              <template v-for="cell in row.getVisibleCells()" :key="cell.id">
                <TableCell v-if="  cell.column.id == 'name' " id="tableCell" class="pl-0  ">
                  <FlexRender  id="flexRender" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
                <TableCell v-else id="tableCell" >
                  <FlexRender id="flexRender" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </template>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              这儿什么都没有
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <DataTablePagination :table="table" />
  </div>

</template>

<script setup lang="ts">
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from '@/components/ui/table';
import { valueUpdater } from '@/lib/utils';
import type {
ColumnDef,
ColumnFiltersState,
SortingState,
VisibilityState,
} from '@tanstack/vue-table';
import {
FlexRender,
getCoreRowModel,
getFacetedRowModel,
getFacetedUniqueValues,
getFilteredRowModel,
getPaginationRowModel,
getSortedRowModel,
useVueTable,
} from '@tanstack/vue-table';
import { onBeforeMount, ref } from 'vue';
import { z } from 'zod';
import DataTablePagination from './DataTablePagination.vue';
import DataTableToolbar from './DataTableToolbar.vue';
import { File } from './index';
// import {useDataStore} from '@/store/data'

const props = defineProps<DataTablePropps>()
const sorting = ref<SortingState>([]) //
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({}) 
const filter = ref('') //全局搜索引用的变量

function filterr(value:string){
  filter.value=value
}

interface DataTablePropps{
  columns: ColumnDef<File,any>[],
  data: File[]
}

const table = useVueTable({
  get data() { return props.data},
  get columns() {return props.columns},
  //state属性 tanstack代理了这些state 一旦发生改变就会被察觉
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get globalFilter(){ return filter.value}
  },
  initialState:{
    //翻页 设置
    pagination:{
      pageSize: 20,
    }
  },
  enableRowSelection: true, //行选择开启
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),

  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  //通过列的值 来过滤数据
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  //控制列是否可见
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),

  getCoreRowModel: getCoreRowModel(),               //核心行model
  getFilteredRowModel: getFilteredRowModel(),       //行过滤model
  getPaginationRowModel: getPaginationRowModel(),   //翻页model
  getSortedRowModel: getSortedRowModel(),           //行排序model

  getFacetedRowModel: getFacetedRowModel(),         //数据分组model
  getFacetedUniqueValues: getFacetedUniqueValues(), //获取某个组的成员数量model

})

let fileEntityResult =  z.object({
  // path:z.string(),
  // data: z.object({})
  data: z.array(z.object({name:z.string()}))
  
})


onBeforeMount(()=>{
  //  updatePath({path:'M:/tomcat-10.1.7'}).then((response)=>{
  //    let parse =  fileEntityResult.parse(response.data)
  //    console.log("files: ", parse)
  //  }).catch(()=>{})
  table.getColumn('type')?.setFilterValue(['file','directory' ])   
  
  table.getColumn("最后访问")?.toggleVisibility(false)
  table.getColumn("id")?.toggleVisibility(false)
  table.getColumn("path")?.toggleVisibility(false)
  // table.getColumn("sortPriority")?.toggleVisibility(false)

})


</script>


<style scoped>
#flexRender{
  /* border: red solid 2px; */
}
#tableCell{
  /* border: blue solid 2px; */
  /* padding: 0px; */
}
 
</style>