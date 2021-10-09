import React from "react";
import { fmtBigint } from "../utils";

interface LabelledQuantityProps {
  label: string;
  value: bigint;
}

export default function LabelledQuantity(
  props: LabelledQuantityProps
): React.ReactElement {
  return (
    <div className="labelled-quantity">
      <div className="labbeled-quantity-label-field">{props.label}</div>
      <div className="labbeled-quantity-value-field">
        {fmtBigint(props.value)}
      </div>
    </div>
  );
}
