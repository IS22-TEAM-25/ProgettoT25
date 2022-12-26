const { default: mongoose } = require('mongoose');
require('dotenv').config();
const app = require("../src/server");
const checks = require('../src/auxiliaries/checks');
const createId = require('../src/auxiliaries/createId');
const df = require('../src/auxiliaries/dateFunction');
const rs = require('../src/auxiliaries/randomString');
const f = require('../src/auxiliaries/filtraggio');

let server;

module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js']
}

beforeAll( async () => {
    jest.setTimeout(20000)
    app.locals.db = await mongoose.connect(process.env.DB_URI)
    server = app.listen(process.env.PORT || 8080);
})

afterAll(() => {
    mongoose.connection.close(true);
    server.close();
})

describe('Suite testing function "checkPw" in file "checks"', () => {
    test('Testing with pass.length < 8', () => {
        const output = checks.checkPw("pwcorta");
        expect(output).toEqual(false);
    })
    test('Testing with pass.length > 8 and no special character', () => {
        const output = checks.checkPw("pwlungamanonspecial");
        expect(output).toEqual(false);
    })
    test('Testing with pass.length > 8 and yes special character', () => {
        let output = checks.checkPw("passwordok!");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok!");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok£");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok$");
        expect(output).toEqual(false);
        output = checks.checkPw("passwordok?");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok%");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok€");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok=");
        expect(output).toEqual(true);
        output = checks.checkPw("passwordok^");
        expect(output).toEqual(true);
    })
})

describe('Suite testing function "validateEmail" in file "checks"', () => {
    test('Testing with email not valid', () => {
        let output = checks.validateEmail("ciao");
        expect(output).toEqual(null);
        output = checks.validateEmail("ciao");
        expect(output).toEqual(null);
        output = checks.validateEmail("ciao@@email.com");
        expect(output).toEqual(null);
        output = checks.validateEmail("@ciao@email.it");
        expect(output).toEqual(null);
        output = checks.validateEmail("ciao@email.it@email.it");
        expect(output).toEqual(null);
        output = checks.validateEmail("@email.itciao");
        expect(output).toEqual(null);
        output = checks.validateEmail("ciao@ciao..it");
        expect(output).toEqual(null);
        output = checks.validateEmail("ciao@example@.it");
        expect(output).toEqual(null);
        
    })
    test('Testing with email valid', () => {
        let output = checks.validateEmail("ciao@ciao.it.it");
        expect(output).toEqual(expect.arrayContaining(["ciao@ciao.it.it"]));
        output = checks.validateEmail("ciao@ciao.it");
        expect(output).toEqual(expect.arrayContaining(["ciao@ciao.it"]));
        output = checks.validateEmail("marco.rossi@ciao.it");
        expect(output).toEqual(expect.arrayContaining(["marco.rossi@ciao.it"]));
        output = checks.validateEmail("marco.rossi@ciao.ciao.it");
        expect(output).toEqual(expect.arrayContaining(["marco.rossi@ciao.ciao.it"]));
        output = checks.validateEmail("ciao@ciao.it");
        expect(output).toEqual(expect.arrayContaining(["ciao@ciao.it"]));
        output = checks.validateEmail("gabriele.volani@studenti.unitn.it");
        expect(output).toEqual(expect.arrayContaining(["gabriele.volani@studenti.unitn.it"]));
    })

})

describe('Suite testing function "validateDate" in file "checks"', () => {
    test('Testing with date not valid', () => {
        let output = checks.validateDate("17-02-20");
        expect(output).toEqual(null);
        output = checks.validateDate("2002-17-02");
        expect(output).toEqual(null);
        output = checks.validateDate("17-2002");
        expect(output).toEqual(null);
        output = checks.validateDate("17-2-2002");
        expect(output).toEqual(null);        
    })
    test('Testing with date valid', () => {
        let output = checks.validateDate("17-02-2002");
        expect(output).toEqual(expect.arrayContaining(["17-02-2002"]));
        output = checks.validateDate("55-55-2055");
        expect(output).toEqual(expect.arrayContaining(["55-55-2055"]));
        output = checks.validateDate("17-01-2002");
        expect(output).toEqual(expect.arrayContaining(["17-01-2002"]));
        output = checks.validateDate("02-02-2002");
        expect(output).toEqual(expect.arrayContaining(["02-02-2002"]));      
    })
})

