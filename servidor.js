import express from 'express'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import {initializeApp} from 'firebase/app'
import {collection, getFirestore, getDoc, doc, setDoc} from 'firebase/firestore'

const port = process.env.PORT || 6000;

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "lmp-project1.firebaseapp.com",
  projectId: "lmp-project1",
  storageBucket: "lmp-project1.appspot.com",
  messagingSenderId: "534346155428",
  appId: "1:534346155428:web:78d91255fc6e3b5e59ad31"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Root response');
})

app.get('/contacto', (req, res)=>{
  res.send('Response from Contact');
})

app.post('/signup', (req, res) => {
  const{nombre, apaterno, amaterno, telefono, usuario, password} = req.body;
  console.log('@@ body => ', req.body);
  if(nombre.length < 3){
    res.json({'alert' : 'name must be at least 3 characters'});
  } else if(!apaterno.length){
    res.json({'alert' : "apaterno cannot be empty"});
  } else if(!amaterno.length){
    res.json({'alert' : "amaterno cannot be empty"});
  } else if(!telefono.length){
    res.json({'alert' : "telefono cannot be empty"});
  } else if(!usuario.length){
    res.json({'alert' : "usuario cannot be empty"});
  } else if(password.length < 6){
    res.json({'alert' : "password must be at least 6 characters"});
  } else {
    // Save into db
    const usuarios = collection(db, 'usuarios');
    getDoc(doc(usuarios, usuario)).then(user => {
      if(user.exists()){
        res.json({ 'alert': 'User already exists'})
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash;

            setDoc(doc(usuarios, usuario), req.body)
              .then(registered => {
                res.json({
                  'alert': 'success',
                  registered
                })
              })
          })
        })
      }
    });
  }
})

app.post('/login', (req, res) => {
  const {usuario, password} = req.body;
  if(!usuario.length || !password.length){
    return res.json({
      'alert': 'Some fields are empty'
    });
  } 
  const usuarios = collection(db, 'usuarios');
  getDoc(doc(usuarios, usuario))
    .then(user => {
      if(!user.exists()){
        res.json({
          'alert': 'user does not exist'
        });
      } else {
        bcrypt.compare(password, user.data().password, (err, result)=>{
          if(result){
            let userFound = user.data();
            res.json({
              'alert': 'success',
              'usuario': {
                'nombre': userFound.nombre,
                'apaterno': userFound.apaterno,
                'amaterno': userFound.materno,
                'usuario': userFound.usuarionpm ,
                'telefono': userFound.telefono,
              }
            })
          } else {
            res.json({
              'alert': 'passwords do not match'
            });
          }
        });
      }
    })
})



app.listen(port, () => {
  console.log('Listening on port', port);
})

