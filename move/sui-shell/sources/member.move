module sui_shell::member {

    use sui::object::{Self,UID,ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self,Table};
    use sui::clock::{Self, Clock};
    use std::vector::{Self};
    
    const E_Register:u64 = 1;
    
    struct MemberAdminCap has key {id:UID}

    struct GlobalInfo has key {
        id:UID,
        name_no_table: Table<vector<u8>,u64>,
        all_member_addresses: Table<address,bool>,
        all_servers:Table<ID,bool>
    }

    struct MemberInfo has key {
        id:UID,
        name:vector<u8>,
        status:vector<u8>,
        name_no:u64,
        pub_key:vector<u8>,
        addr:address,
        reg_timestamp:u64
    } 

    fun init(ctx:&mut TxContext){
        transfer::share_object(
            GlobalInfo{
                id:object::new(ctx),
                name_no_table:table::new(ctx),
                all_member_addresses: table::new(ctx),
                all_servers: table::new(ctx),
            }
        );
        transfer::transfer(MemberAdminCap{
            id:object::new(ctx)
        },tx_context::sender(ctx));
    }

    fun find_name_no(global_info:&mut GlobalInfo,name:vector<u8>):u64 {
        let idx:u64 = 0;
        if(table::contains(&global_info.name_no_table,name)){
            let _curent = table::borrow_mut(&mut global_info.name_no_table,name);
            idx = *_curent + 1;
            _curent = &mut idx;
        }else{
            table::add(&mut global_info.name_no_table,name,idx);
        };
        idx
    }

    public fun add_server_id(server_id:ID,global_info:&mut GlobalInfo){
        table::add(&mut global_info.all_servers,server_id,true);
    }

    entry fun register(global_info:&mut GlobalInfo,name:vector<u8>,clock: &Clock,ctx:&mut TxContext){
        let addr = tx_context::sender(ctx);
        assert!(!table::contains(&global_info.all_member_addresses,addr),E_Register);
        let current_no = find_name_no(global_info,name);
        transfer::transfer(MemberInfo{
            id:object::new(ctx),
            name,
            status:vector::empty(),
            name_no:current_no,
            addr:tx_context::sender(ctx),
            pub_key:vector::empty(),
            reg_timestamp:clock::timestamp_ms(clock)
        },tx_context::sender(ctx));
        table::add(&mut global_info.all_member_addresses,addr,true);
    }

    entry fun update_public_key(info:&mut MemberInfo,pub_key:vector<u8>){
        info.pub_key = pub_key;
    }

    entry fun update_status(info:&mut MemberInfo,status:vector<u8>){
        info.status = status;
    }

}