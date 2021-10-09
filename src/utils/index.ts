import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { ApiPromise } from "@polkadot/api";
import { ApiOptions } from "@polkadot/api/types";
import { WsProvider } from "@polkadot/rpc-provider";
import { options as acalaOptions } from "@acala-network/api";

// ---------------------- direct WebSocket connection ----------------------- //
const KARURA_WS_ENDPOINT = "wss://karura.api.onfinality.io/public-ws";

export async function initWsConnection(endpoint?: string): Promise<ApiPromise> {
  endpoint = endpoint || KARURA_WS_ENDPOINT;

  const provider = new WsProvider(endpoint);
  const api = new ApiPromise(acalaOptions({ provider }) as ApiOptions);
  await api.isReady;

  return api;
}

// -------------------------------- SubQuery -------------------------------- //
const KARURA_SQ_ENDPOINT =
  "https://api.subquery.network/sq/AcalaNetwork/karura";
// currently not used, as the SQ has problems
export async function sq<T>(query: string, endpoint?: string): Promise<T> {
  endpoint = endpoint || KARURA_SQ_ENDPOINT;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ query }),
  });

  return (await res.json()).data;
}

// ---------------------------------- misc ---------------------------------- //
export function isKaruraAddress(address: string): boolean {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (_) {
    return false;
  }
}

// precision will always be 3
export function fmtBigint(x: bigint, sig?: number): string {
  // default is pico-units (https://wiki.acala.network/karura/get-started/karura-assets)
  sig = sig || 12;
  const milliUnits = x / BigInt(10 ** (sig - 3));
  const milliString = `${milliUnits}`;
  const significand = milliString.slice(0, -3);
  const mantissa = milliString.slice(-3);

  return `${significand}.${mantissa || 0}`;
}
