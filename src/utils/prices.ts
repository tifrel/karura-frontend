import { ApiPromise } from "@polkadot/api";
import { LpSpec, toString, toQuery } from "./";

export const E6 = BigInt("1" + "0".repeat(6));
export const E12 = BigInt("1" + "0".repeat(12));
export const E18 = BigInt("1" + "0".repeat(18));

export type PriceDict = Record<string, bigint>;
export type PriceList = Array<{ token: string; quote: string; price: bigint }>;

async function getPrice(
  api: ApiPromise,
  target: string,
  quote: string
): Promise<bigint> {
  const [targetAmount, quoteAmount] = (
    await api.query.dex.liquidityPool([{ token: target }, { token: quote }])
  ).toJSON() as [string, string];
  return (BigInt(targetAmount) * E12) / BigInt(quoteAmount);
}

/// value of lp share: share amount / amount of all shares * total value token A * total value token B
async function getLpShareValue(
  [tokenA, tokenB]: LpSpec,
  prices: PriceDict,
  api: ApiPromise
): Promise<bigint> {
  const [totalAmountA, totalAmountB] = (
    (await api.query.dex.liquidityPool(toQuery([tokenA, tokenB]))).toJSON() as [
      string,
      string
    ]
  ).map((x) => BigInt(x).valueOf());
  const totalValueA = totalAmountA * prices[tokenA];
  const totalValueB = totalAmountB * prices[tokenB];
  console.log(Object.keys(api.query));
  console.log(Object.keys(api.query.tokens));
  console.log(toQuery([tokenA, tokenB]));
  const totalShares = BigInt(
    (
      await api.query.tokens.totalIssuance({
        dexshare: toQuery([tokenA, tokenB]),
      })
    ).toJSON() as string
  );
  return (totalValueA + totalValueB) / totalShares;
}

async function getKsmPrice(api: ApiPromise): Promise<bigint> {
  const data = (
    await api.query.acalaOracle.values({ Token: "KSM" })
  ).toJSON() as { value: string };
  return BigInt(data.value).valueOf() / E6;
}

interface GetPricesOptions {
  api: ApiPromise;
  tokens: Array<string>;
  lpSpecs: Array<LpSpec>;
}

// FIXME: right now the logic is hardwired and needs to be updated for each
// new token to enter the dex. It also operates on the x * y = 1 assumption.
// TODO: move single queries api.queryMulti for less networking traffic
// TODO: get values for lp shares
export async function getPrices({
  api,
  lpSpecs,
}: GetPricesOptions): Promise<PriceDict> {
  const ksmUsd = await getKsmPrice(api);
  const kusdKsm = await getPrice(api, "KUSD", "KSM");
  const ksmLksm = await getPrice(api, "KSM", "LKSM");
  const ksmKar = await getPrice(api, "KAR", "KSM");

  const prices: PriceDict = {
    KSM: ksmUsd,
    KUSD: (ksmUsd * E12) / kusdKsm,
    LKSM: (ksmLksm * ksmUsd) / E12,
    KAR: (ksmUsd * E12) / ksmKar,
  };

  await Promise.all(
    lpSpecs.map(async (spec) => {
      prices[toString(spec)] = await getLpShareValue(spec, prices, api);
    })
  );
  return prices;
}
