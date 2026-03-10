import { fetchServiceJson } from '@/lib/restClient';
import type { Address, PaginatedResult } from '@/types/common-type';

export const getAddresses = () => fetchServiceJson<PaginatedResult<Address>>('/address');
