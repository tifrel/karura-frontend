import { KeyboardEvent, ReactElement } from "react";

interface AddressInputProps {
  handler: (_value: string) => void;
  validator?: (_value: string) => boolean;
}

export default function AddressInput(props: AddressInputProps): ReactElement {
  const handler = (e: KeyboardEvent<HTMLInputElement>) => {
    // do nothing unless key was enter
    if (e.key !== "Enter") return;

    // if valid, trigger props.handler with value
    props.handler((e.target as HTMLInputElement).value);
  };
  return (
    <input
      className="address-input"
      placeholder="Enter your public address here"
      onKeyUp={handler}
    />
  );
}
