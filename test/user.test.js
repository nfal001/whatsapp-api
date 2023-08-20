import supertest from "supertest";
import { web } from "../src/application/web";
import { prismaClient } from "../src/application/database";

describe('POST /api/users', function (){

    afterEach(async ()=> {
        await prismaClient.user.deleteMany({
            where: {
                username: "kristofer"
            }
        });
    })

    it("should can register new user", async () => {
        const fetch = await supertest(web)
        .post('/api/users')
        .send({
            username: 'kristofer',
            password: 'secret',
            name: 'kristofer bayu'
        });
        
        const result = await fetch.body

        expect(fetch.status).toBe(200);
        expect(result.status).toBe(true);
        expect(result.data.username).toBe('kristofer');
        expect(result.data.name).toBe('kristofer bayu');
        expect(result.data.password).toBeUndefined;

    });
});