import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import {TitolariMockData, FascicoliMockData, RegistriMockData, AmministrazioneMockData, MittenteMockData} from './fake-backend-data/index';

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: (backend: MockBackend, options: BaseRequestOptions) => {

        let mockDataVersion = "19";
        let debug = false;
        let mockDataStored = localStorage.getItem('mockDataVersion');

        if (mockDataStored != mockDataVersion) {
            // write mock data to local storage if version number differs from the current
            localStorage.setItem('titolari', JSON.stringify(TitolariMockData));
            localStorage.setItem('fascicoli', JSON.stringify(FascicoliMockData));
            localStorage.setItem('registri', JSON.stringify(RegistriMockData));
            localStorage.setItem('amministrazione', JSON.stringify(AmministrazioneMockData));
            localStorage.setItem('mittente', JSON.stringify(MittenteMockData));

            localStorage.setItem('mockDataVersion', mockDataVersion);
        }


        // read local storage
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let titolari: any[] = JSON.parse(localStorage.getItem('titolari')) || [];
        let fascicoli: any[] = JSON.parse(localStorage.getItem('fascicoli')) || [];
        let registri: any[] = JSON.parse(localStorage.getItem('registri')) || [];
        let amministrazione: any[] = JSON.parse(localStorage.getItem('amministrazione')) || [];
        let mittente: any[] = JSON.parse(localStorage.getItem('mittente')) || [];

        let supportedApiMetods: string[] = [
            'authenticate',
            'users',
            'titolari',
            'fascicoli',
            'registri',
            'amministrazione',
            'mittente'
        ];

        // configure fake backend
        backend.connections.subscribe((connection: MockConnection) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                if(debug) {
                    console.log('---------------- Fake Backend intercepted request ----------------');
                    console.log(connection.request.url, connection.request);
                }

                // split the URL to catch request parameters
                let requestUrlArr = connection.request.url.split('/');

                // catch base path for the request
                let basePath = requestUrlArr[1];

                // the request is to the backend API
                if ( basePath && basePath === 'api' ) {

                    // catch API Method, Request Method, and eventual ID
                    let apiMethod = requestUrlArr[2];
                    let reqMethod = connection.request.method;
                    let id = parseInt(requestUrlArr[3]);

                    if ( supportedApiMetods.indexOf( apiMethod ) != -1 ) {
                        // the method is supported

                        if(debug) {
                            switch(connection.request.method) {
                                case 0: // GET
                                    console.log('reading ' + apiMethod + ': ' + (id >=0 ? id : 'all'));
                                    break;
                                case 1: // POST
                                    console.log('creating ' + apiMethod);
                                    break;
                                case 2: // PUT
                                    console.log('updating ' + apiMethod + ': ' + (id >=0 ? id : 'all'));
                                    break;
                                case 3: // DELETE
                                    console.log('deleting ' + apiMethod + ': ' + (id >=0  ? id : 'all'));
                                    break;
                            }
                            console.log('------------------------------------------------------------------');
                        }

                        if ( apiMethod === 'authenticate' && reqMethod === RequestMethod.Post ) {

                            /*
                             * AUTHENTICATE (doesn't require a token)
                             */

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

                        } else if ( apiMethod === 'users' && reqMethod === RequestMethod.Post ) {

                            /*
                             * USER REGISTRATION (doesn't require a token)
                             */

                            // get new user object from post body
                            let newUser = JSON.parse(connection.request.getBody());

                            // validation
                            let duplicateEmail = users.filter(user => { return user.eMail === newUser.eMail }).length;
                            if (duplicateEmail) { return connection.mockError( new Error('L\'email "' + newUser.eMail + '" è già utilizzata' ) ) }

                            let duplicateUserName = users.filter(user => { return user.userName === newUser.userName; }).length;
                            if (duplicateUserName) { return connection.mockError( new Error('Nome utente "' + newUser.userName + '" già utilizzato' ) ) }

                            // add current registration date
                            newUser.registrationDate = new Date().getTime();

                            // save new user
                            newUser.id = users.length + 1;
                            users.push(newUser);
                            localStorage.setItem('users', JSON.stringify(users));

                            // respond 200 OK
                            connection.mockRespond(new Response(new ResponseOptions({status: 200})));

                            /*
                             * EVERY OTHER API METHOD
                             */
                        } else {

                            // every request except authentication and signup MUST BE authenticated
                            if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                                let methodData = eval(apiMethod); // <--- gets the data structure corresponding to the invoked api method name

                                switch ( reqMethod ) {

                                    /*
                                     * GET ALL OR SINGLE ITEM
                                     */
                                    case ( RequestMethod.Get ):

                                        if( id >= 0) {
                                            // SINGLE
                                            let matchedItem = methodData.data.filter(item => { return item.id === id; });
                                            let item = matchedItem.length ? Object.assign({}, matchedItem[0]) : null;

                                            let response = {
                                                "response": 200,
                                                "total_results": 1,
                                                "data": item
                                            };

                                            // respond 200 OK with single item
                                            connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: response })));
                                        } else {
                                            // ALL
                                            // respond 200 OK with all items
                                            connection.mockRespond(new Response(new ResponseOptions({status: 200, body: methodData})));
                                        }

                                        break;

                                    /*
                                     * CREATE
                                     */
                                    case ( RequestMethod.Post ):

                                        // get new titolario object from post body
                                        let newItem = JSON.parse(connection.request.getBody());

                                        // !!! THE REAL BACKEND MUST VALIDATE DATA BEFORE WRITING !!!

                                        // save new item
                                        newItem.id = methodData.data.length; // bogus id for the mock! a real backend must assign a unique ID
                                        methodData.data.push(newItem);
                                        localStorage.setItem(apiMethod, JSON.stringify(methodData));

                                        // respond 200 OK
                                        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

                                        break;

                                    /*
                                     * UPDATE
                                     */
                                    case ( RequestMethod.Put ):
                                        
                                        if( id >= 0 ) {
                                            let updatedItem = JSON.parse(connection.request.getBody());

                                            // !!! THE REAL BACKEND MUST VALIDATE DATA BEFORE WRITING !!!

                                            for (let i = 0, l = methodData.data.length; i < l; i++) {

                                                if (methodData.data[i].id == id) {
                                                    methodData.data[i] = updatedItem;
                                                    break;
                                                }
                                            }

                                            localStorage.setItem(apiMethod, JSON.stringify(methodData));

                                            // respond 200 OK
                                            connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                                            
                                        } else {
                                            // return 400 bad request
                                            connection.mockError(new Error('Il parametro id è obbligatorio'));                                            
                                        }
                                        break;

                                    /*
                                     * DELETE
                                     */
                                    case ( RequestMethod.Delete ):
                                        if( id >= 0 ) {
                                            for (let i = 0, l = methodData.data.length; i < l; i++) {
                                                let item = methodData.data[i];
                                                if (item.id == id) {
                                                    // delete item
                                                    methodData.data.splice(i, 1);
                                                    localStorage.setItem(apiMethod, JSON.stringify(methodData));

                                                    // respond 200 OK
                                                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                                                    break;
                                                }
                                            }
                                        } else {
                                            // return 400 bad request
                                            connection.mockError(new Error('Il parametro id è obbligatorio'));
                                        }

                                        break;

                                }


                            } else {
                                // return 401 not authorised if token is null or invalid
                                connection.mockRespond(new Response(new ResponseOptions({status: 401})));
                            }
                        }

                    } else {
                        // the method is unsupported, return 400 bad request
                        connection.mockError(new Error('Il metodo '+apiMethod+' non è supportato dalla API'));
                    }
                }
            }, 500); // half second delay
        });

        return new Http(backend, options);
    },
    deps: [MockBackend, BaseRequestOptions]
};