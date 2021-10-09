//import React from 'react';
import { BalancesContainer } from "./components/BalancesContainer";
import "./App.css";
import { LpSpec } from "./utils/balances";
import { ApiPromise } from "@polkadot/api";

const TOKENS = ["KAR", "KSM", "KUSD", "LKSM"];
const LP_SPECS: Array<LpSpec> = [
  ["KSM", "LKSM"],
  ["KUSD", "KSM"],
  ["KAR", "KSM"],
];
function App({ api }: { api: ApiPromise }) {
  return (
    <div className="App">
      <BalancesContainer api={api} tokens={TOKENS} lpSpecs={LP_SPECS} />
    </div>
  );
}

export default App;
