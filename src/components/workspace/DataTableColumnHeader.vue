<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
import type { File } from './index'
// import {ArrowDownIcon} from '@radix-ui/react-icons'
// import {ArrowUpIcon} from '@radix-ui/react-icons'
// import {CaretSortIcon} from '@radix-ui/react-icons'
// import {EyeNoneIcon} from '@radix-ui/react-icons'

import { ChevronsUpDown  } from 'lucide-vue-next';
import { MoveUp   } from 'lucide-vue-next';
import { MoveDown  } from 'lucide-vue-next';
import { EyeOff   } from 'lucide-vue-next';

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps {
  column: Column<File, any>
  title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          class="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{{ title }}</span>
          <MoveDown v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-3" />
          <MoveUp v-else-if=" column.getIsSorted() === 'asc'" class="ml-2 h-4 w-3" />
          <ChevronsUpDown v-else class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <!-- <ArrowUpIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> -->
          <MoveUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          升序
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <!-- <ArrowDownIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> -->
          <MoveDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          降序
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="column.toggleVisibility(false)">
          <!-- <EyeNoneIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" /> -->
          <EyeOff class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          隐藏
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
