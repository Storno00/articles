'use client';

import { Pagination } from 'flowbite-react';
import { useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserArticleTotalPages } from '../_actions/article';

type Props = {
  userId: string;
  search: string;
};

export default function Paginator({ userId }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(searchParams.get('page') || 1);
  const [totalPages, setTotalPages] = useState(1);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    router.push(pathname + '?' + createQueryString('page', String(page)));
  };

  useEffect(() => {
    getUserArticleTotalPages(userId, searchParams.get('search') || undefined).then(setTotalPages);
  }, [searchParams.get('search')]);

  return (
    <Pagination
      currentPage={Number(currentPage)}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showIcons
    />
  );
}
