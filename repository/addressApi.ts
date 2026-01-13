import axiosClient from '@/lib/axiosClient';
import type { Address, PaginatedResult } from '@/types/common-type';

export const getAddresses = () => axiosClient.get<PaginatedResult<Address>>('/address');
