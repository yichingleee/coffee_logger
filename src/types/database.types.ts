export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    temp_preference: 'celsius' | 'fahrenheit'
                    is_public: boolean
                    updated_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    temp_preference?: 'celsius' | 'fahrenheit'
                    is_public?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    temp_preference?: 'celsius' | 'fahrenheit'
                    is_public?: boolean
                    updated_at?: string
                }
            }
            grinders: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: 'manual' | 'electric' | null
                    setting_type: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    type?: 'manual' | 'electric' | null
                    setting_type?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    type?: 'manual' | 'electric' | null
                    setting_type?: string | null
                    created_at?: string
                }
            }
            methods: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            beans: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    roaster: string | null
                    country: string | null
                    region: string | null
                    producer: string | null
                    variety: string | null
                    process: string | null
                    roast_date: string | null
                    total_weight: number | null
                    is_active: boolean
                    characteristics: {
                        aroma?: string
                        beginning?: string
                        middle?: string
                        end?: string
                        aftertaste?: string
                        mouthfeel?: string
                        color_tone?: string
                    } | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    roaster?: string | null
                    country?: string | null
                    region?: string | null
                    producer?: string | null
                    variety?: string | null
                    process?: string | null
                    roast_date?: string | null
                    total_weight?: number | null
                    is_active?: boolean
                    characteristics?: {
                        aroma?: string
                        beginning?: string
                        middle?: string
                        end?: string
                        aftertaste?: string
                        mouthfeel?: string
                        color_tone?: string
                    } | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    roaster?: string | null
                    country?: string | null
                    region?: string | null
                    producer?: string | null
                    variety?: string | null
                    process?: string | null
                    roast_date?: string | null
                    total_weight?: number | null
                    is_active?: boolean
                    characteristics?: {
                        aroma?: string
                        beginning?: string
                        middle?: string
                        end?: string
                        aftertaste?: string
                        mouthfeel?: string
                        color_tone?: string
                    } | null
                    created_at?: string
                }
            }
            logs: {
                Row: {
                    id: string
                    user_id: string
                    bean_id: string | null
                    grinder_id: string | null
                    method_id: string | null
                    device: string | null
                    grind_setting: string | null
                    dose: number | null
                    ratio: number | null
                    water_temp: number | null
                    bloom_time: number | null
                    total_time: number | null
                    yield: number | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    bean_id?: string | null
                    grinder_id?: string | null
                    method_id?: string | null
                    device?: string | null
                    grind_setting?: string | null
                    dose?: number | null
                    ratio?: number | null
                    water_temp?: number | null
                    bloom_time?: number | null
                    total_time?: number | null
                    yield?: number | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    bean_id?: string | null
                    grinder_id?: string | null
                    method_id?: string | null
                    device?: string | null
                    grind_setting?: string | null
                    dose?: number | null
                    ratio?: number | null
                    water_temp?: number | null
                    bloom_time?: number | null
                    total_time?: number | null
                    yield?: number | null
                    notes?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
