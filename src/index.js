import express from 'express';
import dotenv from 'dotenv';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import router from './routes/routes.js';
import connection from './settings/conection.js';


dotenv.config();
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'public')));
app.use(router);


app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
    console.log('http://localhost:' + app.get('port'));
});