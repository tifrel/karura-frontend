import { ReactElement } from "react";
import LabelledQuantity from "./LabelledQuantity";

interface BalancePanelProps {
  asset: string;
  balance: bigint;
  price: bigint;
}

export default function BalancePanel(props: BalancePanelProps): ReactElement {
  const balanceField = (
    <LabelledQuantity label={`Balance`} value={props.balance} />
  );

  const usdBalance = (props.balance * props.price) / BigInt(1e12).valueOf();
  const usdBalanceField = (
    <LabelledQuantity label={`Balance (USD)`} value={usdBalance} />
  );
  console.log({ balance: props.balance, usdBalance });

  const priceField = <LabelledQuantity label="Price" value={props.price} />;

  return (
    <div id={`balance-panel-${props.asset}`} className="balance-panel">
      <div className="balance-panel-token-field">{props.asset}</div>
      {balanceField}
      {usdBalanceField}
      {priceField}
    </div>
  );
}
