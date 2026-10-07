const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const doctorDashboardRoutes = require('./routes/doctorDashboard');
const hospitalDashboardRoutes = require('./routes/hospitalDashboard');
const patients = require('./routes/patients');
const showSuggestions = require('./routes/suggestions');
const hospitalDetailsRoute = require('./routes/hospitalDetails');
const patientRegistration = require('./routes/patientRegistration');
const numbers = require('./routes/numbers');
const addHospitalRoute = require('./routes/addHospitalRoute');
const addDoctorRoute = require('./routes/addDoctorRoute');
const sendSms = require('./routes/sendSms');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('updateNumber', (data) => {
        console.log(`Doctor ID: ${data.doctorId}, New Number: ${data.number}`);

        io.emit('numberUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});   

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({}, db);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000*60*60*2 }
}));

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'admin'), path.join(__dirname, 'public')]);
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/superAdminDashboard', (req, res) => {
    res.render('superAdminDashboard');
});

app.post('/logDoctorId', (req, res) => {
    const { doctorId } = req.body;
    console.log("Doctor ID received on server:", doctorId);
    res.json({ success: true, doctorId });
});


app.use('/', authRoutes);
app.use('/doctor', doctorDashboardRoutes);
app.use('/hospital', hospitalDashboardRoutes);
app.use('/search', showSuggestions);
app.use('/hospital-details', hospitalDetailsRoute);
app.use('/addHospital', addHospitalRoute);
app.use('/addDoctor', addDoctorRoute);
app.use('/', patientRegistration);
app.use('/', patients);
app.use('/', sendSms);
app.use('/', numbers);

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});