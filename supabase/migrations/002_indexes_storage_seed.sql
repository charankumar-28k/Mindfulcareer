-- ============================================================
-- MINDFULCAREER — Migration 002
-- Indexes · Storage Buckets · Updated-At Triggers · Seed Data
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

-- student_profiles
create index if not exists idx_student_profiles_user_id    on student_profiles(user_id);
create index if not exists idx_student_profiles_email       on student_profiles(email);
create index if not exists idx_student_profiles_track       on student_profiles(track);
create index if not exists idx_student_profiles_status      on student_profiles(status);
create index if not exists idx_student_profiles_created_at  on student_profiles(created_at desc);

-- counsellors
create index if not exists idx_counsellors_user_id      on counsellors(user_id);
create index if not exists idx_counsellors_specialty    on counsellors(specialty);
create index if not exists idx_counsellors_is_approved  on counsellors(is_approved);
create index if not exists idx_counsellors_rating       on counsellors(rating desc);

-- availability_slots
create index if not exists idx_slots_counsellor_id  on availability_slots(counsellor_id);
create index if not exists idx_slots_start_time     on availability_slots(start_time);
create index if not exists idx_slots_is_booked      on availability_slots(is_booked);

-- bookings
create index if not exists idx_bookings_student_id     on bookings(student_id);
create index if not exists idx_bookings_counsellor_id  on bookings(counsellor_id);
create index if not exists idx_bookings_status         on bookings(status);
create index if not exists idx_bookings_created_at     on bookings(created_at desc);

-- payments
create index if not exists idx_payments_booking_id           on payments(booking_id);
create index if not exists idx_payments_razorpay_order_id    on payments(razorpay_order_id);
create index if not exists idx_payments_razorpay_payment_id  on payments(razorpay_payment_id);

-- reviews
create index if not exists idx_reviews_counsellor_id  on reviews(counsellor_id);

-- company_partnerships
create index if not exists idx_company_partnerships_user_id  on company_partnerships(user_id);
create index if not exists idx_company_partnerships_status   on company_partnerships(status);

-- company_opportunities
create index if not exists idx_company_opportunities_company_id  on company_opportunities(company_id);
create index if not exists idx_company_opportunities_type        on company_opportunities(type);
create index if not exists idx_company_opportunities_track       on company_opportunities(track);

-- notifications
create index if not exists idx_notifications_user_id    on notifications(user_id);
create index if not exists idx_notifications_is_read    on notifications(is_read);
create index if not exists idx_notifications_created_at on notifications(created_at desc);

-- ============================================================
-- UPDATED_AT AUTO-UPDATE TRIGGER
-- ============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- student_profiles (already has updated_at)
drop trigger if exists set_student_profiles_updated_at on student_profiles;
create trigger set_student_profiles_updated_at
  before update on student_profiles
  for each row execute procedure set_updated_at();

-- counsellors
alter table counsellors add column if not exists updated_at timestamptz default now();
drop trigger if exists set_counsellors_updated_at on counsellors;
create trigger set_counsellors_updated_at
  before update on counsellors
  for each row execute procedure set_updated_at();

-- bookings
alter table bookings add column if not exists updated_at timestamptz default now();
drop trigger if exists set_bookings_updated_at on bookings;
create trigger set_bookings_updated_at
  before update on bookings
  for each row execute procedure set_updated_at();

-- company_partnerships
alter table company_partnerships add column if not exists updated_at timestamptz default now();
drop trigger if exists set_company_partnerships_updated_at on company_partnerships;
create trigger set_company_partnerships_updated_at
  before update on company_partnerships
  for each row execute procedure set_updated_at();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- PDF Reports bucket (private — student & admin only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do nothing;

-- Counsellor photos bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'counsellor-photos',
  'counsellor-photos',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

-- Company logos bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-logos',
  'company-logos',
  true,
  2097152,
  array['image/jpeg','image/png','image/webp','image/svg+xml']
)
on conflict (id) do nothing;

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================

-- reports: owner or admin can read
create policy "Owner reads own report"
  on storage.objects for select
  using (
    bucket_id = 'reports'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or (select get_my_role()) = 'admin'
    )
  );

-- reports: service role inserts (edge functions)
create policy "Service role inserts reports"
  on storage.objects for insert
  with check (bucket_id = 'reports');

