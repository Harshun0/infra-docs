import { COMPANY } from '@/lib/company';

const LOGO_URL =
  'https://res.cloudinary.com/drvug594q/image/upload/v1778965819/Screenshot_2026-05-16_at_11.25.58_PM-removebg-preview_g89jwh.png';

export function BrandHeader() {
  return (
    <header className="bg-navy text-navy-foreground print:bg-navy print:text-navy-foreground">
      <div className="flex items-center gap-0 px-6 py-5">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden bg-transparent -mr-3">
          <img src={LOGO_URL} alt="NIT logo" className="h-full w-full object-contain block" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-4xl leading-tight text-gold">{COMPANY.name}</h1>
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
