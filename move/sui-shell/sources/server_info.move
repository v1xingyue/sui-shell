module sui_shell::server {

    use sui::object::{Self,UID,ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui_shell::member::{MemberInfo,GlobalInfo,add_server_id};
    use sui::table::{Self,Table};
    

    const E_Applyed:u64 = 1;
    const E_CapNotPaired:u64 = 2;
    const E_NotApplyed:u64 = 3;

    const StatusApply:u8 = 1;
    const StatusNormal :u8 = 2;
    const StatusForbidden :u8 = 3;

    struct ServerPubInfo has key {
        id:UID,
        name: vector<u8>,
        description: vector<u8>,
        owner:address,
        member_acl: Table<address,u8>
    }
    
    struct ServerAdminCap has key {
        id:UID,
        server_info_id: ID
    }

    public fun cap_server_paired(cap: &ServerAdminCap, server: &ServerPubInfo): bool {
        cap.server_info_id == object::id(server)
    }

    fun update_server_member_status(status:&mut u8,server: &mut ServerPubInfo,member_info_address:address) {
        let _curent = table::borrow_mut(&mut server.member_acl,member_info_address);
        _curent = status;
    }

    entry fun register_server(name:vector<u8>,description:vector<u8>,global_info:&mut GlobalInfo,ctx:&mut TxContext){
        let call_address = tx_context::sender(ctx);
        let server_info = ServerPubInfo{
            id:object::new(ctx),
            name,
            description,
            owner:call_address,
            member_acl:table::new(ctx)
        };
        let server_id = object::id(&server_info);
        transfer::transfer(ServerAdminCap{
            id:object::new(ctx),
            server_info_id:server_id,
        },call_address);
        transfer::share_object(server_info);
        add_server_id(server_id,global_info);   
    }

    entry fun apply_server(server: &mut ServerPubInfo,member: &MemberInfo){
        let member_info_address = object::id_to_address(&object::id(member));
        assert!(!table::contains(&server.member_acl,member_info_address),E_Applyed);
        table::add(&mut server.member_acl,member_info_address,StatusApply);
    }

    entry fun pass_member(cap: &ServerAdminCap, server: &mut ServerPubInfo,member: &MemberInfo){
        assert!(cap_server_paired(cap, server),E_CapNotPaired);
        let member_info_address = object::id_to_address(&object::id(member));
        assert!(table::contains(&server.member_acl,member_info_address),E_NotApplyed);
        update_server_member_status(&mut StatusNormal,server,member_info_address);
    }

    entry fun forbidden_member(cap: &ServerAdminCap, server: &mut ServerPubInfo,member: &MemberInfo){
        assert!(cap_server_paired(cap, server),E_CapNotPaired);
        let member_info_address = object::id_to_address(&object::id(member));
        assert!(table::contains(&server.member_acl,member_info_address),E_NotApplyed);
        update_server_member_status(&mut StatusForbidden,server,member_info_address);
    }

}