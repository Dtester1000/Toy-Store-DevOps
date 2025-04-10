const express = require('express');
const app = express();
const Routes = require('./routes/my_router');
const authRoutes = require('./routes/auth_route');
const db = require('./services/db');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/api', Routes);
app.use('/auth', authRoutes);

// READ - GET (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const Toy = require('./models/toyModel');
const User = require('./models/userModel');
// Connect to the database

const con = db();
// Now you can use the Toy model to interact with your database
// For example:
//const newToy = new Toy({ name: 'Teddy Bear', info: 'Soft plush toy', category:"test", img_url: "link", price:"30",user_id:"1"});
//newToy.save();

app.listen(5000,() =>{

    console.log("UP!");
});