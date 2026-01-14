'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function HomeLoginPanel() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                setError(signInError.message)
                return
            }

            if (data.user) {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass-panel w-full rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
            <div className="mb-6">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground">Member Login</p>
                <h2 className="text-2xl font-display font-bold mt-3">Access Your Brew Log</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Log in to track roaster, origin, and every brew detail in one place.
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="home-email" className="text-xs uppercase tracking-widest text-muted-foreground">
                        Email
                    </Label>
                    <Input
                        id="home-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="bg-background/60 border-white/10 focus-visible:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="home-password" className="text-xs uppercase tracking-widest text-muted-foreground">
                        Password
                    </Label>
                    <Input
                        id="home-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        className="bg-background/60 border-white/10 focus-visible:ring-primary"
                    />
                </div>

                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_-6px_hsl(var(--primary))] hover:shadow-[0_0_30px_-6px_hsl(var(--primary))]"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    Need an account?{' '}
                    <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors">
                        Create access
                    </Link>
                </p>
            </form>
        </div>
    )
}
