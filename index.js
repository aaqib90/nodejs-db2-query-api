const express = require('express');
const bodyParser = require('body-parser');

const ibmdb = require('ibm_db');
const connStr = process.env.cns || "DATABASE=BLUDB;HOSTNAME=172.21.168.59;UID=db2inst1;PWD=P@ssw0rd;PORT=50000;PROTOCOL=TCPIP";
 
const app = express();

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

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
    console.log('Query is -> ', dbQuery);

    ibmdb.open(connStr, function (err,conn) {
        if (err) return console.log(err);
        
        console.log(conn)
        conn.query(dbQuery, function (err, data) {
          if (err) {
              console.log(err);
              res.status(400).send(err);
          }
          else {
            //console.log(data);
            res.send(data);
          }
          conn.close(function () {
            console.log('done');
          });
        });
      });
});

app.listen(port, ip);
console.log(`Server is runnit at PORT ${port}`);

