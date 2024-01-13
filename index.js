// starting a server with express (very simple strategy)

const fs = require('fs');
const express = require('express');     //return a top-level function named express
const path = require('path');
const app = express();  //objact that contains many methods to construct the server

//defining the template engine
app.set('view engine', 'ejs')


//----------------------------------------------------
/*
use template engine automatically config the static files, we dont need to app.use(static fles...)
*/
// start to use MVC - Model View Controller
// defining static files
// app.use(express.static(path.join(__dirname, 'view')))
//  const staticFolder = path.join(__dirname, 'views');
//  const expressStatic = express.static(staticFolder);
//  app.use(expressStatic)

// //defining pulbic files
app.use(express.static(path.join(__dirname, 'public')))
const pulbicFolder = path.join(__dirname, 'public');
const expressPublic = express.static(pulbicFolder);
app.use(expressPublic)

//----------------------------------------------------
// this is one of many middleware func from express
// enable server to receive POST from server
app.use(express.urlencoded( {extended: true} ))

//----------------------------------------------------
//we place rotes that way 
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Digital Tech - Home'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Digital Tech - Quem Somos'
    })
})

app.get('/products', (req, res) => {
    res.render('products', {
        title: 'Digital Tech - Produtos'
    })
})

app.get('/services', (req, res) => {
    res.render('services', {
        title: 'Digital Tech - Serviços'
    })
})

app.get('/posts', (req,res) => {
    const postsPath = path.join(path.join(__dirname, 'store'), 'posts.json');

    fs.readFile(postsPath, 'utf8', (error, data) => {
        if(error) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).send('Erro interno do servidor');
        }

        const jsonData = JSON.parse(data);

        res.render('posts', {
            title: 'Digital Tech - Posts',
            posts: jsonData.posts
        })
    })
})

app.get('/post-register', (req, res) => {
    const { c } = req.query;

    res.render('post-register', {
        title: 'Digital Tech - Cadastrar Post',
        cadastrado: c
    })
})

app.post('/save-post', (req, res) => {
    const { title, text } = req.body;
    const postsFile = fs.readFileSync('./store/posts.json');
    const postsData = JSON.parse(postsFile);

    postsData.posts.push({
        title: title,
        text: text
    })

    const postsUpdated = JSON.stringify(postsData);

    fs.writeFileSync('./store/posts.json', postsUpdated)

    res.redirect('/post-register?c=1')
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Digital Tech - Contato'
    })
})

//404 error rote
app.use((req, res) => {
    res.send('<h1>Página não encontrada...')
})
//----------------------------------------------------


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is listen on port ${port}`));