import React, { KeyboardEvent } from "react";

// import { isKaruraAddress } from "../utils";

interface AddressInputProps {
  handler: (value: string) => void;
  validator?: (value: string) => boolean;
}

export default function AddressInput(
  props: AddressInputProps
): React.ReactElement {
  // const [isValid, setIsValid] = useState(false);

  // const validator = props.validator || isKaruraAddress;
  const handler = (e: KeyboardEvent<HTMLInputElement>) => {
    // do nothing unless key was enter
    if (e.key !== "Enter") return;

    // const address = (e.target as HTMLInputElement).value;
    // // check validity
    // if (!validator(address)) {
    //   setIsValid(false);
    //   return;
    // }

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

// export default class AddressInput extends React.Component<
//   AddressInputProps,
//   AddressInputState
// > {
//   constructor(props: AddressInputProps) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     const validator = this.props.validator || isKaruraAddress;

//     const handler = () => {
//       // do nothing unless key was enter
//       // check validity
//       // if valid, trigger props.handler with value
//     };

//     return (
//       <input
//         className="address-input"
//         placeholder="Enter your public address here"
//       />
//     );
//   }
// }
