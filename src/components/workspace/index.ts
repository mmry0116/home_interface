import { z } from 'zod'

export const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  path: z.string(),
  size: z.string(),
  sortPriority: z.number(),
  creationTime: z.string(),
  lastModifiedTime: z.string(),
  lastAccessTime: z.string(),
})

export interface dFile {
  name: string,
  path: string,
  size: number,
  status?: string, //下载状态
  loaded?: number,//已经下载的字节数
  precent?: number
}

export type File = z.infer<typeof fileSchema>