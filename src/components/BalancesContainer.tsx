import { ReactElement, useState, useEffect } from "react";
import AddressInput from "./AddressInput";
import BalancePanel from "./BalancePanel";

import { getPrices } from "../utils/prices";
import { getBalances } from "../utils/balances";
import { isKaruraAddress, initDict, LpSpec, toString } from "../utils";
import { ApiPromise } from "@polkadot/api";

interface BalancesContainerProps {
  api: ApiPromise;
  tokens: Array<string>;
  lpSpecs: Array<LpSpec>;
}

export default function BalancesContainer(
  props: BalancesContainerProps
): ReactElement {
  // state
  const assets = [...props.tokens, ...props.lpSpecs.map(toString)];
  const [_address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [prices, setPrices] = useState(initDict(assets, BigInt(0)));
  const [balances, setBalances] = useState(initDict(assets, BigInt(0)));

  // input handling
  const handleAddressInput = async (addr: string) => {
    setAddress(addr);
    setStatus(isKaruraAddress(addr) ? "Fetching data..." : "Invalid address");

    try {
      setBalances(await getBalances(addr, props));
      setStatus("");
    } catch (e) {
      setStatus(`Querying failed! (${(e as Error).toString()})`);
    }
  };

  // price polling
  useEffect(() => {
    const intervalHandle = setInterval(async () => {
      setPrices(await getPrices(props));
    }, 5000);
    return () => {
      clearTimeout(intervalHandle);
    };
  });

  return (
    <div className="balances-container">
      <AddressInput handler={handleAddressInput} />
      <div>{status}</div>
      {assets.map((asset) => (
        <BalancePanel
          key={`balance-panel-${asset}`}
          asset={asset}
          balance={balances[asset]}
          price={prices[asset]}
        />
      ))}
    </div>
  );
}
