import { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Grinder = Database['public']['Tables']['grinders']['Row']
export type Method = Database['public']['Tables']['methods']['Row']
export type Bean = Database['public']['Tables']['beans']['Row']
export type BrewLog = Database['public']['Tables']['logs']['Row']

// Extended types for joins commonly used in the app
export type BrewLogWithDetails = BrewLog & {
    beans: Pick<Bean, 'name' | 'roaster'> | null
    grinders: Pick<Grinder, 'name'> | null
    methods: Pick<Method, 'name'> | null
}
