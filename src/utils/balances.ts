import { ApiPromise } from "@polkadot/api";

export type BalanceDict = Record<string, bigint>;
export type BalanceList = Array<{ token: string; balance: bigint }>;
export type LpSpec = [string, string];

interface GetTokenBalancesOptions {
  api: ApiPromise;
  tokens: Array<string>;
}

interface BalanceComponents {
  free: number;
  frozen: number;
  reserved: number;
}

async function getTokenBalances(
  address: String,
  { tokens, api }: GetTokenBalancesOptions
): Promise<BalanceDict> {
  const balances: BalanceDict = {};
  await Promise.all(
    tokens.map(async (token) => {
      const data = await api.query.tokens.accounts(address, { token });
      const { free, frozen, reserved } =
        data.toJSON() as unknown as BalanceComponents;
      balances[token] = BigInt(free) + BigInt(frozen) + BigInt(reserved);
    })
  );
  return balances;
}

interface GetLpSharesOptions {
  api: ApiPromise;
  lpSpecs: Array<LpSpec>;
}

async function getLpShares(
  address: String,
  { lpSpecs, api }: GetLpSharesOptions
): Promise<BalanceDict> {
  const shares: BalanceDict = {};
  await Promise.all(
    lpSpecs.map(async ([tokenA, tokenB]) => {
      const data = await api.query.tokens.accounts(address, {
        dexShare: [{ token: tokenA }, { token: tokenB }],
      });
      const { free, frozen, reserved } =
        data.toJSON() as unknown as BalanceComponents;
      shares[`lp://${tokenA}/${tokenB}`] =
        BigInt(free) + BigInt(frozen) + BigInt(reserved);
    })
  );
  return shares;
}

export async function getBalances(
  addr: string,
  { tokens, lpSpecs, api }: GetLpSharesOptions & GetTokenBalancesOptions
): Promise<BalanceDict> {
  const tokenBalances = await getTokenBalances(addr, { tokens, api });
  const lpShares = await getLpShares(addr, { lpSpecs, api });
  return { ...tokenBalances, ...lpShares };
}

// async function sqBalances(address: string): Promise<BalanceDict> {
//   const query = `query {
//     account(id: "${address}"){
//       balances { nodes { tokenId total } }
//     }
//   }`;
//   const res = await sq<{
//     account: { balances: { nodes: Array<{ tokenId: string; total: string }> } };
//   }>(query);
//   console.log(res);

//   const balances: BalanceDict = {};
//   res.account.balances.nodes.forEach(({ tokenId, total }) => {
//     balances[tokenId] = BigInt(total).valueOf();
//   });

//   return balances;
// }
