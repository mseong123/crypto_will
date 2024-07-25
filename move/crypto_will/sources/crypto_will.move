
/// Module: crypto_will
module crypto_will::crypto_will {
    use std::string::String;
    // use sui::clock::Clock;

    // public struct File has key, store {
    //     id: UID,
    //     cid: u64,
    //     description:String
    // }

    public struct Record has key {
        id:UID,
        owner:address,
        description:vector<String>,
        cid:vector<String>,
        timestamp:vector<u64>
    }

    public fun new(ctx: &mut TxContext) {
        transfer::transfer(Record {
            id: object::new(ctx),
            owner: ctx.sender(),
            description:vector[],
            cid:vector[],
            timestamp:vector[],
        }, ctx.sender())
    }

    public fun upload(obj:&mut Record, description: String, cid:String) {
        obj.description.push_back(description);
        obj.cid.push_back(cid);
        // obj.timestamp.push_back(clock.timestamp_ms())
    }

    
}

