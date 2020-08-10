const express = require('express');
const bodyParser = require('body-parser');

const ibmdb = require('ibm_db');
const connStr = process.env.cns || "DATABASE=<dbname>;HOSTNAME=<myhost>;UID=db2user;PWD=password;PORT=<dbport>;PROTOCOL=TCPIP";
 
const app = express();

const PORT = process.env.PORT || 8888;

app.use(bodyParser.json());

app.get('/health-check', (req, res) => {
    console.log('health check is called');
    res.send({
        status: true,
        message: 'Server is running'
    });
})

app.post('/run-query', (req, res) => {
    console.log('run query is called');
    const dbQuery = req.body.dbQuery;

    ibmdb.open(connStr, function (err,conn) {
        if (err) return console.log(err);
        
        console.log(conn)
        conn.query(JSON.stringify(dbQuery), function (err, data) {
          if (err) console.log(err);
          else console.log(data);
       
          conn.close(function () {
            console.log('done');
          });
        });
      });
});

app.listen(PORT, () => console.log(`Server is runnit at PORT ${PORT}`));
