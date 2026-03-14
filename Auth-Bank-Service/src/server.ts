import app from './app';
import { config } from './config/config';


const PORT = config.app.port || 3001;


app.listen(PORT, () =>{
    console.log(`Auth Service is running on ${PORT}`);
});



