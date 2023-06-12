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
  const { address, signAndExecuteTransactionBlock } = useWallet();
  const [pools, updatePools] = useState<Array<any>>([]);
  const [coinType, updateCoinType] = useState("0x2::sui::SUI");
  const [amount, updateAmounut] = useState(1000 * 1000 * 100);
  const [addAmount, updateAddAmounut] = useState(1000 * 1000 * 100);
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
      arguments: [tx.gas, tx.pure(amount), tx.pure(poolId)],
    });
    // console.log(tx);
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log(result);
  };

  const sendToUsers = async () => {};

  return (
    <>
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
                    onClick={sendToUsers}
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
