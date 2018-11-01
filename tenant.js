const uuid = require('uuid');

class Tenant {
    constructor(
        id,
        name,
        address,
        phone
    ) {
        
        if (!id) {
            id = uuid.v1();
        }
        
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
    }
}

module.exports = Tenant;