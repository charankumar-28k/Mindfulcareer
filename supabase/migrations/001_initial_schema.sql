-- ============================================================
-- MINDFULCARER — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('student','counsellor','company','admin')) default 'student',
  full_name  text,
  email      text,
  avatar_url text,
  created_at timestamptz default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- STUDENT PROFILES
-- ============================================================
create table if not exists student_profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  full_name     text,
  email         text,
  phone         text,
  city          text,
  age           int,
  is_minor      boolean default false,
  parent_name   text,
  parent_phone  text,
  consent_given boolean default false,
  track         text check (track in ('after12','higher','govt','employment','entrepreneur','notsure')),
  answers       jsonb default '{}',
  ai_summary    text,
  report_url    text,
  status        text default 'in_progress' check (status in ('in_progress','completed')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Link anonymous chatbot session to user after signup by email
create or replace function link_student_profile_on_signup()
returns trigger language plpgsql security definer as $$
begin
  update student_profiles
  set user_id = new.id
  where email = new.email and user_id is null;
  return new;
end;
$$;

drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
  after insert on profiles
  for each row execute procedure link_student_profile_on_signup();

-- ============================================================
-- COUNSELLORS
-- ============================================================
create table if not exists counsellors (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references auth.users(id) on delete cascade,
  full_name      text not null,
  bio            text,
  photo_url      text,
  specialty      text check (specialty in ('After 12th','Higher Study','Govt Job','Employment','Entrepreneur')),
  languages      text[] default '{}',
  price_intro    int default 299,
  price_standard int default 799,
  price_package  int default 1999,
  rating         numeric(3,1) default 0,
  review_count   int default 0,
  is_approved    boolean default false,
  created_at     timestamptz default now()
);

-- ============================================================
-- AVAILABILITY SLOTS
-- ============================================================
create table if not exists availability_slots (
  id            uuid primary key default uuid_generate_v4(),
  counsellor_id uuid references counsellors(id) on delete cascade,
  start_time    timestamptz not null,
  is_booked     boolean default false,
  locked_until  timestamptz,
  created_at    timestamptz default now(),
  unique (counsellor_id, start_time)
);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists bookings (
  id               uuid primary key default uuid_generate_v4(),
  student_id       uuid references auth.users(id) on delete set null,
  counsellor_id    uuid references counsellors(id) on delete set null,
  slot_id          uuid references availability_slots(id) on delete set null unique,
  session_type     text check (session_type in ('intro','standard','package')) default 'standard',
  amount           int not null,
  status           text default 'pending' check (status in ('pending','confirmed','cancelled','completed','refunded')),
  meeting_link     text,
  notes            text,
  review_submitted boolean default false,
  coupon_code      text,
  created_at       timestamptz default now()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table if not exists payments (
  id                  uuid primary key default uuid_generate_v4(),
  booking_id          uuid references bookings(id) on delete cascade,
  razorpay_order_id   text,
  razorpay_payment_id text,
  amount              int,
  status              text default 'created' check (status in ('created','paid','failed','refunded')),
  created_at          timestamptz default now()
);

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists reviews (
  id            uuid primary key default uuid_generate_v4(),
  booking_id    uuid references bookings(id) on delete cascade unique,
  counsellor_id uuid references counsellors(id) on delete cascade,
  rating        int check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz default now()
);

create or replace function update_counsellor_rating()
returns trigger language plpgsql security definer as $$
begin
  update counsellors
  set
    rating = (select round(avg(rating)::numeric, 1) from reviews where counsellor_id = new.counsellor_id),
    review_count = (select count(*) from reviews where counsellor_id = new.counsellor_id)
  where id = new.counsellor_id;
  return new;
end;
$$;

drop trigger if exists on_review_inserted on reviews;
create trigger on_review_inserted
  after insert on reviews
  for each row execute procedure update_counsellor_rating();

-- ============================================================
-- COMPANY PARTNERSHIPS
-- ============================================================
create table if not exists company_partnerships (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete set null,
  company_name        text not null,
  industry            text,
  contact_person      text,
  work_email          text,
  phone               text,
  website             text,
  registration_number text,
  partnership_type    text,
  roles_offered       text,
  locations           text,
  notes               text,
  status              text default 'submitted' check (status in ('submitted','under review','approved','rejected','active')),
  created_at          timestamptz default now()
);

-- ============================================================
-- COMPANY OPPORTUNITIES
-- ============================================================
create table if not exists company_opportunities (
  id         uuid primary key default uuid_generate_v4(),
  company_id uuid references auth.users(id) on delete cascade,
  title      text not null,
  type       text check (type in ('Job','Internship','Scholarship','Workshop','Incubation')),
  track      text,
  location   text,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  type       text,
  payload    jsonb default '{}',
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- COUPONS
-- ============================================================
create table if not exists coupons (
  id           uuid primary key default uuid_generate_v4(),
  code         text unique not null,
  discount_pct int check (discount_pct between 1 and 100),
  max_uses     int default 100,
  used_count   int default 0,
  expires_at   timestamptz,
  is_active    boolean default true
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table student_profiles enable row level security;
alter table counsellors enable row level security;
alter table availability_slots enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
alter table reviews enable row level security;
alter table company_partnerships enable row level security;
alter table company_opportunities enable row level security;
alter table notifications enable row level security;
alter table coupons enable row level security;

-- Role helper (reads from DB, never trusts JWT claims)
create or replace function get_my_role()
returns text language sql security definer stable as $$
  select role from profiles where id = auth.uid();
$$;

-- ---- profiles ----
create policy "Users read own profile" on profiles for select using (id = auth.uid());
create policy "Users update own profile" on profiles for update using (id = auth.uid());
create policy "Admin reads all profiles" on profiles for select using (get_my_role() = 'admin');

-- ---- student_profiles ----
create policy "Anyone inserts student_profile" on student_profiles for insert with check (true);
create policy "Owner reads own student_profile" on student_profiles for select using (user_id = auth.uid());
create policy "Owner updates own student_profile" on student_profiles for update using (
  user_id = auth.uid() or (user_id is null)
);
create policy "Counsellor reads booked student profiles" on student_profiles for select using (
  get_my_role() = 'counsellor' and
  user_id in (
    select b.student_id from bookings b
    join counsellors c on c.id = b.counsellor_id
    where c.user_id = auth.uid()
  )
);
create policy "Admin reads all student_profiles" on student_profiles for select using (get_my_role() = 'admin');

-- ---- counsellors ----
create policy "Public reads approved counsellors" on counsellors for select using (is_approved = true);
create policy "Counsellor reads own row" on counsellors for select using (user_id = auth.uid());
create policy "Counsellor inserts own row" on counsellors for insert with check (user_id = auth.uid());
create policy "Counsellor updates own row" on counsellors for update using (user_id = auth.uid());
create policy "Admin reads all counsellors" on counsellors for select using (get_my_role() = 'admin');
create policy "Admin updates all counsellors" on counsellors for update using (get_my_role() = 'admin');

-- ---- availability_slots ----
create policy "Public reads slots" on availability_slots for select using (true);
create policy "Counsellor manages own slots" on availability_slots for all using (
  counsellor_id in (select id from counsellors where user_id = auth.uid())
);
create policy "Authenticated user updates slot on booking" on availability_slots for update using (auth.uid() is not null);

-- ---- bookings ----
create policy "Student reads own bookings" on bookings for select using (student_id = auth.uid());
create policy "Student inserts booking" on bookings for insert with check (student_id = auth.uid());
create policy "Student updates own booking" on bookings for update using (student_id = auth.uid());
create policy "Counsellor reads own bookings" on bookings for select using (
  counsellor_id in (select id from counsellors where user_id = auth.uid())
);
create policy "Counsellor updates own bookings" on bookings for update using (
  counsellor_id in (select id from counsellors where user_id = auth.uid())
);
create policy "Admin reads all bookings" on bookings for select using (get_my_role() = 'admin');
create policy "Admin updates all bookings" on bookings for update using (get_my_role() = 'admin');

-- ---- payments ----
create policy "Student reads own payments" on payments for select using (
  booking_id in (select id from bookings where student_id = auth.uid())
);
create policy "Admin reads all payments" on payments for select using (get_my_role() = 'admin');

-- ---- reviews ----
create policy "Public reads reviews" on reviews for select using (true);
create policy "Student inserts review for completed booking" on reviews for insert with check (
  booking_id in (select id from bookings where student_id = auth.uid() and status = 'completed')
);

-- ---- company_partnerships ----
create policy "Company reads own partnership" on company_partnerships for select using (user_id = auth.uid());
create policy "Anyone inserts partnership" on company_partnerships for insert with check (true);
create policy "Company updates own partnership" on company_partnerships for update using (user_id = auth.uid());
create policy "Admin reads all partnerships" on company_partnerships for select using (get_my_role() = 'admin');
create policy "Admin updates all partnerships" on company_partnerships for update using (get_my_role() = 'admin');

-- ---- company_opportunities ----
create policy "Public reads active opportunities from approved companies" on company_opportunities for select using (
  is_active = true and
  company_id in (select user_id from company_partnerships where status in ('approved','active') and user_id is not null)
);
create policy "Company manages own opportunities" on company_opportunities for all using (company_id = auth.uid());
create policy "Admin reads all opportunities" on company_opportunities for select using (get_my_role() = 'admin');

-- ---- notifications ----
create policy "User reads own notifications" on notifications for select using (user_id = auth.uid() or user_id is null);
create policy "Anyone inserts notification" on notifications for insert with check (true);
create policy "Admin reads all notifications" on notifications for select using (get_my_role() = 'admin');

-- ---- coupons ----
create policy "Authenticated reads active coupons" on coupons for select using (is_active = true and auth.uid() is not null);
create policy "Admin manages coupons" on coupons for all using (get_my_role() = 'admin');

-- ============================================================
-- STORAGE BUCKETS (run separately in SQL Editor)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('reports', 'reports', false) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('counsellor-photos', 'counsellor-photos', true) on conflict do nothing;
--
-- Storage RLS for reports bucket (private — only owner):
-- create policy "Owner reads own report" on storage.objects for select using (
--   bucket_id = 'reports' and auth.uid()::text = (storage.foldername(name))[1]
-- );
-- create policy "Service role inserts reports" on storage.objects for insert with check (bucket_id = 'reports');
