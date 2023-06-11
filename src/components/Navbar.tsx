import { useWallet, ConnectButton, ErrorCode } from "@suiet/wallet-kit";
import { PackageLink } from "../utils";

const Navbar = () => {
  const { chain } = useWallet();

  return (
    <div className="navbar bg-base-100 mb-3">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost normal-case text-xl">
          sui-shell
        </a>

        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/server">Server</a>
          </li>
          <li>
            <a href="/client">Client</a>
          </li>

          <li tabIndex={0}>
            <details>
              <summary>more</summary>
              <ul className="p-2">
                <li>
                  <a href={PackageLink()} target="_blank" rel="noreferrer">
                    Contract On Explorer
                  </a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <span className="mr-3">{chain?.name}</span>
        <ConnectButton
          onConnectError={(error) => {
            if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
              console.warn(
                `user rejected the connection to  ${error.details?.wallet}`
              );
            } else {
              console.warn("unknown connect error: ", error);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