describe('Suite testing function "createId" in file "createId"', () => {
    test('Testing with some test cases', () => {
        let output = createId.createId(new Date('2022-02-17'), 'Telefono', 'user1', 'user2');
        expect(output).toEqual(expect.any(String));
        expect(output.split("-")).toEqual(expect.arrayContaining(["T"]));
        expect(output.split("-")).toEqual(expect.arrayContaining(['u']));
        expect(output.split("-")).toEqual(expect.arrayContaining(['u']));
        expect(output.split("-")).toHaveLength(4);

        output = createId.createId(new Date('2012-02-17'), 'Telefono2', 'user3', 'user2');
        expect(output).toEqual(expect.any(String));
        expect(output.split("-")).toEqual(expect.arrayContaining(["T"]));
        expect(output.split("-")).toEqual(expect.arrayContaining(['u']));
        expect(output.split("-")).toEqual(expect.arrayContaining(['u']));
        expect(output.split("-")).toHaveLength(4);


        output = createId.createId(new Date('2022-12-15'), 'Computer', 'Marco', 'matteo');
        expect(output).toEqual(expect.any(String));
        expect(output.split("-")).toEqual(expect.arrayContaining(["C"]));
        expect(output.split("-")).toEqual(expect.arrayContaining(['M']));
        expect(output.split("-")).toEqual(expect.arrayContaining(['m']));
        expect(output.split("-")).toHaveLength(4);


        output = createId.createId(new Date('2022-12-25'), 'marionetta', 'user1', 'Piero');
        expect(output).toEqual(expect.any(String));
        expect(output.split("-")).toEqual(expect.arrayContaining(["m"]));
        expect(output.split("-")).toEqual(expect.arrayContaining(['u']));
        expect(output.split("-")).toEqual(expect.arrayContaining(['P']));
        expect(output.split("-")).toHaveLength(4);

    })

})

describe('Suite testing function "convertDate" in file "dateFunction"', () => {
    test('Testing with some test cases', () => {
        let output = df.convertDate("17-02-2002");
        expect(output).toEqual("2002-02-17");
        output = df.convertDate("25-12-2022");
        expect(output).toEqual("2022-12-25");
        output = df.convertDate("17-03-1969");
        expect(output).toEqual("1969-03-17");
        output = df.convertDate("04-01-1974");
        expect(output).toEqual("1974-01-04");
        output = df.convertDate("02-1-1951");
        expect(output).toEqual("1951-1-02");
        output = df.convertDate("a-b-c");
        expect(output).toEqual("c-b-a");
        output = df.convertDate("1-1-1999");
        expect(output).toEqual("1999-1-1");
        output = df.convertDate("30-1-2009");
        expect(output).toEqual("2009-1-30");
    })
})

describe('Suite testing function "convertDate2" in file "dateFunction"', () => {
    test('Testing with some test cases', () => {
        let output = df.convertDate2("2002-02-17");
        expect(output).toEqual("17-02-2002");
        output = df.convertDate2("2022-12-25");
        expect(output).toEqual("25-12-2022");
        output = df.convertDate2("1969-03-17");
        expect(output).toEqual("17-03-1969");
        output = df.convertDate2("1974-01-04");
        expect(output).toEqual("04-01-1974");
        output = df.convertDate2("1951-1-02");
        expect(output).toEqual("02-1-1951");
        output = df.convertDate2("c-b-a");
        expect(output).toEqual("a-b-c");
        output = df.convertDate2("1999-1-1");
        expect(output).toEqual("1-1-1999");
        output = df.convertDate2("2009-1-30");
        expect(output).toEqual("30-1-2009");
    })
})

describe('Suite testing function "validateDate" in file "dateFunction"', () => {
    test('Testing with date not valid', () => {
        let output = df.validateDate("17-02-20");
        expect(output).toEqual(null);
        output = df.validateDate("2002-17-02");
        expect(output).toEqual(null);
        output = df.validateDate("17-2002");
        expect(output).toEqual(null);
        output = df.validateDate("17-2-2002");
        expect(output).toEqual(null);        
    })
    test('Testing with date valid', () => {
        let output = df.validateDate("17-02-2002");
        expect(output).toEqual(expect.arrayContaining(["17-02-2002"]));
        output = df.validateDate("55-55-2055");
        expect(output).toEqual(expect.arrayContaining(["55-55-2055"]));
        output = df.validateDate("17-01-2002");
        expect(output).toEqual(expect.arrayContaining(["17-01-2002"]));
        output = df.validateDate("02-02-2002");
        expect(output).toEqual(expect.arrayContaining(["02-02-2002"]));      
    })

})

