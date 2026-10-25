-- GitHub users that have appeared in the followers ranking. Keyed by GitHub's numeric id,
-- which stays the same when a user changes their login.
create table public.users (
  id bigint primary key,
  login text not null,
  name text,
  html_url text not null,
  avatar_url text,
  location text,
  updated_at timestamptz not null default now()
);

-- One row per user per day they were in the ranking.
create table public.user_snapshots (
  user_id bigint not null references public.users (id) on delete cascade,
  snapshot_date date not null,
  rank integer not null,
  followers integer not null,
  primary key (user_id, snapshot_date)
);

create index user_snapshots_date_rank_idx on public.user_snapshots (snapshot_date, rank);

-- Anyone can read; only the secret key (service_role, bypasses RLS) can write.
alter table public.users enable row level security;
alter table public.user_snapshots enable row level security;

create policy "Public read access" on public.users
  for select to anon, authenticated using (true);
create policy "Public read access" on public.user_snapshots
  for select to anon, authenticated using (true);

-- Latest snapshot day, compared with the snapshot day before it.
-- Change columns are null for users who weren't ranked on the previous day.
create view public.user_leaderboard with (security_invoker = true) as
with latest as (
  select max(snapshot_date) as day from public.user_snapshots
),
previous as (
  select max(s.snapshot_date) as day
  from public.user_snapshots s, latest
  where s.snapshot_date < latest.day
)
select
  s.rank,
  u.id,
  u.login,
  u.name,
  u.html_url,
  u.avatar_url,
  u.location,
  s.followers,
  s.snapshot_date,
  previous.day as previous_date,
  s.followers - p.followers as followers_change,
  p.rank - s.rank as rank_change
from public.user_snapshots s
join latest on s.snapshot_date = latest.day
join public.users u on u.id = s.user_id
cross join previous
left join public.user_snapshots p
  on p.user_id = s.user_id and p.snapshot_date = previous.day;

grant select on public.users, public.user_snapshots, public.user_leaderboard to anon, authenticated;
grant select, insert, update, delete on public.users, public.user_snapshots to service_role;
