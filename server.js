require('dotenv').config();
const hapi = require("hapi");

const users = []
const jwt = require('jsonwebtoken');

 const init = async () => 
 {
     const server = new hapi.server(
         {
             port: 5000,
             host: "localhost"
        });
        await server.start();
        await server.register(require('inert'));
        await server.register(require('vision'))
        server.views({
            engines : {
                html : require('handlebars')
            },
            relativeTo : __dirname,
            path :'views'
        })
        console.log("server is runnign on port :" + server.info.port);
        server.route(
        [
            {
                method: "GET",
                path: "/",
                handler: (req, h) => 
                {
                    return h.view('index');
                }
            },
            {
                method: "GET",
                path: "/{any*}", // we can a parameter optional by givibg ? after the paramter.
                handler: (req, h) => 
                {
                    return "The page you searching for is not available"
                }
            },
            {
                method: "GET",
                path: "/users",
                handler: (req, h) => 
                {
                    return users;
                }
            },
            {
                method : 'GET',
                path : '/register',
                handler :(req,h)=>
                {
                    return h.view('register')
                }
            },
            {
                method: "POST",
                path: "/register",
                handler: (req, h)=>
                {
                    try 
                    {
                        const user = { name: req.payload.name, title: req.payload.title };
                        console.log(user)
                        users.push(user);
                        return h.redirect("/register");
                    }
                    catch
                    {
                        return h.redirect("/register");
                    }
                    console.log(users);
                }
            },
            {
                method : 'GET',
                path :'/login',
                handler : (req,h)=>
                {
                    return h.view('login')
                }
            },
            {
                method: 'POST',
                path : '/login',
                handler :(req,h)=>
                {
                    const username = req.payload.name;
                    const user = users.find((user) => (user.name = username));
                    if (user == null) 
                    {
                    return h.status(400).send("You are not allowed to visit this page"); //res.status(400).send('You are not authorized')
                    } 
                    else 
                    {
                    const user = { name: username };
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    console.log(accessToken);
                    return ({ accessToken: accessToken });
                    }
                }   
            }
        ])
    }
init();