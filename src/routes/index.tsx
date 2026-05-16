import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSpreadsheet, FileText } from "lucide-react";
import { COMPANY } from "@/lib/company";

const LOGO_URL = 'https://res.cloudinary.com/drvug594q/image/upload/v1778965819/Screenshot_2026-05-16_at_11.25.58_PM-removebg-preview_g89jwh.png';

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl flex items-center gap-3 px-6 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded overflow-hidden">
            <img src={LOGO_URL} alt="NIT" className="h-full w-full object-contain" />
          </div>
          <span className="font-display text-xl text-gold">{COMPANY.name}</span>
        </div>
      </nav>

      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="font-display text-4xl md:text-5xl text-primary">{COMPANY.tagline}</h1>
          <p className="mt-3 text-muted-foreground">Professional documents for your aggregate supply business.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/quotation" className="group rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-lg hover:border-accent transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-navy text-gold mb-5 group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
              <FileSpreadsheet className="!size-7" />
            </div>
            <h2 className="font-display text-2xl text-primary mb-2">Sale Quotation</h2>
            <p className="text-sm text-muted-foreground">Generate professional quotations for aggregate supply with auto-calculated totals.</p>
          </Link>

          <Link to="/letterpad" className="group rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-lg hover:border-accent transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-navy text-gold mb-5 group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
              <FileText className="!size-7" />
            </div>
            <h2 className="font-display text-2xl text-primary mb-2">Letterpad</h2>
            <p className="text-sm text-muted-foreground">Write and print official company letters on branded letterhead.</p>
          </Link>
        </div>
      </main>

      <footer className="bg-navy text-navy-foreground text-center text-xs py-3">
        © {new Date().getFullYear()} {COMPANY.name} · {COMPANY.address}
      </footer>
    </div>
  );
}
