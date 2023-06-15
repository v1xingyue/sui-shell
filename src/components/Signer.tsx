import { useWallet } from "@suiet/wallet-kit";
import { fromSerializedSignature } from "@mysten/sui.js";
import { useState } from "react";

const Signer = () => {
  const [result, updateResult] = useState({});
  const [verifyResult, updateVerifyResult] = useState(false);
  const wallet = useWallet();
  const [message, updateMessage] = useState("hello world");
  const signerAction = async () => {
    try {
      const msgBytes = new TextEncoder().encode(message);
      const result = await wallet.signMessage({
        message: msgBytes,
      });
      updateVerifyResult(wallet.verifySignedMessage(result));
      const signature = fromSerializedSignature(result.signature);
      console.log(signature);
      updateResult({
        signatureScheme: signature.signatureScheme,
        pubKey: Buffer.from(signature.pubKey.toBytes()).toString("hex"),
        signatureRaw: signature.signature.toString(),
        signature: Buffer.from(signature.signature).toString("hex"),
        signatureB64: Buffer.from(signature.signature).toString("base64"),
        message: result.messageBytes,
      });
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
      <div>
        <p>{verifyResult ? "true" : "false"}</p>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
};
export default Signer;