describe('Suite testing function "validateDate2" in file "dateFunction"', () => {
    test('Testing with date not valid', () => {
        let output = df.validateDate2("20-02-17");
        expect(output).toEqual(null);
        output = df.validateDate2("02-17-2002");
        expect(output).toEqual(null);
        output = df.validateDate2("2002-17");
        expect(output).toEqual(null);
        output = df.validateDate2("2002-2-17");
        expect(output).toEqual(null);        
    })
    test('Testing with date valid', () => {
        let output = df.validateDate2("2002-02-17");
        expect(output).toEqual(expect.arrayContaining(["2002-02-17"]));
        output = df.validateDate2("2055-55-55");
        expect(output).toEqual(expect.arrayContaining(["2055-55-55"]));
        output = df.validateDate2("2002-01-17");
        expect(output).toEqual(expect.arrayContaining(["2002-01-17"]));
        output = df.validateDate2("2002-02-02");
        expect(output).toEqual(expect.arrayContaining(["2002-02-02"]));      
    })

})

describe('Suite testing function "createRandomString" in file "randomString"', () => {
    it("Testing with some test cases", () => {
        let output = rs(0);
        expect(output).toEqual("");
        output = rs(1);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(1);
        output = rs(2);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(2);
        output = rs(3);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(3);
        output = rs(4);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(4);
        output = rs(5);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(5);
        output = rs(6);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(6);
        output = rs(10);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(10);
        output = rs(12);
        expect(output).toEqual(expect.any(String));
        expect(output.length).toEqual(12);
    })
})

describe('Suite testing function "filterByTermDesc" in file "filtraggio"', () => {
    let inputArray = [
        {
            titolo : "titolo1",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo1",
            modalitaTransazione : "Vendita",
            categoria : "sport",
            via : "via Sommarive 20",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "true",
            prezzo : 66.6
        },
        {
            titolo : "titolo2",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo2 - sport",
            modalitaTransazione : "Affitto",
            categoria : "sport",
            via : "via Sommarive 20",
            citta : "Trento",
            provincia : "Trento",
            pagamentoOnline : "false",
            prezzoAffittoAlGiorno : 10,
            prezzoAffittoSettimanale : 50,
            prezzoAffittoAllOra : 5
        },
        {
            titolo : "titolo3",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo3 - hobby",
            modalitaTransazione : "Vendita",
            categoria : "hobby",
            via : "via Sommarive 55",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "false",
            prezzo : 15.55
        },
        {
            titolo : "titolo4",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo4 - fai da te",
            modalitaTransazione : "Affitto",
            categoria : "fai da te",
            via : "piazza Duomo 20",
            citta : "Milano",
            provincia : "Milano",
            pagamentoOnline : "true",
            prezzoAffittoAlGiorno : 150,
            prezzoAffittoSettimanale : 450,
            prezzoAffittoAllOra : 15
        },
        {
            titolo : "titolo5",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo5 - animali",
            modalitaTransazione : "Vendita",
            categoria : "animali",
            pagamentoOnline : "true",
            prezzo : 180.46
        },
        {
            titolo : "titolo6",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo6 - sport",
            modalitaTransazione : "Vendita",
            categoria : "animali",
            via : "via Sommarive 20",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "false",
            prezzo : 1500
        },
        {
            titolo : "titolo7",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo7 - sport hobby",
            modalitaTransazione : "Vendita",
            categoria : "sport",
            via : "via Sommarive 20",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "true",
            prezzo : 150
        }
    ]
    it("Testing with some test cases", () => {
        let output = f.filterByTermDesc(inputArray,"titolo");
        expect(output).toHaveLength(7)

        output = f.filterByTermDesc(inputArray,"TITOLO");
        expect(output).toHaveLength(7)

        output = f.filterByTermDesc(inputArray,"sPoRT");
        expect(output).toHaveLength(3)

        output = f.filterByTermDesc(inputArray,"hobby");
        expect(output).toHaveLength(2)

    });
})

