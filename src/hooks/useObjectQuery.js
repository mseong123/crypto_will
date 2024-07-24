// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Fetches an object, returning the response from RPC and a callback
 * to invalidate it.
 */
export function useObjectQuery(
	RPC,
	params,
	options,
) {
	
	const client = useQueryClient();
	const response = useSuiClientQuery(RPC, params, options);
	console.log("ms")
	const invalidate = async () => {
		await client.invalidateQueries({queryKey:["hello"]});
		console.log("there")
	};

	

	return [response, invalidate];
}
