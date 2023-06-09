import { useAccountBalance, useWallet, formatSUI } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
// import { TransactionBlock } from "@mysten/sui.js";
// import { useMemo } from "react";

function App() {
  const wallet = useWallet();
  const { balance } = useAccountBalance();
  // const nftContractAddr = useMemo(() => {
  //   if (!wallet.chain) return "";
  //   return sampleNft.get(wallet.chain.id) ?? "";
  // }, [wallet]);

  function uint8arrayToHex(value: Uint8Array | undefined) {
    if (!value) return "";
    // @ts-ignore
    return value.toString("hex");
  }

  // async function handleExecuteMoveCall(target: string | undefined) {
  //   if (!target) return;

  //   try {
  //     const tx = new TransactionBlock();
  //     tx.moveCall({
  //       target: target as any,
  //       arguments: [
  //         tx.pure("Suiet NFT"),
  //         tx.pure("Suiet Sample NFT"),
  //         tx.pure(
  //           "https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"
  //         ),
  //       ],
  //     });
  //     const resData = await wallet.signAndExecuteTransactionBlock({
  //       transactionBlock: tx,
  //     });
  //     console.log("executeMoveCall success", resData);
  //     alert("executeMoveCall succeeded (see response in the console)");
  //   } catch (e) {
  //     console.error("executeMoveCall failed", e);
  //     alert("executeMoveCall failed (see response in the console)");
  //   }
  // }

  async function handleSignMsg() {
    try {
      const msg = "Hello world!";
      const msgBytes = new TextEncoder().encode(msg);
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
  }

  return (
    <div className="card">
      <div className="card-body">
        <h1>sui-shell manager</h1>
        <div className="card">
          {!wallet.connected ? (
            <p>Connect DApp with Suiet wallet from now!</p>
          ) : (
            <div>
              <div className="text-xl">
                <p>current wallet: {wallet.adapter?.name}</p>
                <p>
                  wallet status:{" "}
                  {wallet.connecting
                    ? "connecting"
                    : wallet.connected
                    ? "connected"
                    : "disconnected"}
                </p>
                <p>wallet address: {wallet.account?.address}</p>
                <p>current network: {wallet.chain?.name}</p>
                <p>
                  wallet balance:{" "}
                  {formatSUI(balance ?? 0, {
                    withAbbr: false,
                  })}{" "}
                  SUI
                </p>
                <p>
                  wallet publicKey: {uint8arrayToHex(wallet.account?.publicKey)}
                </p>
              </div>
              <div className="btn-group" style={{ margin: "8px 0" }}>
                <button
                  className="btn btn-primary ml-2"
                  onClick={handleSignMsg}
                >
                  signMessage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
