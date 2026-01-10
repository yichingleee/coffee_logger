import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">

      {/* Background Ambience - kept as overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary))_0%,_transparent_40%)] opacity-10 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
        <div className="font-display font-black text-2xl tracking-tighter uppercase text-foreground">
          Brew // Logger
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
        <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-accent mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Precision<br />Brewing.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
          Log dose, ratio, and time with scientific accuracy. <br /> Elevated coffee tracking for the obsessed.
        </p>

        <div className="flex gap-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Link href="/login" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-[0_0_20px_-5px_hsl(var(--primary))] hover:shadow-[0_0_30px_-5px_hsl(var(--primary))] hover:scale-105 transition-all uppercase tracking-widest text-lg flex items-center justify-center">
            Initialize
          </Link>
          <Link href="/signup" className="px-8 py-4 glass-panel text-foreground font-bold rounded-xl hover:bg-secondary/40 border border-white/10 hover:border-white/20 transition-all uppercase tracking-widest text-lg backdrop-blur-sm flex items-center justify-center">
            Create Access
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="glass-panel p-8 rounded-3xl hover:border-primary/50 transition-colors group">
            <div className="h-10 w-10 mb-4 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="font-display font-bold text-primary-foreground">01</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Inventory Control</h3>
            <p className="text-muted-foreground text-sm">Track every bean in your pantry. Monitor open dates and roast profiles.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl hover:border-accent/50 transition-colors group">
            <div className="h-10 w-10 mb-4 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="font-display font-bold text-accent-foreground">02</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Ratio Calculator</h3>
            <p className="text-muted-foreground text-sm">Dial in the perfect extraction. Auto-calculate water weight based on dose.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl hover:border-secondary/50 transition-colors group">
            <div className="h-10 w-10 mb-4 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="font-display font-bold text-secondary-foreground">03</span>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Extraction Timer</h3>
            <p className="text-muted-foreground text-sm">Precision timing with bloom phases. Capture total brew duration effortlessly.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex justify-between items-center text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} BREW // LOGGER</div>
        <div>OPERATIONAL</div>
      </footer>
    </div>
  )
}
