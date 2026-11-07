-- Admin RPCs end to end: an admin can list and change roles, anyone else is refused, a demotion ends the
-- target's sessions, and a new function in `public` is not callable by anon.
begin;
create extension if not exists pgtap with schema extensions;
create temp table tap_out (n serial, line text);
grant all on tap_out to public;
grant usage on sequence tap_out_n_seq to public;
insert into tap_out (line) select plan(7);

insert into auth.users (id, email, raw_app_meta_data, aud, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@t.local', '{"role":"admin"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000e1', 'editor@t.local', '{"role":"editor"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000c1', 'customer@t.local', '{}', 'authenticated', 'authenticated');
insert into auth.sessions (id, user_id) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000e1');

-- A function created later by the migration role is not executable by anon (no PUBLIC default grant).
create function public.audit_probe() returns int language sql as $$ select 1 $$;
insert into tap_out (line) select is(
  has_function_privilege('anon', 'public.audit_probe()', 'execute'), false, 'new public functions are closed to anon');

-- Non-admins are refused.
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000e1', true);
set local role authenticated;
insert into tap_out (line) select throws_ok(
  $$select * from public.list_accounts()$$, '42501', 'forbidden', 'editor cannot list accounts');
insert into tap_out (line) select throws_ok(
  $$select public.set_staff_role('00000000-0000-0000-0000-0000000000c1', 'editor')$$,
  '42501', 'forbidden', 'editor cannot grant roles');
reset role;

-- An admin can list, and demoting an editor ends that editor's sessions.
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
set local role authenticated;
insert into tap_out (line) select is(
  (select count(*)::int from public.list_accounts('t.local')), 3, 'admin lists accounts');
select public.set_staff_role('00000000-0000-0000-0000-0000000000e1', 'customer');
insert into tap_out (line) select throws_ok(
  $$select public.set_staff_role('00000000-0000-0000-0000-0000000000a1', 'customer')$$,
  'P0001', 'cannot_demote_self', 'an admin cannot demote themself');
reset role;
insert into tap_out (line) select is(
  (select count(*)::int from auth.sessions where user_id = '00000000-0000-0000-0000-0000000000e1'), 0,
  'demotion revoked the sessions');
insert into tap_out (line) select is(
  (select raw_app_meta_data ->> 'role' from auth.users where id = '00000000-0000-0000-0000-0000000000e1'), null,
  'role removed from app_metadata');

insert into tap_out (line) select * from finish();
select string_agg(line, E'
' order by n) as tap from tap_out;
rollback;