-- counsellor-photos: public read
create policy "Public reads counsellor photos"
  on storage.objects for select
  using (bucket_id = 'counsellor-photos');

-- counsellor-photos: counsellor uploads own photo (folder = uid)
create policy "Counsellor uploads own photo"
  on storage.objects for insert
  with check (
    bucket_id = 'counsellor-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- company-logos: public read
create policy "Public reads company logos"
  on storage.objects for select
  using (bucket_id = 'company-logos');

-- company-logos: company user uploads own logo
create policy "Company uploads own logo"
  on storage.objects for insert
  with check (
    bucket_id = 'company-logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Upcoming confirmed bookings (used in dashboards)
create or replace view upcoming_bookings as
  select
    b.id,
    b.student_id,
    b.counsellor_id,
    b.slot_id,
    b.session_type,
    b.amount,
    b.status,
    b.meeting_link,
    b.notes,
    b.created_at,
    s.start_time,
    c.full_name  as counsellor_name,
    c.photo_url  as counsellor_photo,
    c.specialty  as counsellor_specialty
  from bookings b
  join availability_slots s on s.id = b.slot_id
  join counsellors c on c.id = b.counsellor_id
  where b.status in ('pending','confirmed')
    and s.start_time >= now()
  order by s.start_time asc;

-- Admin summary stats (used in admin panel)
create or replace view admin_stats as
  select
    (select count(*) from student_profiles)::int                                    as total_submissions,
    (select count(*) from student_profiles where status = 'completed')::int         as completed_reports,
    (select count(*) from counsellors where is_approved = true)::int                as approved_counsellors,
    (select count(*) from counsellors where is_approved = false)::int               as pending_counsellors,
    (select count(*) from bookings)::int                                             as total_bookings,
    (select count(*) from bookings where status = 'completed')::int                 as completed_bookings,
    (select coalesce(sum(amount), 0) from bookings
      where status in ('confirmed','completed'))::int                               as total_revenue,
    (select count(*) from company_partnerships)::int                                as total_partners,
    (select count(*) from company_partnerships where status = 'approved')::int      as approved_partners;

-- ============================================================
-- SEED DATA — Sample Counsellors
-- Safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================================

insert into counsellors (id, full_name, bio, specialty, languages, price_intro, price_standard, price_package, rating, review_count, is_approved)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Dr. Ananya Rao',
    '10+ years guiding students through stream selection, entrance exams and college admissions. Former academic counsellor at a top engineering college.',
    'After 12th',
    array['English','Hindi','Telugu'],
    299, 799, 1999, 4.9, 142, true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Vikram Nair',
    'Former IAS officer with deep expertise in UPSC, SSC and state PSC preparation strategies. Has mentored 500+ aspirants.',
    'Govt Job',
    array['English','Malayalam','Hindi'],
    199, 599, 1499, 4.8, 98, true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Priya Mehta',
    'HR professional and career coach specialising in resume building, interviews and job search strategy for freshers and experienced professionals.',
    'Employment',
    array['English','Gujarati'],
    349, 899, 2299, 5.0, 67, true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Arjun Krishnamurthy',
    'Helped 200+ students get into top universities in India and abroad for Masters and MBA. Expert in GATE, GRE, IELTS, and application essays.',
    'Higher Study',
    array['English','Tamil','Kannada'],
    299, 799, 1999, 4.7, 55, true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Sneha Banerjee',
    'Serial entrepreneur and startup mentor. Helps aspiring founders validate ideas, find funding, and build their first team.',
    'Entrepreneur',
    array['English','Bengali','Hindi'],
    399, 999, 2499, 4.9, 33, true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Rahul Sharma',
    'Education counsellor with expertise in JEE, NEET, CUET and scholarship applications. Trained 1000+ students across India.',
    'After 12th',
    array['English','Hindi','Marathi'],
    249, 699, 1799, 4.6, 89, true
  )
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Discount Coupons
-- ============================================================

insert into coupons (code, discount_pct, max_uses, expires_at, is_active)
values
  ('WELCOME20', 20, 500,  now() + interval '6 months', true),
  ('STUDENT10', 10, 1000, now() + interval '1 year',   true),
  ('FIRST50',  50, 100,  now() + interval '1 month',  true)
on conflict (code) do nothing;
