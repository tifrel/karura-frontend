import { ApiPromise } from "@polkadot/api";

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

// async function getLpShareValue();

async function getKsmPrice(api: ApiPromise): Promise<bigint> {
  const data = (
    await api.query.acalaOracle.values({ Token: "KSM" })
  ).toJSON() as { value: string };
  return BigInt(data.value).valueOf() / E6;
}

// FIXME: right now the logic is hardwired and needs to be updated for each
// new token to enter the dex. It also operates on the x * y = 1 assumption.
// TODO: move single queries api.queryMulti for less networking traffic
// TODO: get values for lp shares
export async function getPrices(
  tokens: Array<string>,
  api: ApiPromise
): Promise<PriceDict> {
  const ksmKusd = await getKsmPrice(api);

  const ksmLksm = await getPrice(api, "KSM", "LKSM");
  const ksmKar = await getPrice(api, "KAR", "KSM");

  return {
    KUSD: BigInt(E12),
    KSM: ksmKusd,
    LKSM: (ksmLksm * ksmKusd) / E12,
    KAR: (ksmKusd * E12) / ksmKar,
  };
}
