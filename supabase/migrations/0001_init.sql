-- GRIMHART Outreach Engine — initial schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- batches: one row per monthly (or ad-hoc) CSV import
-- ---------------------------------------------------------------------------
create table if not exists batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  is_active boolean not null default false,
  total_leads integer not null default 0
);

create index if not exists batches_is_active_idx on batches (is_active);

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
do $$ begin
  create type lead_status as enum ('uncontacted', 'sent', 'replied', 'interested', 'won', 'lost');
exception
  when duplicate_object then null;
end $$;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references batches(id) on delete cascade,
  import_order integer not null,

  business_name text not null,
  phone text,
  normalized_phone text,
  website text,
  category text,
  city text,
  full_address text,
  rating numeric,
  review_count integer,
  booking_url text,
  social_url text,
  whatsapp_url text,
  google_maps_url text,
  business_status text,

  raw_data jsonb not null default '{}'::jsonb,

  status lead_status not null default 'uncontacted',
  message text,
  message_language text,
  message_generated_at timestamptz,
  contacted_at timestamptz,

  created_at timestamptz not null default now()
);

-- Deterministic queue ordering + lookups
create index if not exists leads_batch_id_idx on leads (batch_id);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_contacted_at_idx on leads (contacted_at);
create index if not exists leads_business_name_idx on leads (business_name);
create index if not exists leads_normalized_phone_idx on leads (normalized_phone);
create index if not exists leads_batch_status_order_idx on leads (batch_id, status, import_order);

-- Primary dedup key: a phone number should only exist once across all batches.
create unique index if not exists leads_normalized_phone_unique
  on leads (normalized_phone)
  where normalized_phone is not null;

-- ---------------------------------------------------------------------------
-- settings: single editable row
-- ---------------------------------------------------------------------------
create table if not exists settings (
  id text primary key default 'default',
  daily_target integer not null default 30,
  language_mode text not null default 'auto', -- auto | es | en
  ai_context text not null default '',
  base_instructions text not null default '',
  updated_at timestamptz not null default now()
);

insert into settings (id, daily_target, language_mode, ai_context, base_instructions)
values (
  'default',
  30,
  'auto',
  'GRIMHART is a digital agency based in Mallorca working with businesses in the Balearic Islands and elsewhere. GRIMHART builds premium websites, online booking systems, multilingual websites, digital restaurant menus, WhatsApp booking flows, Google review systems, NFC review cards, NFC menu cards, branding, social media systems, and conversion-focused digital experiences.',
  'Write a short, natural WhatsApp outreach message from one person to a business owner. The goal is to start a conversation, not sell every service immediately. Confident, relaxed, professional, low-pressure. 35-80 words. No emojis, no bullet points, no fake enthusiasm, no invented personalization. End with a low-friction call to action offering to show an example or idea.'
)
on conflict (id) do nothing;
