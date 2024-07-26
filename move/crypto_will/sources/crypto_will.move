
/// Module: crypto_will
module crypto_will::crypto_will {
    use std::string::String;

    public struct Record has key {
        id:UID,
        owner:address,
        category:vector<String>,
        description:vector<String>,
        encryptedCID:vector<String>,
        filename:vector<String>,
        timestamp:vector<String>
    }

    public fun new(ctx: &mut TxContext) {
        transfer::transfer(Record {
            id: object::new(ctx),
            owner: ctx.sender(),
            category:vector[],
            description:vector[],
            encryptedCID:vector[],
            filename:vector[],
            timestamp:vector[],
        }, ctx.sender())
    }

    public fun upload(obj:&mut Record, category:String, description: String, encryptedCID:String, filename:String, timestamp:String ) {
        obj.category.push_back(category);
        obj.description.push_back(description);
        obj.encryptedCID.push_back(encryptedCID);
        obj.filename.push_back(filename);
        obj.timestamp.push_back(timestamp);
    }

    
}

