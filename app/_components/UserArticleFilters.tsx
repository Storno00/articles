'use client';

import { TextInput, Select, Button } from 'flowbite-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useCallback, ChangeEvent, SyntheticEvent } from 'react';

export default function UserArticleFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [orderBy, setOrderBy] = useState(
    searchParams.get('orderBy') || 'createdAt'
  );
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onSearch = (e: SyntheticEvent) => {
    e.preventDefault();
    router.push(pathname + '?' + createQueryString('search', search));
  };

  const onOrderByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e.target.value);
    router.push(pathname + '?' + createQueryString('orderBy', e.target.value));
  };

  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value);
    router.push(pathname + '?' + createQueryString('order', e.target.value));
  };

  return (
    <div className="flex items-center justify-between mb-10">
      <form className="flex gap-3" onSubmit={onSearch} noValidate>
        <TextInput
          placeholder="Search by name..."
          className="w-96"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Button type="submit">Search</Button>
      </form>
      <div className="flex gap-5">
        <Select value={orderBy} onChange={onOrderByChange}>
          <option value="title">Title</option>
          <option value="createdAt">Publish date</option>
          <option value="likes">Likes</option>
          <option value="views">Views</option>
        </Select>
        <Select value={order} onChange={onOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </div>
    </div>
  );
}
