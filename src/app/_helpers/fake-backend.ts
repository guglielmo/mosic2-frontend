import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { FascicoliMockData } from './fake-backend-data/fascicoli.mockdata';

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let titolari: any[] = JSON.parse(localStorage.getItem('titolari')) || [];
        let fascicoli: any[] = JSON.parse(localStorage.getItem('fascicoli')) || [];

        // configure fake backend
        backend.connections.subscribe((connection: MockConnection) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {

                console.log('---------------- Fake Backend intercepted request ----------------');
                console.log(connection.request);
                console.log('------------------------------------------------------------------');

                /**
                 * AUTHENTICATE
                 */

                // authenticate
                if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                    // get parameters from post request
                    let params = JSON.parse(connection.request.getBody());

                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return 200 OK with user details and fake jwt token
                        let user = filteredUsers[0];
                        connection.mockRespond(new Response(new ResponseOptions({
                            status: 200,
                            body: {
                                id: user.id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                token: 'fake-jwt-token'
                            }
                        })));
                    } else {
                        // else return 400 bad request
                        connection.mockError(new Error('Il nome utente o la password inserita non sono corretti'));
                    }
                }

                // get users
                if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                /**
                 * USERS
                 */

                // get user by id
                if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        // respond 200 OK with user
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                // create user
                if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
                    // get new user object from post body
                    let newUser = JSON.parse(connection.request.getBody());

                    // validation
                    let duplicateEmail = users.filter(user => { return user.eMail === newUser.eMail; }).length;
                    if (duplicateEmail) {
                        return connection.mockError(new Error('L\'email "' + newUser.eMail + '" è già utilizzata'));
                    }

                    let duplicateUserName = users.filter(user => { return user.userName === newUser.userName; }).length;
                    if (duplicateUserName) {
                        return connection.mockError(new Error('Nome utente "' + newUser.userName + '" già utilizzato'));
                    }

                    // add current registration date
                    newUser.registrationDate = new Date().getTime();

                    // save new user
                    newUser.id = users.length + 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                }

                // delete user
                if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < users.length; i++) {
                            let user = users[i];
                            if (user.id === id) {
                                // delete user
                                users.splice(i, 1);
                                localStorage.setItem('users', JSON.stringify(users));
                                break;
                            }
                        }

                        // respond 200 OK
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                /**
                 * TITOLARI
                 */

                // get titolari
                if (connection.request.url.endsWith('/api/titolari') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                        // create some data for the fake backend if it doesn't exist yet
                        if (titolari.length == 0) {
                            titolari = [
                                {id: '0',codice: '0',denominazione: 'Documenti di seduta',descrizione: 'Telex, Appunto generale, passi, etc.'},
                                {id: '1',codice: '1',denominazione: 'Segreteria Cipe',descrizione: 'Competenze CIPE, Regolamento interno CIPE, Regolamento interno Commissioni, Altri organismi in seno al CIPE, ISTAT'},
                                {id: '2',codice: '2',denominazione: 'Programmazione Finanziaria',descrizione: 'Cofinanziamento programmi UE, Aree depresse, Fondo art.19 D.L.vo 96/93'},
                                {id: '3',codice: '3',denominazione: 'Ambiente',descrizione: 'Difesa acqua, difesa aria, difesa suolo, piano biodiversità'},
                                {id: '4',codice: '4',denominazione: 'Energia',descrizione: 'Elettrica, Fonti alternative, Metanizzazione, Nucleare, Risparmio energetica'},
                                {id: '5',codice: '5',denominazione: 'Montagna',descrizione: 'Montagna'},
                                {id: '6',codice: '6',denominazione: 'Agricoltura',descrizione: 'Agro-forestale, Agro-industriale, Pesca e acquacoltura, Zootecnia'},
                                {id: '7',codice: '7',denominazione: 'Industria Commercio ed Artigianato',descrizione: 'Attività estrattiva, Commercio e artigianato, Manifatturiere, Cooperazione int.le, Commercio estero'},
                                {id: '8',codice: '8',denominazione: 'Programmazione negoziata',descrizione: 'Accordi di programma, Contratti d\'area, Contratti di programma, Intese di programma, Patti territoriali'},
                                {id: '9',codice: '9',denominazione: 'Occupazione e lavoro',descrizione: 'Formazione professionale, Occupazione, Previdenza e assistenza, Tutela salariale'},
                                {id: '10',codice: '10',denominazione: 'Ricerca e istruzione',descrizione: 'Istruzione, Ricerca'},
                                {id: '11',codice: '11',denominazione: 'Infrastrutture e trasporti',descrizione: 'Aeroporti, Edilizia pubblica, Ferrovie, Interporti, Opere idriche, Porti, Strade e autostrade, Trasporto rapido di massa'},
                                {id: '12',codice: '12',denominazione: 'Sanita',descrizione: 'Edilizia sanitaria, Fondo Sanitario Nazionale (parte corrente e capitale)'},
                                {id: '13',codice: '13',denominazione: 'Servizi',descrizione: 'Assicurazioni, Credito, Turismo'},
                                {id: '14',codice: '14',denominazione: 'Tariffe',descrizione: 'Acqua e depurazione, Autostradali, Ferroviarie, Telefoniche e postali'},
                                {id: '15',codice: '15',denominazione: 'Farmaci',descrizione: 'Prezzi, Contenzioso'},
                                {id: '16',codice: '16',denominazione: 'Terremoto',descrizione: 'Terremoto'},
                                {id: '17',codice: '17',denominazione: 'Gestione contabile',descrizione: 'Spese in conto capitale, Spese di esercizio, Convenzioni ex Agensud'},
                                {id: '18',codice: '18',denominazione: 'Organizzazione',descrizione: 'Pianificazione e controllo, Gestione del personale, Procedure e informatizzazione'},
                                {id: '19',codice: '19',denominazione: 'Attività diverse',descrizione: 'Telecomunicazioni, FIO, Varie'}
                            ];
                            localStorage.setItem('titolari', JSON.stringify(titolari));
                        }

                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: titolari })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                // get titolari by id
                if (connection.request.url.match(/\/api\/titolari\/\d+$/) && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedTitolari = titolari.filter(titolari => { return titolari.id == id; });
                        let titolario = matchedTitolari.length ? matchedTitolari[0] : null;

                        // respond 200 OK with user
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: titolario })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                // create titolari
                if (connection.request.url.endsWith('/api/titolari') && connection.request.method === RequestMethod.Post) {

                    console.log('creating new titolario');
                    // get new titolario object from post body
                    let newTitolario = JSON.parse(connection.request.getBody());
                    console.log(newTitolario);

                    // validation
                    if ( isNaN(newTitolario.codice) || ( parseFloat(newTitolario.codice) != parseInt(newTitolario.codice) ) ) {
                        return connection.mockError(new Error('Il Codice deve essere un numero intero'));
                    }

                    // save new titolario
                    newTitolario.id = titolari.length + 1;
                    titolari.push(newTitolario);
                    localStorage.setItem('titolari', JSON.stringify(titolari));

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                }


                // update titolari
                if (connection.request.url.match(/\/api\/titolari\/\d+$/) && connection.request.method === RequestMethod.Put) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                        // THIS MUST BE VALIDATED ON THE SERVERSIDE!!!
                        let updatedTitolario = JSON.parse(connection.request.getBody());
                        console.log(updatedTitolario);
                    }

                }

                /**
                 * FASCICOLO
                 */

                // get fascicoli
                if (connection.request.url.endsWith('/api/fascicoli') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                        // create some data for the fake backend if it doesn't exist yet
                        if (fascicoli.length == 0) {
                            fascicoli = FascicoliMockData;
                            localStorage.setItem('fascicoli', JSON.stringify(fascicoli));
                        }

                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: fascicoli })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

            }, 500);

        });

        return new Http(backend, options);
    },
    deps: [MockBackend, BaseRequestOptions]
};