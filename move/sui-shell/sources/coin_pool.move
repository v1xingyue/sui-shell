module sui_shell::coin_pool {

    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self,Coin};
    use sui::balance::{Self,Balance};

    const E_NotEnough:u64 = 1;

    struct CoinPool<phantom T> has key {
        id: UID,
        balance: Balance<T>
    }

    entry fun make_pool<T>(ctx:&mut TxContext){
        transfer::transfer(CoinPool{
            id:object::new(ctx),
            balance: balance::zero<T>()
        },tx_context::sender(ctx));
    }

    entry fun make_pool_with<T>(c:&mut Coin<T>,amount:u64,ctx:&mut TxContext){
        let pool = CoinPool{
            id:object::new(ctx),
            balance: balance::zero<T>()
        };
        add_coin<T>(c,amount,&mut pool,ctx);
        transfer::transfer(pool,tx_context::sender(ctx));
    }

     entry fun add_coin<T>(c:&mut Coin<T>,amount:u64,pool: &mut CoinPool<T>,ctx:&mut TxContext){
        let need_coin = coin::split<T>(c,amount,ctx);
        let  b = coin::into_balance<T>(need_coin);
        balance::join(&mut pool.balance, b);
    }

    entry fun withdraw_to_address<T>(amount:u64,dst:address,pool: &mut CoinPool<T>,ctx:&mut TxContext){
        let pool_amount  = balance::value(&pool.balance);
        assert!(pool_amount > amount,E_NotEnough);
        let coin = coin::take(&mut pool.balance, amount, ctx);
        transfer::public_transfer(coin, dst);
    }
}