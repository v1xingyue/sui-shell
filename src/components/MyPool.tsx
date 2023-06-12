import { useEffect, useState } from "react";
import { SuiProvider } from "../utils/provider";
import { useWallet } from "@suiet/wallet-kit";

import {
  CallTarget,
  CoinNameFromBalance,
  ObjectLink,
  StructType,
} from "../utils";
import { TransactionBlock } from "@mysten/sui.js";

const MyPool = () => {
  const [display, updateDisplay] = useState(false);
  const { address, signAndExecuteTransactionBlock } = useWallet();
  const [pools, updatePools] = useState<Array<any>>([]);
  const [coinType, updateCoinType] = useState("0x2::sui::SUI");
  const [amount, updateAmounut] = useState(1000 * 1000 * 100);
  const [addAmount, updateAddAmounut] = useState(1000 * 1000 * 100);
  const [transferInput, updateTransferInput] = useState("");
  const [operatePool, upadteOperatePool] = useState<any>({});
  const provider = SuiProvider();
  useEffect(() => {
    const asyncAction = async () => {
      const mypools = await provider.getOwnedObjects({
        owner: address as any,
        filter: {
          StructType: StructType("coin_pool", "CoinPool"),
        },
        options: {
          showType: true,
          showContent: true,
          showDisplay: false,
        },
      });
      if (mypools && mypools.data) {
        const showData = mypools.data.map((item: any) => {
          console.log(item);
          return {
            id: item.data.objectId,
            balance: item.data.content.fields.balance,
            coinType: item.data.content.type,
          };
        });
        console.log(showData);
        updatePools(showData);
      }
    };
    asyncAction();
  }, []);

  const createPoolWith = async () => {
    if (address != null) {
      const gasFeeCost = 10 ** 5;
      console.log(`operate address ${address} `);
      const tx = new TransactionBlock();
      const coins = tx.splitCoins(tx.gas, [tx.pure(gasFeeCost)]);
      tx.transferObjects([coins[0]], tx.pure(address as string));
      tx.moveCall({
        target: CallTarget("coin_pool", "make_pool_with") as any,
        typeArguments: [coinType],
        arguments: [tx.gas, tx.pure(amount)],
      });
      // console.log(tx);
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx as any,
      });
      console.log(result);
    }
  };

  const addCoinToPool = async (poolId: string) => {
    const gasFeeCost = 10 ** 5;
    console.log(`operate address ${address} `);
    const tx = new TransactionBlock();
    const coins = tx.splitCoins(tx.gas, [tx.pure(gasFeeCost)]);
    tx.transferObjects([coins[0]], tx.pure(address as string));
    tx.moveCall({
      target: CallTarget("coin_pool", "add_coin") as any,
      typeArguments: [coinType],
      arguments: [tx.gas, tx.pure(addAmount), tx.pure(poolId)],
    });
    // console.log(tx);
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log(result);
  };

  type WalletData = { address: string; amount: number };

  const parseWalletData = (input: string): WalletData[] => {
    const regex = /^([^,\n]+),([0-9.]+)$/gm;
    const matches = [...input.matchAll(regex)];

    return matches
      .filter((match) => match[0].trim() !== "") // ignore empty lines
      .map((match) => ({
        address: match[1].trim(),
        amount: parseFloat(match[2].trim()),
      }));
  };

  const doTransfer = async () => {
    updateDisplay(false);
    console.log(`you will do transfer as this list : ${transferInput}`);

    const transferItems = parseWalletData(transferInput);

    const tx = new TransactionBlock();

    transferItems.forEach((item) => {
      tx.moveCall({
        target: CallTarget("coin_pool", "withdraw_to_address") as any,
        typeArguments: [coinType],
        arguments: [
          tx.pure(item.amount),
          tx.pure(item.address),
          tx.pure(operatePool.id as string),
        ],
      });
    });

    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log(result);
  };

  return (
    <>
      <dialog className={display ? "modal modal-open " : "modal"}>
        <form method="dialog" className="modal-box w-11/12 max-w-5xl">
          <button
            onClick={() => updateDisplay(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg">Transfer user details : </h3>
          <p className="py-4">each line for one transfer item. example : </p>
          <p className="py-4">
            <b>
              0x8bdb9075dd5bc3eba5bdde18163280ceb81adbe7761b513f40136d5e6b7bbc0f,123
            </b>
          </p>
          <div>
            <textarea
              value={transferInput}
              onChange={(e) => {
                updateTransferInput(e.target.value);
              }}
              className="textarea textarea-bordered h-72 w-full mt-3"
              placeholder="transfer input"
            />
          </div>
          <div className="modal-action">
            <div>
              <button
                className="btn btn-secondary"
                onClick={() => doTransfer()}
              >
                Do Transfer!!!
              </button>
            </div>
          </div>
        </form>
      </dialog>

      <div className="mt-1">
        <input
          readOnly
          value={coinType}
          type="text"
          placeholder="coin type"
          className="input input-bordered input-info w-96"
          autoFocus
          onChange={(e) => updateCoinType(e.target.value)}
        />
        <input
          value={amount}
          type="number"
          placeholder="coin type"
          className="input input-bordered input-info w-96 ml-3"
          autoFocus
          onChange={(e) => updateAmounut(parseInt(e.target.value))}
        />
        <button onClick={createPoolWith} className="btn btn-info ml-2">
          Create A Pool
        </button>
      </div>

      {pools.length > 0
        ? pools.map((pool: any) => {
            return (
              <div
                className="border-dashed border-2 p-3 rounded-md mt-2"
                key={pool.id}
              >
                <div className="mt-3">
                  <a
                    href={ObjectLink(pool.id)}
                    className="link link-info"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {pool.id}{" "}
                  </a>
                  , {CoinNameFromBalance(pool.coinType)}, {pool.balance}
                  <button
                    className="btn btn-success ml-3"
                    onClick={() => {
                      upadteOperatePool(pool);
                      updateDisplay(true);
                    }}
                  >
                    SendTo
                  </button>
                </div>
                <div className="mt-2">
                  <input
                    value={addAmount}
                    type="number"
                    className="input input-bordered input-info w-96 ml-3"
                    autoFocus
                    onChange={(e) => updateAddAmounut(parseInt(e.target.value))}
                  />
                  <button
                    onClick={(e) => addCoinToPool(pool.id)}
                    className="btn btn-primary ml-2"
                  >
                    Add Coin
                  </button>
                </div>
              </div>
            );
          })
        : null}
    </>
  );
};

export default MyPool;
