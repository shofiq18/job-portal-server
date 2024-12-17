

// after succesfull login : generae a jwt token 
// npm i JsonWebToken, cookie-parser 
// jwt .sign (payload, ServerClosedEvent, {expiresin: '1h'})
// 2. send a token ( generated in the server side ) to the client side localstrage ==> easiear 
// 3. httpOnly cookies --> better 
// 4 for sensitive or secure or private or protected api s : send token to the server side 
// on server side 
// //  app.use(cors({
//   origin: ['http://localhost:5173'], 
//   credentials: true
// }));

// client side 