describe('Suite testing function "filterByTerm" in file "filtraggio"', () => {
    let inputArray = [
        {
            titolo : "titolo1",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo1",
            modalitaTransazione : "Vendita",
            categoria : "sport",
            via : "via Sommarive 20",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "true",
            prezzo : 66.6
        },
        {
            titolo : "titolo2",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo2 - sport",
            modalitaTransazione : "Affitto",
            categoria : "sport",
            via : "via Sommarive 20",
            citta : "Trento",
            provincia : "Trento",
            pagamentoOnline : "false",
            prezzoAffittoAlGiorno : 10,
            prezzoAffittoSettimanale : 50,
            prezzoAffittoAllOra : 5
        },
        {
            titolo : "titolo3",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo3 - hobby",
            modalitaTransazione : "Vendita",
            categoria : "hobby",
            via : "via Sommarive 55",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "false",
            prezzo : 15.55
        },
        {
            titolo : "titolo4",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo4 - fai da te",
            modalitaTransazione : "Affitto",
            categoria : "fai da te",
            via : "piazza Duomo 20",
            citta : "Milano",
            provincia : "Milano",
            pagamentoOnline : "true",
            prezzoAffittoAlGiorno : 150,
            prezzoAffittoSettimanale : 450,
            prezzoAffittoAllOra : 15
        },
        {
            titolo : "titolo5",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo5 - animali",
            modalitaTransazione : "Vendita",
            categoria : "animali",
            pagamentoOnline : "true",
            prezzo : 180.46
        },
        {
            titolo : "titolo6",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo6 - sport",
            modalitaTransazione : "Vendita",
            categoria : "animali",
            via : "via Sommarive 20",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "false",
            prezzo : 1500
        },
        {
            titolo : "titolo7",
            inserzionista : "inserz",
            descrizione : "Prova filtraggio titolo7 - sport hobby",
            modalitaTransazione : "Vendita",
            categoria : "sport",
            via : "via Sommarive 20",
            citta : "Povo",
            provincia : "Trento",
            pagamentoOnline : "true",
            prezzo : 150
        }
    ]
    it("Testing with some test cases", () => {
        let output = f.filterByTerm(inputArray,"titolo");
        expect(output).toHaveLength(7)

        output = f.filterByTerm(inputArray,"TITOLO");
        expect(output).toHaveLength(7)

        output = f.filterByTerm(inputArray,"1");
        expect(output).toHaveLength(1)

        output = f.filterByTerm(inputArray,"0");
        expect(output).toHaveLength(0)

    });
})

describe('Suite testing function "orderAnnunciByDate" in file "filtraggio"', () => {
    const inputArray = [
        {
            titolo : "Annuncio 1",
            dataPubblicazione : new Date("2002-12-25")
        },
        {
            titolo : "Annuncio 2",
            dataPubblicazione : new Date("2002-12-26")
        },
        {
            titolo : "Annuncio 3",
            dataPubblicazione : new Date("2002-12-24")
        }
    ]
    const inputArray2 = [
        {
            titolo : "Annuncio 1",
            dataPubblicazione : new Date("2002-12-25")
        },
        {
            titolo : "Annuncio 2",
            dataPubblicazione : new Date("2022-12-25")
        },
        {
            titolo : "Annuncio 3",
            dataPubblicazione : new Date("2022-2-17")
        }
    ]
    const inputArray3 = [
        {
            titolo : "Annuncio 1",
            dataPubblicazione : new Date("1998-01-01")
        },
        {
            titolo : "Annuncio 2",
            dataPubblicazione : new Date("2002-12-26")
        },
        {
            titolo : "Annuncio 3",
            dataPubblicazione : new Date("2002-12-14")
        }
    ]
    test('Testing with some test cases', () => {
        let output = f.orderAnnunciByDate(inputArray);
        expect(output[0].titolo).toEqual("Annuncio 3");
        expect(output[1].titolo).toEqual("Annuncio 1");
        expect(output[2].titolo).toEqual("Annuncio 2");

        output = f.orderAnnunciByDate(inputArray2);
        expect(output[0].titolo).toEqual("Annuncio 1");
        expect(output[1].titolo).toEqual("Annuncio 3");
        expect(output[2].titolo).toEqual("Annuncio 2");

        output = f.orderAnnunciByDate(inputArray3);
        expect(output[0].titolo).toEqual("Annuncio 1");
        expect(output[1].titolo).toEqual("Annuncio 3");
        expect(output[2].titolo).toEqual("Annuncio 2");

    })
})

