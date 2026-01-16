import HomeLoginPanel from '@/components/home/HomeLoginPanel'
import { SilkBackground } from '@/components/dashboard/SilkBackground'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#050505] text-foreground selection:bg-primary selection:text-primary-foreground">
      <SilkBackground seed="home-linefield" opacity={0.8} />

      {/* Background Ambience - kept as overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary))_0%,_transparent_40%)] opacity-10 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 flex items-center">
        <div className="font-display font-black text-lg sm:text-2xl tracking-tighter uppercase text-foreground">
          Brew // Logger
        </div>
      </nav>

      {/* Main Content */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-grow flex flex-col items-center px-4 py-20 relative z-10"
      >
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black tracking-tight md:tracking-tighter leading-[1.05] md:leading-[0.95] text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-accent mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Brew Logs<br />Personalized.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
              Track roaster, origin, and every brewing detail with a custom setup built around your ritual.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                Log in or create access to begin
              </p>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <HomeLoginPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl w-full text-left mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="glass-panel p-8 rounded-3xl hover:border-primary/50 transition-colors group">
            <div className="h-10 w-10 mb-4 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="font-display font-bold text-primary-foreground">01</span>
            </div>
            <h2 className="text-xl font-display font-bold mb-2">Inventory + Ratio Control</h2>
            <p className="text-muted-foreground text-sm">
              Track every bean in your pantry and dial in the perfect extraction with auto-calculated water weight.
            </p>
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
