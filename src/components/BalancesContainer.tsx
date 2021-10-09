import React from "react";
import { PriceDict, getPrices } from "../utils/prices";
import { BalanceDict, LpSpec, getBalances } from "../utils/balances";
import AddressInput from "./AddressInput";
import BalancePanel from "./BalancePanel";
import { isKaruraAddress } from "../utils";
import { ApiPromise } from "@polkadot/api";

interface BalancesContainerProps {
  api: ApiPromise;
  tokens: Array<string>;
  lpSpecs: Array<LpSpec>;
}

interface BalancesContainerState {
  tokens: Array<string>;
  address?: string;
  statusMessage?: string;
  prices: PriceDict;
  balances: BalanceDict;
}

export class BalancesContainer extends React.Component<
  BalancesContainerProps,
  BalancesContainerState
> {
  constructor(props: BalancesContainerProps) {
    super(props);

    // init prices and balances
    const prices: PriceDict = {};
    const balances: BalanceDict = {};
    const tokens = Object.keys(balances).sort();
    tokens.forEach((token) => {
      prices[token] = 0n;
      balances[token] = 0n;
    });
    this.state = { prices, balances, tokens };

    // initialize price updating logic
    const fetchPrices = async () => {
      const prices = await getPrices(tokens, this.props.api);
      this.setState({ prices });

      // update again in 5 seconds
      setTimeout(fetchPrices, 5000);
    };
    setTimeout(fetchPrices, 50);
  }

  getPrice(token: string): bigint {
    return this.state.prices[token] || 0n;
  }
  // omRCxDttLgqMeTADypXT5PDss23ucFPUWDy8rTvd9up6jen
  // p7nKeJt1wXXE8UCSgKKvsHn5ysZNx9vKXkbzSxjSg2oT4hX

  render() {
    const handleAddressInput = async (address: string) => {
      this.setState({
        address,
        statusMessage: isKaruraAddress(address)
          ? "Fetching data..."
          : "Your address is invalid",
      });

      try {
        // fetch the data
        const balances = await getBalances(address, this.props);
        console.log(balances);
        const tokens = Object.keys(balances).sort();
        // update state
        this.setState({ balances, tokens, statusMessage: undefined });
      } catch (e) {
        const statusMessage = `Querying failed! (${(e as Error).toString()})`;
        this.setState({ statusMessage });
      }
    };

    // TODO: styling of status-message div
    return (
      <div className="balances-container">
        <AddressInput handler={handleAddressInput} />
        <div>{this.state.statusMessage}</div>
        {this.state.tokens.map((token) => (
          <BalancePanel
            key={`balance-panel-${token}`}
            token={token}
            balance={this.state.balances[token]}
            price={this.getPrice(token)}
          />
        ))}
      </div>
    );
  }
}
