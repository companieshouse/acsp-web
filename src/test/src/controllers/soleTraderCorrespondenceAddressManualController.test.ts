import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET /sole-trader/correspondence-address-manual", () => {
    xit("should return status 200", async () => {
        await router.get("/register-acsp/sole-trader/correspondence-address-manual").expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 302 after redirect", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for no addressPropertyDetails, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressPropertyDetails Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc@", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", addressCountry: "lmn", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressPropertyDetails Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4a", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});

// Test for no addressLine1, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressLine1 Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr@", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressLine1 Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});

// Test for no addressLine2, will return 302.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 302", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for incorrect addressLine2 Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "@", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressLine2 Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});

// Test for no addressTown, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressTown Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn@", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressTown Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});

// Test for no addressCounty, will return 302.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for incorrect addressCounty Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmno@", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressCounty Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressCountry: "lmnop", addressPostcode: "MK9 3GB" }).expect(400);
    });
});

// Test for no addressCountry, will return 302.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 302", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for incorrect addressCountry Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmno@", addressPostcode: "MK9 3GB" }).expect(400);
    });
});
// Test for incorrect addressCountry Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A", addressPostcode: "MK9 3GB" }).expect(400);
    });
});

// Test for no addressPostcode, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "abc", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "" }).expect(400);
    });
});
// Test for incorrect addressPostcode Format entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "lmn", addressCounty: "lmnop", addressCountry: "lmnop", addressPostcode: "MK9 3GB@" }).expect(400);
    });
});
// Test for incorrect addressPostcode Length entered, will return 400.
describe("POST /sole-trader/correspondence-address-manual", () => {
    xit("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-manual")
            .send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "abc", addressTown: "abc", addressCounty: "abcop", addressCountry: "abcop", addressPostcode: "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2A3GB" }).expect(400);
    });
});
