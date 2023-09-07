import { prismaClient } from "../application/database.js";
import { WAClient } from "../whatsapp/whatsapp.js";

console.time("queryTime")
// View client table and create new WAClient Instance
const oke = await prismaClient.client.findMany({
    select:{
        id: true,
        client_name:true,
        username: true
    }
})
console.log(oke);
console.log("");
console.log("");
console.timeEnd("queryTime")
console.log("");

const ko = {}


for(a in oke) {
    const ikon = new WAClient(a.client_name, a.username);
    ko[ikon.clientInstanceName + "_" + a.username] = ikon;
}

console.log("");


console.log(ko);