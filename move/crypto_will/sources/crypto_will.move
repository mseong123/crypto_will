
/// Module: crypto_will
module crypto_will::crypto_will {
    use std::string::String;

    public struct File has key, store {
        id: UID,
        cid: u64,
        description:String
    }

    public struct Record has key {
        id:UID,
        owner:address,
        files:vector<File>
    }

    public fun new(ctx: &mut TxContext) {
        transfer::transfer(Record {
            id: object::new(ctx),
            owner: ctx.sender(),
            files:vector[]
        }, ctx.sender())
    }

    public fun upload(obj:&mut Record, ctx: &mut TxContext, description: String, cid:u64) {
        let file = File {
            id: object::new(ctx),
            cid,
            description,
        };
        obj.files.push_back(file);
    }

    
}