describe('Suite testing function "orderAnnunciByDateDESC" in file "filtraggio"', () => {
    const inputArray = [
        {
            titolo : "Annuncio 1",
            dataPubblicazione : new Date("2002-12-25")
        },
        {
            titolo : "Annuncio 2",
            dataPubblicazione : new Date("2002-12-26")
        },
        {
            titolo : "Annuncio 3",
            dataPubblicazione : new Date("2002-12-24")
        }
    ]
    const inputArray2 = [
        {
            titolo : "Annuncio 1",
            dataPubblicazione : new Date("2002-12-25")
        },
        {
            titolo : "Annuncio 2",
            dataPubblicazione : new Date("2022-12-25")
        },
        {
            titolo : "Annuncio 3",
            dataPubblicazione : new Date("2022-2-17")
        }
    ]
    const inputArray3 = [
        {
            titolo : "Annuncio 1",
            dataPubblicazione : new Date("1998-01-01")
        },
        {
            titolo : "Annuncio 2",
            dataPubblicazione : new Date("2002-12-26")
        },
        {
            titolo : "Annuncio 3",
            dataPubblicazione : new Date("2002-12-14")
        }
    ]
    test('Testing with some test cases', () => {
        let output = f.orderAnnunciByDateDESC(inputArray);
        expect(output[0].titolo).toEqual("Annuncio 2");
        expect(output[1].titolo).toEqual("Annuncio 1");
        expect(output[2].titolo).toEqual("Annuncio 3");

        output = f.orderAnnunciByDateDESC(inputArray2);
        expect(output[0].titolo).toEqual("Annuncio 2");
        expect(output[1].titolo).toEqual("Annuncio 3");
        expect(output[2].titolo).toEqual("Annuncio 1");

        output = f.orderAnnunciByDateDESC(inputArray3);
        expect(output[0].titolo).toEqual("Annuncio 2");
        expect(output[1].titolo).toEqual("Annuncio 3");
        expect(output[2].titolo).toEqual("Annuncio 1");

    })
})

describe('Suite testing function "orderAnnunciByMoneyDESC" in file "filtraggio"', () => {
    const inputArray = [
        {
            titolo : "Annuncio 1",
            modalitaTransazione : "Vendita",
            prezzo : 10
        },
        {
            titolo : "Annuncio 2",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 105
        },
        {
            titolo : "Annuncio 3",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 155
        }
    ]
    const inputArray2 = [
        {
            titolo : "Annuncio 1",
            modalitaTransazione : "Vendita",
            prezzo : 27.64
        },
        {
            titolo : "Annuncio 2",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 5.64
        },
        {
            titolo : "Annuncio 3",
            modalitaTransazione : "Vendita",
            prezzo : 15.66
        }
    ]
    const inputArray3 = [
        {
            titolo : "Annuncio 1",
            modalitaTransazione : "Vendita",
            prezzo : 151.53
        },
        {
            titolo : "Annuncio 2",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 154.66
        },
        {
            titolo : "Annuncio 3",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 124.45
        }
    ]
    test('Testing with some test cases', () => {
        let output = f.orderAnnunciByMoneyDESC(inputArray);
        expect(output[0].titolo).toEqual("Annuncio 3");
        expect(output[1].titolo).toEqual("Annuncio 2");
        expect(output[2].titolo).toEqual("Annuncio 1");

        output = f.orderAnnunciByMoneyDESC(inputArray2);
        expect(output[0].titolo).toEqual("Annuncio 1");
        expect(output[1].titolo).toEqual("Annuncio 3");
        expect(output[2].titolo).toEqual("Annuncio 2");

        output = f.orderAnnunciByMoneyDESC(inputArray3);
        expect(output[0].titolo).toEqual("Annuncio 2");
        expect(output[1].titolo).toEqual("Annuncio 1");
        expect(output[2].titolo).toEqual("Annuncio 3");

    })
})

