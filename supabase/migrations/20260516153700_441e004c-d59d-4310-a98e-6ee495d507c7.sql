
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_no INTEGER NOT NULL,
  quotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receiver_name TEXT,
  receiver_address TEXT,
  consignee_name TEXT,
  consignee_address TEXT,
  customer_gst TEXT,
  customer_pan TEXT,
  sales_executive TEXT,
  contact_no TEXT,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  terms JSONB NOT NULL DEFAULT '[]'::jsonb,
  grand_total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_name TEXT,
  recipient_address TEXT,
  letter_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_no TEXT,
  subject TEXT,
  salutation TEXT DEFAULT 'Dear Sir,',
  body_html TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quotations" ON public.quotations FOR SELECT USING (true);
CREATE POLICY "Public insert quotations" ON public.quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update quotations" ON public.quotations FOR UPDATE USING (true);
CREATE POLICY "Public delete quotations" ON public.quotations FOR DELETE USING (true);

CREATE POLICY "Public read letters" ON public.letters FOR SELECT USING (true);
CREATE POLICY "Public insert letters" ON public.letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update letters" ON public.letters FOR UPDATE USING (true);
CREATE POLICY "Public delete letters" ON public.letters FOR DELETE USING (true);
