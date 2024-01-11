import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {NormalizedModel} from '../../datatable/filters/normalized-model';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';

const buildEndpoint = (model: string, prefix: string = 'normalized-models') => {
  const parts = [];
  if (prefix) {
    parts.push(prefix);
  }
  if (model) {
    parts.push(model);
  }
  return parts.join('/');
};

interface Response extends BackendResponse {
  results: NormalizedModel[];
}

interface Params {
  query?: string;
  perPage?: number;
  with?: string;
}

export function useNormalizedModels(
  model: string,
  queryParams: Params,
  queryOptions?: Omit<
    UseQueryOptions<Response, unknown, Response, [string, Params]>,
    'queryKey' | 'queryFn'
  > | null,
  userEndpoint?: string,
) {
  const endpoint = buildEndpoint(model, userEndpoint);
  return useQuery({
    queryKey: [endpoint, queryParams],
    queryFn: () => fetchUsers(endpoint, queryParams),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
}

async function fetchUsers(endpoint: string, params: Params) {
  return apiClient.get<Response>(endpoint, {params}).then(r => r.data);
}
