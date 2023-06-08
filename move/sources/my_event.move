module sui_shell::my_event {

    use sui::event::{Self};
    use sui::tx_context::{Self, TxContext};

    struct MyEvent has copy,drop {
        sender:address,
        msg: vector<u8>
    }

    public fun fire_event(event:MyEvent){
        event::emit(event);
    }

    public fun fire_msg_ctx(msg:vector<u8>,ctx:&TxContext){
        event::emit(MyEvent{
            msg,
            sender: tx_context::sender(ctx)
        });
    }

    entry fun fire_entry(msg:vector<u8>,ctx:&TxContext){
        fire_msg_ctx(msg,ctx);
    }
    
}