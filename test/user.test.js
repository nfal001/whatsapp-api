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
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username: 'kristofer',
            password: 'secret',
            name: 'kristofer bayu'
        });

        expect(result.status).toBe(200);
        expect(result.body.username).toBe('kristofer');
        expect(result.body.name).toBe('kristofer bayu');
        expect(result.body.password).toBeUndefined;


    });
});