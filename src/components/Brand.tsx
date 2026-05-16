import { COMPANY } from '@/lib/company';

export function BrandHeader() {
  return (
    <header className="bg-navy text-navy-foreground print:bg-navy print:text-navy-foreground">
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gold text-gold-foreground font-display text-xl font-bold tracking-wider shadow">
          NIT
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl leading-tight text-gold">{COMPANY.name}</h1>
          <p className="text-xs opacity-90 mt-0.5">{COMPANY.address}</p>
        </div>
        <div className="text-right text-xs leading-relaxed hidden sm:block">
          <div><span className="opacity-70">GST:</span> {COMPANY.gst}</div>
          <div><span className="opacity-70">PAN:</span> {COMPANY.pan}</div>
          <div><span className="opacity-70">Email:</span> {COMPANY.email}</div>
        </div>
      </div>
      <div className="h-1 bg-gold" />
    </header>
  );
}

export function BrandFooter({ pageLabel = '' }: { pageLabel?: string }) {
  return (
    <footer className="bg-navy text-navy-foreground px-6 py-3 text-xs flex items-center justify-between print:bg-navy print:text-navy-foreground">
      <span className="font-display text-gold italic">{COMPANY.tagline}</span>
      <span className="opacity-80 hidden sm:inline">{COMPANY.address}</span>
      <span className="opacity-80">{COMPANY.email} {pageLabel && `· ${pageLabel}`}</span>
    </footer>
  );
}
