module sui_shell::table_usage {

    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::table::{Self,Table};

    struct TableBox has key {
        id:UID,
        data: Table<address,u8>
    }

    fun init(ctx:&mut TxContext){
        transfer::transfer(TableBox{
            id:object::new(ctx),
            data:table::new(ctx)
        },tx_context::sender(ctx));
    }

    entry fun update_value(b:&mut TableBox,ctx:&mut TxContext){
        let addr = tx_context::sender(ctx);
        let _curent = table::borrow_mut(&mut b.data,addr);
        *_curent = 12;
    }

    entry fun init_value(b:&mut TableBox,ctx:&mut TxContext){
        let addr = tx_context::sender(ctx);
        table::add(&mut b.data,addr,123);
    }

}