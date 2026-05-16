
# Nebhnani Infra Trade — Document Tool

A single-page app with a home screen and two tools: **Sale Quotation Generator** and **Letterpad**. Both are print-ready, save drafts to Lovable Cloud, and export as PDFs.

## Visual direction

- Premium corporate print look: white document surfaces, deep navy header bands (`oklch(0.22 0.06 260)`), gold accents (`oklch(0.78 0.13 80)`), Playfair Display for headings, Inter for body.
- Gold "NIT" monogram tile in headers as a logo placeholder until the user provides one.
- Print CSS hides all chrome — only the document area prints.

## Pages & routes

```
src/routes/
  __root.tsx              (existing — adds QueryClient + Toaster, no nav)
  index.tsx               Home: navbar + tagline + 2 large cards
  quotation.tsx           Sale Quotation Generator
  letterpad.tsx           Letterpad
```

## Home screen

- Top navbar: NIT monogram + "Nebhnani Infra Trade".
- Hero tagline: *Building Infrastructure, Building Trust.*
- Two large cards (icons: `FileSpreadsheet` and `FileText` from lucide-react) → `/quotation` and `/letterpad`.

## Page 1 — Sale Quotation

**Fixed navy header** with company name, address, GST `23AAZPN0199A2ZK`, PAN `AAZPN0199A`, email `nebhnaniinfra@gmail.com`, gold NIT monogram.

**Editable form fields**: Receiver Name/Address, Consignee Name/Address, Quotation No (auto-increments from last saved + 1, editable), Date (defaults today), Customer GST/PAN, Sales Executive, Contact No.

**Line items table** (add/edit/delete rows) seeded with:
| Material | HSN | Qty | Unit | Rate |
|---|---|---|---|---|
| Dust | 25171010 | 1 | TON | 450 |
| Transportation | — | 1 | /Ton/Km. | 8 |
| Royalty | — | 1 | TON | 90 |
| GST | — | — | % | 3.33 |

- Per-row amount = Qty × Rate (GST row computed as % of subtotal).
- Grand Total banner in gold with **Amount in Words** (Indian numbering, e.g. "Rupees One Lakh Twenty Thousand Only").

**Terms & Conditions** — editable textarea list, prefilled with the 6 default terms; add/remove.

**Footer**: "For Nebhnani Infra Trade" + "Authorised Signatory · Proprietorship".

**Actions**: Save Draft, Print/Download PDF (html2pdf.js).

## Page 2 — Letterpad

**Fixed navy header**: NIT monogram (left), company name in Playfair gold, address/phone/email/website, GST/PAN strip, gold rule divider.

**Editable letter body**: To, Recipient Address, Date, Reference No, Subject, Salutation (default "Dear Sir,"), rich-text body editor (Tiptap) with toolbar: Bold, Italic, Underline, Align L/C/R, Bullet list, Clear formatting.

**Fixed closing**: "Thanking you, Yours faithfully," + signature line + "Nebhnani Infra Trade — Authorised Signatory · Proprietorship".

**Fixed footer**: navy band with tagline, address, email, page number.

**Actions**: Save Draft, Print/Save as PDF.

## Lovable Cloud (database)

Two tables, no auth (public RLS — read/write open since this is a single-proprietor internal tool):

- `quotations` — id, quotation_no, quotation_date, receiver_name, receiver_address, consignee_name, consignee_address, customer_gst, customer_pan, sales_executive, contact_no, line_items (jsonb), terms (jsonb), grand_total numeric, created_at.
- `letters` — id, recipient_name, recipient_address, letter_date, reference_no, subject, salutation, body_html, created_at.

Quotation number auto-increments by querying `MAX(quotation_no)` on page load.

## Tech / libraries

- `html2pdf.js` — client-side PDF (renders the document div to PDF with A4 sizing).
- `@tiptap/react` + starter-kit + underline + text-align + list extensions — letter rich text.
- Existing shadcn `Card`, `Input`, `Button`, `Table`, `Textarea`, `Toaster`.
- Lucide icons.

## Technical details

- Indian number formatter: `new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- Amount-in-words: small util converting paise → Indian words (lakh/crore grouping).
- Print CSS: `@media print { @page { size: A4; margin: 0; } .no-print { display: none } .doc { box-shadow: none } }`.
- PDF export wraps the document node in html2pdf with `{ filename, jsPDF: { format: 'a4' } }`.
- Tiptap editor toolbar is `.no-print`; only rendered HTML body prints.

## Out of scope

- Logo upload UI (user will provide image; placeholder NIT monogram for now).
- Auth, user roles, multi-tenant, search/history UI (drafts saved but no list view yet — can add later).
