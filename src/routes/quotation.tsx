import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, Printer } from "lucide-react";
import { BrandHeader, BrandFooter } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatINR, amountInWords } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/quotation")({
  component: QuotationPage,
});

type LineItem = {
  material: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  isGstPercent?: boolean;
};

const DEFAULT_ITEMS: LineItem[] = [
  { material: "Dust", hsn: "25171010", qty: 1, unit: "TON", rate: 450 },
  { material: "Transportation", hsn: "", qty: 1, unit: "/Ton/Km.", rate: 8 },
  { material: "Royalty", hsn: "", qty: 1, unit: "TON", rate: 90 },
  { material: "GST", hsn: "", qty: 0, unit: "%", rate: 3.33, isGstPercent: true },
];

const DEFAULT_TERMS = [
  "Rate: The above prices are at Our Plant site.",
  "Transportation: The above prices are Extra.",
  "Distance from supply site to project site is approximately 65–75 km.",
  "Royalty: The above prices are Extra.",
  "Tax/GST: The above prices are Extra.",
  "Payment: 100% Advance.",
];

function calcRowAmount(item: LineItem, subtotal: number) {
  if (item.isGstPercent) return (subtotal * (Number(item.rate) || 0)) / 100;
  return (Number(item.qty) || 0) * (Number(item.rate) || 0);
}

