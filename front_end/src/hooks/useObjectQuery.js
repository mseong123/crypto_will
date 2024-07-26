// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Fetches an object
 * */
export function useObjectQuery(
	RPC,
	params,
	options,
) {
	const client = useQueryClient();
	const response = useSuiClientQuery(RPC, params, options);
	return response;
}
