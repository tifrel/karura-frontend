import React from "react";
import LabelledQuantity from "./LabelledQuantity";

interface BalancePanelProps {
  token: string;
  balance: bigint;
  price: bigint;
}

export default function BalancePanel(
  props: BalancePanelProps
): React.ReactElement {
  const balanceField = (
    <LabelledQuantity label={`Balance`} value={props.balance} />
  );

  // console.log(props);
  const kusdBalance = (props.balance * props.price) / BigInt(1e12).valueOf();

  const kusdBalanceField = (
    <LabelledQuantity label={`Balance (kUSD)`} value={kusdBalance} />
  );

  const priceField = <LabelledQuantity label="Price" value={props.price} />;
  return (
    <div id={`balance-panel-${props.token}`} className="balance-panel">
      <div className="balance-panel-token-field">{props.token}</div>
      {balanceField}
      {kusdBalanceField}
      {priceField}
    </div>
  );
}
