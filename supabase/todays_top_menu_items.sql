-- Run once in the Supabase SQL Editor for the Hello Bubbles project.
-- Returns only aggregate product quantities; no customer/order details are exposed.

create or replace function public.get_top_menu_items(
  p_start timestamptz,
  p_end timestamptz
)
returns table (
  item_id text,
  quantity bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    item->>'id' as item_id,
    sum(coalesce(nullif(item->>'qty', '')::bigint, 1))::bigint as quantity
  from public.orders
  cross join lateral jsonb_array_elements(items::jsonb) as item
  where created_at >= p_start
    and created_at < p_end
    and item ? 'id'
  group by item->>'id'
  order by quantity desc, item_id
  limit 3;
$$;

revoke all on function public.get_top_menu_items(timestamptz, timestamptz)
from public;

grant execute on function public.get_top_menu_items(timestamptz, timestamptz)
to anon, authenticated;
