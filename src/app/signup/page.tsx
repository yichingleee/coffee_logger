'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [checkEmail, setCheckEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setCheckEmail(false)
        setLoading(true)

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                },
            })

            if (error) {
                setError(error.message)
                return
            }

            if (data.user) {
                // Check if email confirmation is required
                if (data.user.identities?.length === 0) {
                    setError('An account with this email already exists')
                } else if (!data.session) {
                    setCheckEmail(true)
                } else {
                    setSuccess(true)
                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        router.push('/dashboard')
                        router.refresh()
                    }, 2000)
                }
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main id="main" tabIndex={-1} className="min-h-screen flex items-center justify-center bg-background px-4">
            {/* Background Glow */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none" />

            <div className="max-w-md w-full space-y-8 bg-card/50 backdrop-blur-xl p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10">
                <div className="text-center">
                    <h1 className="mt-6 text-3xl font-display font-bold text-foreground">
                        Create Access
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Initialize new user sequence
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                spellCheck={false}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors transition-shadow"
                                placeholder="you@example.com…"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors transition-shadow"
                                placeholder="••••••••…"
                            />
                            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors transition-shadow"
                                placeholder="••••••••…"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 border border-red-200" aria-live="polite">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {checkEmail && (
                        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200" aria-live="polite">
                            <p className="text-sm text-blue-800">
                                Account created! Please check your email to verify your account before logging in.
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-50 p-4 border border-green-200" aria-live="polite">
                            <p className="text-sm text-green-800">
                                Account created successfully! Redirecting to dashboard…
                            </p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account…
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    )
}
