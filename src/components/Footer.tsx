export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="14" width="8" height="16" rx="2" fill="var(--primary)" />
            <rect x="12" y="8" width="8" height="22" rx="2" fill="var(--primary)" opacity="0.8" />
            <rect x="22" y="2" width="8" height="28" rx="2" fill="var(--primary)" opacity="0.6" />
          </svg>
          Imobify
        </div>

        <div className="flex items-center gap-8 text-sm text-muted">
          <a href="#" className="hover:text-foreground transition-colors">Acasă</a>
          <a href="#features" className="hover:text-foreground transition-colors">Funcționalități</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Prețuri</a>
          <a href="#cta" className="hover:text-foreground transition-colors">Contact</a>
        </div>

        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Imobify. Toate drepturile rezervate.
        </p>
      </div>
    </footer>
  );
}
