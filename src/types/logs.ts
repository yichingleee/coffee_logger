import { Database } from '@/types/database.types'

export type LogWithRelations = Pick<
    Database['public']['Tables']['logs']['Row'],
    | 'id'
    | 'created_at'
    | 'device'
    | 'grind_setting'
    | 'dose'
    | 'ratio'
    | 'bloom_time'
    | 'total_time'
    | 'notes'
> & {
    beans: { name: string; roaster: string | null } | null
    grinders: { name: string } | null
    methods: { name: string } | null
}
