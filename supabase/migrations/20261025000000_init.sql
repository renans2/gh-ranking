-- Repos that have appeared in the ranking. Keyed by GitHub's numeric id,
-- which stays the same when a repo is renamed or transferred.
create table public.repos (
  id bigint primary key,
  full_name text not null,
  html_url text not null,
  description text,
  language text,
  owner_avatar_url text,
  updated_at timestamptz not null default now()
);

-- One row per repo per day it was in the ranking.
create table public.repo_snapshots (
  repo_id bigint not null references public.repos (id) on delete cascade,
  snapshot_date date not null,
  rank integer not null,
  stars integer not null,
  forks integer not null,
  primary key (repo_id, snapshot_date)
);

create index repo_snapshots_date_rank_idx on public.repo_snapshots (snapshot_date, rank);

-- Anyone can read; only the secret key (service_role, bypasses RLS) can write.
alter table public.repos enable row level security;
alter table public.repo_snapshots enable row level security;

create policy "Public read access" on public.repos
  for select to anon, authenticated using (true);
create policy "Public read access" on public.repo_snapshots
  for select to anon, authenticated using (true);

-- Latest snapshot day, compared with the snapshot day before it.
-- Change columns are null for repos that weren't ranked on the previous day.
create view public.leaderboard with (security_invoker = true) as
with latest as (
  select max(snapshot_date) as day from public.repo_snapshots
),
previous as (
  select max(s.snapshot_date) as day
  from public.repo_snapshots s, latest
  where s.snapshot_date < latest.day
)
select
  s.rank,
  r.id,
  r.full_name,
  r.html_url,
  r.description,
  r.language,
  r.owner_avatar_url,
  s.stars,
  s.forks,
  s.snapshot_date,
  previous.day as previous_date,
  s.stars - p.stars as stars_change,
  p.rank - s.rank as rank_change
from public.repo_snapshots s
join latest on s.snapshot_date = latest.day
join public.repos r on r.id = s.repo_id
cross join previous
left join public.repo_snapshots p
  on p.repo_id = s.repo_id and p.snapshot_date = previous.day;

grant select on public.repos, public.repo_snapshots, public.leaderboard to anon, authenticated;
grant select, insert, update, delete on public.repos, public.repo_snapshots to service_role;