describe('Suite testing function "orderAnnunciByMoney" in file "filtraggio"', () => {
    const inputArray = [
        {
            titolo : "Annuncio 1",
            modalitaTransazione : "Vendita",
            prezzo : 10
        },
        {
            titolo : "Annuncio 2",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 105
        },
        {
            titolo : "Annuncio 3",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 155
        }
    ]
    const inputArray2 = [
        {
            titolo : "Annuncio 1",
            modalitaTransazione : "Vendita",
            prezzo : 27.64
        },
        {
            titolo : "Annuncio 2",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 5.64
        },
        {
            titolo : "Annuncio 3",
            modalitaTransazione : "Vendita",
            prezzo : 15.66
        }
    ]
    const inputArray3 = [
        {
            titolo : "Annuncio 1",
            modalitaTransazione : "Vendita",
            prezzo : 151.53
        },
        {
            titolo : "Annuncio 2",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 154.66
        },
        {
            titolo : "Annuncio 3",
            modalitaTransazione : "Affitto",
            prezzoAffittoAlGiorno : 124.45
        }
    ]
    test('Testing with some test cases', () => {
        let output = f.orderAnnunciByMoney(inputArray);
        expect(output[0].titolo).toEqual("Annuncio 1");
        expect(output[1].titolo).toEqual("Annuncio 2");
        expect(output[2].titolo).toEqual("Annuncio 3");

        output = f.orderAnnunciByMoney(inputArray2);
        expect(output[0].titolo).toEqual("Annuncio 2");
        expect(output[1].titolo).toEqual("Annuncio 3");
        expect(output[2].titolo).toEqual("Annuncio 1");

        output = f.orderAnnunciByMoney(inputArray3);
        expect(output[0].titolo).toEqual("Annuncio 3");
        expect(output[1].titolo).toEqual("Annuncio 1");
        expect(output[2].titolo).toEqual("Annuncio 2");

    })
})

