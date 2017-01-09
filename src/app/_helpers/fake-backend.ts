import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { TitolariMockData,FascicoliMockData, RegistriMockData, AmministrazioneMockData, MittenteMockData  } from './fake-backend-data/index';

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: (backend: MockBackend, options: BaseRequestOptions) => {

        // reset all
        localStorage.setItem('titolari', JSON.stringify([]));
        localStorage.setItem('fascicoli', JSON.stringify([]));
        localStorage.setItem('registri', JSON.stringify([]));
        localStorage.setItem('amministrazione', JSON.stringify([]));
        localStorage.setItem('mittente', JSON.stringify([]));

        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let titolari: any[] = JSON.parse(localStorage.getItem('titolari')) || [];
        let fascicoli: any[] = JSON.parse(localStorage.getItem('fascicoli')) || [];
        let registri: any[] = JSON.parse(localStorage.getItem('registri')) || [];
        let amministrazione: any[] = JSON.parse(localStorage.getItem('amministrazione')) || [];
        let mittente: any[] = JSON.parse(localStorage.getItem('mittente')) || [];

        // create some data for the fake backend if it doesn't exist yet
        if (titolari.length == 0) {
            titolari = TitolariMockData;
            localStorage.setItem('titolari', JSON.stringify(titolari));
        }

        // create some data for the fake backend if it doesn't exist yet
        if (fascicoli.length == 0) {
            fascicoli = FascicoliMockData;
            localStorage.setItem('fascicoli', JSON.stringify(fascicoli));
        }

        // create some data for the fake backend if it doesn't exist yet
        if (registri.length == 0) {
            registri = RegistriMockData;
            localStorage.setItem('registri', JSON.stringify(registri));
        }

        // create some data for the fake backend if it doesn't exist yet
        if (amministrazione.length == 0) {
            amministrazione = AmministrazioneMockData;
            localStorage.setItem('amministrazione', JSON.stringify(amministrazione));
        }
        // create some data for the fake backend if it doesn't exist yet
        if (mittente.length == 0) {
            mittente = MittenteMockData;
            localStorage.setItem('mittente', JSON.stringify(mittente));
        }

        // configure fake backend
        backend.connections.subscribe((connection: MockConnection) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                console.log('---------------- Fake Backend intercepted request ----------------');
                console.log(connection.request.url, connection.request);
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
                            if (user.id == id) {
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

                        titolari[updatedTitolario.id] = updatedTitolario;
                        localStorage.setItem('titolari', JSON.stringify(titolari));

                        // respond 200 OK
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                    }

                }

                // delete titolari
                if (connection.request.url.match(/\/api\/titolari\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);

                        for (let i = 0; i < titolari.length; i++) {
                            let titolario = titolari[i];
                            console.log(id,titolario.id);
                            if (titolario.id == id) {
                                // delete titolario
                                titolari.splice(i, 1);
                                localStorage.setItem('titolari', JSON.stringify(titolari));
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
                 * FASCICOLI
                 */

                // get fascicoli
                if (connection.request.url.endsWith('/api/fascicoli') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: fascicoli })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                // get fascicoli by id
                if (connection.request.url.match(/\/api\/fascicoli\/\d+$/) && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedFascicoli = fascicoli.filter(fascicoli => { return fascicoli.id == id; });
                        let fascicolo = matchedFascicoli.length ? matchedFascicoli[0] : null;

                        // respond 200 OK with user
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: fascicolo })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                // delete fascicoli
                if (connection.request.url.match(/\/api\/fascicoli\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);

                        for (let i = 0; i < fascicoli.length; i++) {
                            let fascicolo = fascicoli[i];
                            if (fascicolo.id == id) {
                                // delete fascicoli
                                fascicoli.splice(i, 1);
                                localStorage.setItem('fascicoli', JSON.stringify(fascicoli));
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
                 * REGISTRI
                 */

                // get registri
                if (connection.request.url.endsWith('/api/registri') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: registri })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                // get registri by id
                if (connection.request.url.match(/\/api\/registri\/\d+$/) && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedRegistri = registri.filter(registri => { return registri.id == id; });
                        let registro = matchedRegistri.length ? matchedRegistri[0] : null;

                        // respond 200 OK with user
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: registro })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                /**
                 * AMMINISTRAZIONE
                 */

                // get amministrazione
                if (connection.request.url.endsWith('/api/amministrazione') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: amministrazione })));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                    }
                }

                /**
                 * MITTENTE
                 */

                // get mittente
                if (connection.request.url.endsWith('/api/mittente') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: mittente })));
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