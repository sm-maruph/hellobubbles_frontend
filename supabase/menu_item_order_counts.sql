-- Run once in the Supabase SQL Editor for the Hello Bubbles project.
-- Stores a public aggregate count on menu_items without exposing order records.

alter table public.menu_items
add column if not exists order_count bigint not null default 0;

with totals as (
  select
    item->>'id' as item_id,
    sum(coalesce(nullif(item->>'qty', '')::bigint, 1)) as quantity
  from public.orders
  cross join lateral jsonb_array_elements(items::jsonb) as item
  where item ? 'id'
  group by item->>'id'
)
update public.menu_items as menu
set order_count = totals.quantity
from totals
where menu.id::text = totals.item_id;

create schema if not exists private;

create or replace function private.increment_menu_item_order_counts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
begin
  for item in select * from jsonb_array_elements(new.items::jsonb)
  loop
    update public.menu_items
    set order_count = order_count + coalesce(nullif(item->>'qty', '')::bigint, 1)
    where id::text = item->>'id';
  end loop;
  return new;
end;
$$;

revoke all on function private.increment_menu_item_order_counts() from public;
revoke all on function private.increment_menu_item_order_counts() from anon;
revoke all on function private.increment_menu_item_order_counts() from authenticated;

drop trigger if exists increment_menu_counts_after_order on public.orders;
create trigger increment_menu_counts_after_order
after insert on public.orders
for each row execute function private.increment_menu_item_order_counts();