describe('Suite testing function "filterArray" in file "filtraggio"', () => {

    test("Testing with all values to 'undefined'", () => {
        let inputArray = [
            {
                titolo : "titolo1",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo1",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "true",
                prezzo : 66.6
            },
            {
                titolo : "titolo2",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo2 - sport",
                modalitaTransazione : "Affitto",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Trento",
                provincia : "Trento",
                pagamentoOnline : "false",
                prezzoAffittoAlGiorno : 10,
                prezzoAffittoSettimanale : 50,
                prezzoAffittoAllOra : 5
            },
            {
                titolo : "titolo3",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo3 - hobby",
                modalitaTransazione : "Vendita",
                categoria : "hobby",
                via : "via Sommarive 55",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "false",
                prezzo : 15.55
            },
            {
                titolo : "titolo4",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo4 - fai da te",
                modalitaTransazione : "Affitto",
                categoria : "fai da te",
                via : "piazza Duomo 20",
                citta : "Milano",
                provincia : "Milano",
                pagamentoOnline : "true",
                prezzoAffittoAlGiorno : 150,
                prezzoAffittoSettimanale : 450,
                prezzoAffittoAllOra : 15
            },
            {
                titolo : "titolo5",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo5 - animali",
                modalitaTransazione : "Vendita",
                categoria : "animali",
                pagamentoOnline : "true",
                prezzo : 180.46
            },
            {
                titolo : "titolo6",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo6 - sport",
                modalitaTransazione : "Vendita",
                categoria : "animali",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "false",
                prezzo : 1500
            },
            {
                titolo : "titolo7",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo7 - sport hobby",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "true",
                prezzo : 150
            }
        ]
    
        let body = {
        }

        let output = f.filterArray(inputArray,body);
        expect(output).toHaveLength(inputArray.length)
    })
    test("Testing with all values to 'null'", () => {
        let inputArray = [
            {
                titolo : "titolo1",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo1",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "true",
                prezzo : 66.6
            },
            {
                titolo : "titolo2",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo2 - sport",
                modalitaTransazione : "Affitto",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Trento",
                provincia : "Trento",
                pagamentoOnline : "false",
                prezzoAffittoAlGiorno : 10,
                prezzoAffittoSettimanale : 50,
                prezzoAffittoAllOra : 5
            },
            {
                titolo : "titolo3",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo3 - hobby",
                modalitaTransazione : "Vendita",
                categoria : "hobby",
                via : "via Sommarive 55",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "false",
                prezzo : 15.55
            },
            {
                titolo : "titolo4",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo4 - fai da te",
                modalitaTransazione : "Affitto",
                categoria : "fai da te",
                via : "piazza Duomo 20",
                citta : "Milano",
                provincia : "Milano",
                pagamentoOnline : "true",
                prezzoAffittoAlGiorno : 150,
                prezzoAffittoSettimanale : 450,
                prezzoAffittoAllOra : 15
            },
            {
                titolo : "titolo5",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo5 - animali",
                modalitaTransazione : "Vendita",
                categoria : "animali",
                pagamentoOnline : "true",
                prezzo : 180.46
            },
            {
                titolo : "titolo6",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo6 - sport",
                modalitaTransazione : "Vendita",
                categoria : "animali",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "false",
                prezzo : 1500
            },
            {
                titolo : "titolo7",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo7 - sport hobby",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                via : "via Sommarive 20",
                citta : "Povo",
                provincia : "Trento",
                pagamentoOnline : "true",
                prezzo : 150
            }
        ]
    
        let body = {
            categoria : "null",
            transazione : "null",
            pagamentoOnline : "null",
            citta : "null",
            provincia : "null",
            startPrice : "null",
            endPrice : "null",
            startDate : "null",
            endDate : "null"
        }

        let output = f.filterArray(inputArray,body);
        expect(output).toEqual(inputArray)
    })
    test("Testing with some test cases'", () => {
        let inputArray = [
            {
                titolo : "titolo1",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo1",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                pagamentoOnline : true,
                prezzo : 66.6,
                dataPubblicazione : new Date ("1999-12-25")
            },
            {
                titolo : "titolo2",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo2 - sport",
                modalitaTransazione : "Affitto",
                categoria : "sport",
                pagamentoOnline : false,
                prezzoAffittoAlGiorno : 10,
                prezzoAffittoSettimanale : 50,
                prezzoAffittoAllOra : 5,
                dataPubblicazione : new Date ("2017-06-16")
            },
            {
                titolo : "titolo3",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo3 - hobby",
                modalitaTransazione : "Vendita",
                categoria : "hobby",
                pagamentoOnline : false,
                prezzo : 15.55,
                dataPubblicazione : new Date ("2022-12-31")
            },
            {
                titolo : "titolo4",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo4 - fai da te",
                modalitaTransazione : "Affitto",
                categoria : "fai da te",
                pagamentoOnline : true,
                prezzoAffittoAlGiorno : 150,
                prezzoAffittoSettimanale : 450,
                prezzoAffittoAllOra : 15,
                dataPubblicazione : new Date ("2019-12-16")
            },
            {
                titolo : "titolo5",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo5 - animali",
                modalitaTransazione : "Vendita",
                categoria : "animali",
                pagamentoOnline : true,
                prezzo : 180.46,
                dataPubblicazione : new Date ("2012-12-25")
            },
            {
                titolo : "titolo6",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo6 - sport",
                modalitaTransazione : "Vendita",
                categoria : "animali",
                pagamentoOnline : false,
                prezzo : 1500,
                dataPubblicazione : new Date ("2022-12-25")
            },
            {
                titolo : "titolo7",
                inserzionista : "inserz",
                descrizione : "Prova filtraggio titolo7 - sport hobby",
                modalitaTransazione : "Vendita",
                categoria : "sport",
                pagamentoOnline : true,
                prezzo : 150,
                dataPubblicazione : new Date ("2022-12-25")
            }
        ]
    
        let body = {
            categoria : "sport"
        }

        let output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(3)

        body.pagamentoOnline = "false";
        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(1)

        body.pagamentoOnline = "true";
        body.categoria = undefined;
        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(4)

        body.pagamentoOnline = "true";
        body.categoria = undefined;
        body.transazione = "Vendita"
        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(3)

        body = {
            startPrice : 17,
            endPrice : 150
        }

        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(3)

        body = {
            transazione : "Affitto",
            endPrice : 150
        }

        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(2)

        body = {
            transazione : "Vendita",
            endDate : "2022-12-25"
        }

        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(4)

        body = {
            provincia : "Trento",
        }

        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(0)


        body = {
            citta : "Trento",
        }

        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(0)

        const inputArray2 = [
            {
                titolo : "Annuncio 1",
                indirizzoRitiro : '{"via" : "via Sommarive 20", "citta" : "Povo", "provincia" : "Trento"}'
            },
            {
                titolo : "Annuncio 2",
                indirizzoRitiro : '{"via" : "via Sommarive 20", "citta" : "Trento", "provincia" : "Trento"}'
            }
        ]
        body = {
            citta : "Povo",
            provincia : "Trento"
        }
        output = f.filterArray(inputArray2,body);
        expect(output.length).toEqual(1)

        body = {
            startDate : "2000-01-01",
            endDate : "2022-12-5"
        }
        output = f.filterArray(inputArray,body);
        expect(output.length).toEqual(3)


    })
})