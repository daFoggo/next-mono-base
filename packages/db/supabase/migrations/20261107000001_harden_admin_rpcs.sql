-- Hardening of the foundation migration (audit):
-- 1. A caller with no auth.users row (deleted account, token still valid) left `caller_role` NULL, and
--    `NULL <> 'admin'` is not true, so the guard never fired. `is distinct from` closes that.
-- 2. Any demotion (not only to customer) ends the target's sessions, so the old role cannot be refreshed.
--    A token already issued stays valid until it expires (`jwt_expiry`).
-- 3. `list_accounts` failed for every caller (42702, ambiguous `id`): the output column shadowed auth.users.id.
-- 4. New functions in `public` no longer get EXECUTE for PUBLIC (and so anon) by default.

create or replace function public.set_staff_role(target uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text;
  target_role text;
begin
  select coalesce(raw_app_meta_data ->> 'role', '')
  into caller_role
  from auth.users
  where id = auth.uid();

  if caller_role is distinct from 'admin' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if new_role not in ('customer', 'editor', 'admin') then
    raise exception 'invalid_role' using errcode = 'P0001';
  end if;
  if target = auth.uid() and new_role <> 'admin' then
    raise exception 'cannot_demote_self' using errcode = 'P0001';
  end if;

  select raw_app_meta_data ->> 'role' into target_role from auth.users where id = target;

  update auth.users
  set raw_app_meta_data = case
    when new_role = 'customer' then coalesce(raw_app_meta_data, '{}'::jsonb) - 'role'
    else coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
  end
  where id = target;
  if not found then
    raise exception 'unknown_user' using errcode = 'P0001';
  end if;

  -- Revoke sessions on any demotion so the stale role cannot be refreshed.
  if (case coalesce(target_role, 'customer') when 'admin' then 3 when 'editor' then 2 else 1 end)
     > (case new_role when 'admin' then 3 when 'editor' then 2 else 1 end) then
    delete from auth.sessions where user_id = target;
  end if;
end;
$$;

create or replace function public.list_accounts(search text default null)
returns table (id uuid, email text, full_name text, role text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller_role text;
begin
  -- Qualified: `id` is also an output column of this function, so a bare `id` is ambiguous (error 42702).
  select coalesce(au.raw_app_meta_data ->> 'role', '')
  into caller_role
  from auth.users au
  where au.id = auth.uid();

  if caller_role is distinct from 'admin' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  select u.id, u.email::text, p.full_name, coalesce(u.raw_app_meta_data ->> 'role', 'customer'), u.created_at,
    u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  where search is null or u.email ilike '%' || search || '%' or p.full_name ilike '%' || search || '%'
  order by (u.raw_app_meta_data ->> 'role') is null, u.created_at desc
  limit 200;
end;
$$;

revoke execute on function public.set_staff_role(uuid, text), public.list_accounts(text) from public, anon;
grant execute on function public.set_staff_role(uuid, text), public.list_accounts(text) to authenticated;
-- Not `in schema public`: the PUBLIC grant is a global default, which a per-schema revoke cannot remove.
alter default privileges revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon;
