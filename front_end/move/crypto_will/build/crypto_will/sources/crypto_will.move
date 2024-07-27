
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
        timestamp:vector<String>,
        trustee:vector<address>,
        trusteeDescription:vector<String>,
        trusteeTimestamp:vector<String>
    }

    public struct TrusteeRecord has key {
        id:UID,
        testatorAddress:address,
        testatorAlias:String,
        category:vector<String>,
        description:vector<String>,
        encryptedCID:vector<String>,
        filename:vector<String>,
        timestamp:vector<String>,
    }



    public struct Trustee has key {
        id:UID,
        owner:address,
        testator_alias:String,
        timestamp:String
    }

    public struct TrusteeCap has key {
        id:UID,
        testatorAddress:address,
        testatorAlias:String,
        trusteeDescription:String
    }

    public struct PublicKeyCap has key {
        id:UID,
        publicKey:String,
        trusteeAddress:address,
        testatorAlias:String,
        trusteeDescription:String
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
            trustee:vector[],
            trusteeDescription:vector[],
            trusteeTimestamp:vector[],
        }, ctx.sender())
    }

    public fun upload(obj:&mut Record, category:String, description: String, encryptedCID:String, filename:String, timestamp:String ) {
        obj.category.push_back(category);
        obj.description.push_back(description);
        obj.encryptedCID.push_back(encryptedCID);
        obj.filename.push_back(filename);
        obj.timestamp.push_back(timestamp)
    }

    public fun delete(obj:&mut Record, index:u64 ) {
        obj.category.remove(index);
        obj.description.remove(index);
        obj.encryptedCID.remove(index);
        obj.filename.remove(index);
        obj.timestamp.remove(index);
    }
    
    public fun addTrustee(obj:&mut Record, trusteeAddress:address, trusteeDescription:String, testator_alias:String, timestamp:String, ctx: &mut TxContext) {
        obj.trustee.push_back(trusteeAddress);
        obj.trusteeDescription.push_back(trusteeDescription);
        obj.trusteeTimestamp.push_back(timestamp);

        transfer::transfer(Trustee {
            id: object::new(ctx),
            owner:ctx.sender(),
            testator_alias:testator_alias,
            timestamp:timestamp
        }, trusteeAddress);

        transfer::transfer(TrusteeCap {
            id:object::new(ctx),
            testatorAddress:ctx.sender(),
            testatorAlias:testator_alias,
            trusteeDescription:trusteeDescription
            }, trusteeAddress);
    }

    public fun sendPublicKeyCap(cap:TrusteeCap, publicKey:String, trusteeAddress:address, ctx: &mut TxContext) {
        let TrusteeCap { id, testatorAddress, testatorAlias, trusteeDescription } = cap;
        id.delete();
        transfer::transfer(PublicKeyCap {
            id:object::new(ctx),
            publicKey:publicKey,
            trusteeAddress:trusteeAddress,
            testatorAlias:testatorAlias,
            trusteeDescription:trusteeDescription,
        }, testatorAddress);

    }

    public fun transferRecord(cap:PublicKeyCap,category:vector<String>,description:vector<String>,encryptedCID:vector<String>,filename:vector<String>,timestamp:vector<String>,ctx: &mut TxContext){
        let PublicKeyCap { id, publicKey, trusteeAddress, testatorAlias, trusteeDescription } = cap;
        id.delete();
        transfer::transfer({
            TrusteeRecord {
                id:object::new(ctx),
                testatorAddress:ctx.sender(),
                testatorAlias:testatorAlias,
                category:category,
                description:description,
                encryptedCID:encryptedCID,
                filename:filename,
                timestamp:timestamp,
            }
        }, trusteeAddress)


    }

    
}