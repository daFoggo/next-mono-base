-- The admin RPCs refuse anyone who is not an existing admin, including a caller whose account was deleted.
begin;
create extension if not exists pgtap with schema extensions;
create temp table tap_out (n serial, line text);
grant all on tap_out to public;
grant usage on sequence tap_out_n_seq to public;
insert into tap_out (line) select plan(4);

-- A token whose user no longer exists in auth.users.
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
set local role authenticated;
insert into tap_out (line) select throws_ok(
  $$select public.set_staff_role('00000000-0000-0000-0000-000000000002', 'admin')$$,
  '42501', 'forbidden', 'deleted caller cannot grant admin');
insert into tap_out (line) select throws_ok(
  $$select * from public.list_accounts()$$,
  '42501', 'forbidden', 'deleted caller cannot list accounts');
reset role;

-- anon has no EXECUTE on the RPCs.
insert into tap_out (line) select is(
  has_function_privilege('anon', 'public.set_staff_role(uuid, text)', 'execute'), false, 'anon cannot run set_staff_role');
insert into tap_out (line) select is(
  has_function_privilege('anon', 'public.list_accounts(text)', 'execute'), false, 'anon cannot run list_accounts');

insert into tap_out (line) select * from finish();
select string_agg(line, E'
' order by n) as tap from tap_out;
rollback;
