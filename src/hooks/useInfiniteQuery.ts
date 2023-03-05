// use-infinite-query.ts
import { QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { QueryHooks } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useEffect, useRef, useState } from 'react';
import { PagedResponse } from 'types/chat';

// infer result type from endpoint - there is probably a better way of doing this
type GetResultTypeFromEndpoint<Endpoint> = Endpoint extends QueryHooks<
  QueryDefinition<any, any, string, infer ResultType, string>
>
  ? ResultType
  : never;

interface UseInfiniteQueryOptions {
  page?: number;
  limit?: number;
  chat?: string;
  post?: string;
}

export function useInfiniteQuery<
  Endpoint extends QueryHooks<QueryDefinition<any, any, any, any, any>>,
  ResultType = GetResultTypeFromEndpoint<Endpoint>,
>(
  endpoint: Endpoint,
  options: UseInfiniteQueryOptions = { page: 1, limit: 50 },
) {
  const nextPage = useRef<number | undefined>(undefined);
  const [pages, setPages] = useState<Array<ResultType>>([]);

  const [trigger, result] = endpoint.useLazyQuery();

  useEffect(() => {
    trigger(options);
  }, []);

  const getNextPageParam = ({ page, totalPages }: PagedResponse) =>
    page < totalPages ? page + 1 : undefined;

  useEffect(() => {
    if (!result.isSuccess) return;
    nextPage.current = getNextPageParam(result.data);

    if (result.data.page === 1) {
      setPages(result.data.results);
      return;
    }

    setPages([...(pages ?? []), result.data.results]);
  }, [result.data]);

  return {
    ...result,
    data: pages,
    hasNextPage: nextPage.current !== undefined,
    fetchNextPage() {
      if (nextPage.current !== undefined) {
        trigger({ page: nextPage.current });
      }
    },
    isFetchingNextPage: result.isFetching && pages !== undefined,
    refetch() {
      trigger(options);
    },
  };
}

export default useInfiniteQuery;
