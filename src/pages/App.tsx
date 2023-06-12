import { useAccountBalance, useWallet, formatSUI } from "@suiet/wallet-kit";
import { GlobalID } from "../utils/const";
import { Signer } from "../components";
import { AddressLink, BytesToHex, ObjectLink } from "../utils";

const App = () => {
  const wallet = useWallet();
  const { balance } = useAccountBalance();

  return (
    <>
      <p>
        Global :{" "}
        <a
          className="font-bold link-hover link-success"
          href={ObjectLink(GlobalID)}
          target="_blank"
          rel="noreferrer"
        >
          {GlobalID}
        </a>
      </p>

      {!wallet.connected ? (
        <p>Connect DApp with Suiet wallet from now!</p>
      ) : (
        <div>
          <div>
            <p>current wallet: {wallet.adapter?.name}</p>
            <p>
              wallet status:{" "}
              {wallet.connecting
                ? "connecting"
                : wallet.connected
                ? "connected"
                : "disconnected"}
            </p>
            <p>
              wallet address:
              <a
                className="font-bold link-hover link-info"
                target="_blank"
                rel="noreferrer"
                href={AddressLink(wallet.account?.address as string)}
              >
                {wallet.account?.address}
              </a>
            </p>
            <p>current network: {wallet.chain?.name}</p>
            <p>wallet publicKey: {BytesToHex(wallet.account?.publicKey)}</p>
            <p>
              wallet balance:{" "}
              {formatSUI(balance ?? 0, {
                withAbbr: false,
              })}{" "}
              SUI
            </p>

            <Signer />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
