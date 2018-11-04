const uuid = require('uuid');

class Tenant {
    constructor(
        id,
        name,
        address,
        phone,
        status,
        created,
        lastUpdated
    ) {
        
        if (!id) {
            id = uuid.v1();
        }

        if (status) {
            status = 'active';
        }

        if (!created) {
            created = new Date();
        }
        
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.created = created;
        this.lastUpdated = lastUpdated;
    }
}

module.exports = Tenant;