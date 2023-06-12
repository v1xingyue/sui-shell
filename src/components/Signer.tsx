import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";

const Signer = () => {
  const wallet = useWallet();
  const [message, updateMessage] = useState("");
  const signerAction = async () => {
    try {
      const msgBytes = new TextEncoder().encode(message);
      const result = await wallet.signMessage({
        message: msgBytes,
      });
      const verifyResult = wallet.verifySignedMessage(result);
      console.log("verify signedMessage", verifyResult);
      if (!verifyResult) {
        alert(`signMessage succeed, but verify signedMessage failed`);
      } else {
        alert(`signMessage succeed, and verify signedMessage succeed!`);
      }
    } catch (e) {
      console.error("signMessage failed", e);
      alert("signMessage failed (see response in the console)");
    }
  };

  return (
    <div className="mt-3">
      <input
        value={message}
        type="text"
        placeholder="message to sign"
        className="input input-bordered input-info w-96"
        autoFocus
        onChange={(e) => updateMessage(e.target.value)}
      />
      <button className="btn btn-primary ml-2" onClick={signerAction}>
        signMessage
      </button>
    </div>
  );
};
export default Signer;
