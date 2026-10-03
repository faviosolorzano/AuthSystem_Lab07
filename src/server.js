import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';

import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const app = express();

app.set(
  'view engine',
  'ejs'
);

app.set(
  'views',
  path.join(__dirname, 'views')
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(
  express.static(
    path.join(__dirname, '../public')
  )
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.redirect('/signIn');
});

app.get('/signIn', (req, res) => {
  res.render('signIn');
});

app.get('/signUp', (req, res) => {
  res.render('signUp');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/403', (req, res) => {
  res.status(403).render('403');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {

  console.error(err);

  if (
    req.accepts('html') &&
    !req.path.startsWith('/api')
  ) {
    return res.status(
      err.status || 500
    ).render('404');
  }

  res.status(
    err.status || 500
  ).json({
    message:
      err.message ||
      'Error interno del servidor'
  });
});

const PORT =
  process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGODB_URI,
  {
    autoIndex: true
  }
)
.then(async () => {

  console.log('Mongo connected');

  await seedRoles();

  await seedUsers();

  app.listen(
    PORT,
    () => console.log(
      `Servidor corriendo en el puerto ${PORT}`
    )
  );

})
.catch(err => {

  console.error(
    'Error al conectar con Mongo:',
    err
  );

  process.exit(1);
});