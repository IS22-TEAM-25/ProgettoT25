const app = require('./src/server.js');
const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

app.locals.db = mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    
    app.listen(port, () => {
        console.log('Web server listening on port ' + port);
    });
    
});