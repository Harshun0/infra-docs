import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { ArrowLeft, Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, RemoveFormatting, Printer, Save } from "lucide-react";
import { BrandHeader, BrandFooter } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/letterpad")({
  component: LetterpadPage,
});

function LetterpadPage() {
  const [form, setForm] = useState({
    recipient_name: "",
    recipient_address: "",
    letter_date: new Date().toISOString().slice(0, 10),
    reference_no: "",
    subject: "",
    salutation: "Dear Sir,",
  });
  const printRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Write your letter here...</p>",
    editorProps: {
      attributes: { class: "prose max-w-none focus:outline-none min-h-[300px] text-sm leading-relaxed" },
    },
    immediatelyRender: false,
  });

  async function saveDraft() {
    const { error } = await supabase.from("letters").insert({
      ...form,
      body_html: editor?.getHTML() ?? "",
    });
    if (error) toast.error("Save failed: " + error.message);
    else toast.success("Letter saved");
  }

  async function printPdf() {
    if (!printRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 8,
        filename: `Letter-${form.reference_no || Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  }

  const tbBtn = "h-8 w-8 inline-flex items-center justify-center rounded hover:bg-accent/30";

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="no-print sticky top-0 z-10 bg-card border-b">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="!size-4" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveDraft}><Save /> Save Draft</Button>
            <Button size="sm" onClick={printPdf}><Printer /> Print / PDF</Button>
          </div>
        </div>
      </div>

      <div ref={printRef} className="print-area mx-auto max-w-4xl bg-card shadow-md mt-6 print:mt-0 print:shadow-none flex flex-col min-h-[1050px]">
        <BrandHeader />

        <div className="p-10 flex-1 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">To,</div>
              <Input placeholder="Recipient Name" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} />
              <Textarea placeholder="Recipient Address" value={form.recipient_address} onChange={(e) => setForm({ ...form, recipient_address: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2 text-right">
              <div className="flex justify-end items-center gap-2">
                <span className="text-xs text-muted-foreground">Date:</span>
                <Input type="date" value={form.letter_date} onChange={(e) => setForm({ ...form, letter_date: e.target.value })} className="h-8 w-40" />
              </div>
              <div className="flex justify-end items-center gap-2">
                <span className="text-xs text-muted-foreground">Ref No:</span>
                <Input value={form.reference_no} onChange={(e) => setForm({ ...form, reference_no: e.target.value })} className="h-8 w-40" placeholder="REF/2026/001" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary shrink-0">Subject:</span>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="font-semibold" placeholder="Letter subject" />
            </div>
            <Input value={form.salutation} onChange={(e) => setForm({ ...form, salutation: e.target.value })} className="max-w-xs" />
          </div>

          <div className="no-print flex flex-wrap gap-1 border border-border rounded p-1 bg-muted/30">
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="size-4" /></button>
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="size-4" /></button>
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="size-4" /></button>
            <div className="w-px bg-border mx-1" />
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().setTextAlign("left").run()}><AlignLeft className="size-4" /></button>
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().setTextAlign("center").run()}><AlignCenter className="size-4" /></button>
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().setTextAlign("right").run()}><AlignRight className="size-4" /></button>
            <div className="w-px bg-border mx-1" />
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="size-4" /></button>
            <button type="button" className={tbBtn} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting className="size-4" /></button>
          </div>

          <div className="min-h-[300px] py-2">
            <EditorContent editor={editor} />
          </div>

          <div className="pt-8">
            <p className="text-sm">Thanking you,</p>
            <p className="text-sm">Yours faithfully,</p>
            <div className="h-16" />
            <div className="text-sm">
              <div className="font-semibold text-primary">For Nebhnani Infra Trade</div>
              <div className="border-t border-border pt-1 mt-1 max-w-xs">Authorised Signatory · Proprietorship</div>
            </div>
          </div>
        </div>

        <BrandFooter pageLabel="Page 1" />
      </div>
    </div>
  );
}