function QuotationPage() {
  const [items, setItems] = useState<LineItem[]>(DEFAULT_ITEMS);
  const [terms, setTerms] = useState<string[]>(DEFAULT_TERMS);
  const [quotationNo, setQuotationNo] = useState<number>(1);
  const [form, setForm] = useState({
    quotation_date: new Date().toISOString().slice(0, 10),
    receiver_name: "",
    receiver_address: "",
    consignee_name: "",
    consignee_address: "",
    customer_gst: "",
    customer_pan: "",
    sales_executive: "",
    contact_no: "",
  });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("quotations")
      .select("quotation_no")
      .order("quotation_no", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        const last = data?.[0]?.quotation_no ?? 0;
        setQuotationNo(last + 1);
      });
  }, []);

  const nonGstItems = items.filter((i) => !i.isGstPercent);
  const subtotal = nonGstItems.reduce((s, i) => s + calcRowAmount(i, 0), 0);
  const gstItem = items.find((i) => i.isGstPercent);
  const gstAmount = gstItem ? calcRowAmount(gstItem, subtotal) : 0;
  const grandTotal = subtotal + gstAmount;

  function updateItem(idx: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addRow() {
    setItems((prev) => [...prev, { material: "", hsn: "", qty: 1, unit: "TON", rate: 0 }]);
  }
  function removeRow(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function saveDraft() {
    const { error } = await supabase.from("quotations").insert({
      quotation_no: quotationNo,
      quotation_date: form.quotation_date,
      receiver_name: form.receiver_name,
      receiver_address: form.receiver_address,
      consignee_name: form.consignee_name,
      consignee_address: form.consignee_address,
      customer_gst: form.customer_gst,
      customer_pan: form.customer_pan,
      sales_executive: form.sales_executive,
      contact_no: form.contact_no,
      line_items: items,
      terms,
      grand_total: grandTotal,
    });
    if (error) toast.error("Save failed: " + error.message);
    else toast.success("Quotation saved");
  }

  async function printPdf() {
    if (!printRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 8,
        filename: `Quotation-${quotationNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="no-print sticky top-0 z-10 bg-card border-b">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="!size-4" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveDraft}><Save /> Save Draft</Button>
            <Button size="sm" onClick={printPdf}><Printer /> Print / PDF</Button>
          </div>
        </div>
      </div>

      <div ref={printRef} className="print-area mx-auto max-w-5xl bg-card shadow-md mt-6 print:mt-0 print:shadow-none">
        <BrandHeader />

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start border-b border-border pb-4">
            <h2 className="font-display text-2xl text-primary">SALE QUOTATION</h2>
            <div className="text-right text-sm">
              <div className="flex gap-2 items-center justify-end mb-1">
                <Label className="text-muted-foreground">Quotation No:</Label>
                <Input type="number" value={quotationNo} onChange={(e) => setQuotationNo(Number(e.target.value))} className="h-8 w-24 text-right" />
              </div>
              <div className="flex gap-2 items-center justify-end">
                <Label className="text-muted-foreground">Date:</Label>
                <Input type="date" value={form.quotation_date} onChange={(e) => setForm({ ...form, quotation_date: e.target.value })} className="h-8 w-40" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-foreground bg-accent/20 px-2 py-1 rounded">Bill To</h3>
              <Input placeholder="Receiver Name" value={form.receiver_name} onChange={(e) => setForm({ ...form, receiver_name: e.target.value })} />
              <Textarea placeholder="Receiver Address" value={form.receiver_address} onChange={(e) => setForm({ ...form, receiver_address: e.target.value })} rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Customer GST" value={form.customer_gst} onChange={(e) => setForm({ ...form, customer_gst: e.target.value })} />
                <Input placeholder="Customer PAN" value={form.customer_pan} onChange={(e) => setForm({ ...form, customer_pan: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-foreground bg-accent/20 px-2 py-1 rounded">Ship To / Consignee</h3>
              <Input placeholder="Consignee Name" value={form.consignee_name} onChange={(e) => setForm({ ...form, consignee_name: e.target.value })} />
              <Textarea placeholder="Consignee Address" value={form.consignee_address} onChange={(e) => setForm({ ...form, consignee_address: e.target.value })} rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Sales Executive" value={form.sales_executive} onChange={(e) => setForm({ ...form, sales_executive: e.target.value })} />
                <Input placeholder="Contact No" value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="border border-border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy text-navy-foreground">
                <tr>
                  <th className="px-3 py-2 text-left w-10">#</th>
                  <th className="px-3 py-2 text-left">Material / Description</th>
                  <th className="px-3 py-2 text-left w-28">HSN</th>
                  <th className="px-3 py-2 text-right w-20">Qty</th>
                  <th className="px-3 py-2 text-left w-24">Unit</th>
                  <th className="px-3 py-2 text-right w-28">Rate (₹)</th>
                  <th className="px-3 py-2 text-right w-32">Amount (₹)</th>
                  <th className="no-print w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const amt = calcRowAmount(it, subtotal);
                  return (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-3 py-1 text-muted-foreground">{idx + 1}</td>
                      <td className="px-2 py-1">
                        <Input value={it.material} onChange={(e) => updateItem(idx, { material: e.target.value })} className="h-8 border-0 shadow-none focus-visible:ring-1" />
                      </td>
                      <td className="px-2 py-1">
                        <Input value={it.hsn} onChange={(e) => updateItem(idx, { hsn: e.target.value })} className="h-8 border-0 shadow-none focus-visible:ring-1" />
                      </td>
                      <td className="px-2 py-1">
                        <Input type="number" value={it.qty} onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })} className="h-8 border-0 text-right shadow-none focus-visible:ring-1" disabled={it.isGstPercent} />
                      </td>
                      <td className="px-2 py-1">
                        <Input value={it.unit} onChange={(e) => updateItem(idx, { unit: e.target.value })} className="h-8 border-0 shadow-none focus-visible:ring-1" />
                      </td>
                      <td className="px-2 py-1">
                        <Input type="number" step="0.01" value={it.rate} onChange={(e) => updateItem(idx, { rate: Number(e.target.value) })} className="h-8 border-0 text-right shadow-none focus-visible:ring-1" />
                      </td>
                      <td className="px-3 py-1 text-right tabular-nums">{formatINR(amt)}</td>
                      <td className="no-print px-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeRow(idx)}><Trash2 className="!size-3.5 text-destructive" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/40">
                  <td colSpan={6} className="px-3 py-2 text-right font-medium">Sub Total</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">{formatINR(subtotal)}</td>
                  <td className="no-print" />
                </tr>
              </tfoot>
            </table>
            <div className="no-print p-2 border-t bg-muted/20">
              <Button variant="outline" size="sm" onClick={addRow}><Plus /> Add Row</Button>
            </div>
          </div>

          <div className="bg-gold text-gold-foreground rounded p-4 flex justify-between items-center">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Grand Total</div>
              <div className="text-xs mt-1 italic max-w-md">{amountInWords(grandTotal)}</div>
            </div>
            <div className="font-display text-3xl font-bold tabular-nums">{formatINR(grandTotal)}</div>
          </div>

          <div>
            <h3 className="font-display text-lg text-primary mb-2">Terms &amp; Conditions</h3>
            <ol className="space-y-1 list-decimal pl-5 text-sm">
              {terms.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Input value={t} onChange={(e) => setTerms(terms.map((x, j) => (j === i ? e.target.value : x)))} className="h-8 border-0 shadow-none focus-visible:ring-1 flex-1" />
                  <Button variant="ghost" size="icon" className="no-print h-7 w-7" onClick={() => setTerms(terms.filter((_, j) => j !== i))}>
                    <Trash2 className="!size-3.5 text-destructive" />
                  </Button>
                </li>
              ))}
            </ol>
            <Button variant="outline" size="sm" className="no-print mt-2" onClick={() => setTerms([...terms, ""])}><Plus /> Add Term</Button>
          </div>

          <div className="flex justify-end pt-12">
            <div className="text-right text-sm">
              <div className="font-semibold text-primary">For Nebhnani Infra Trade</div>
              <div className="h-16" />
              <div className="border-t border-border pt-1 px-8">Authorised Signatory · Proprietorship</div>
            </div>
          </div>
        </div>

        <BrandFooter />
      </div>
    </div>
  );
}
