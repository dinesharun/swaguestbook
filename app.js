const Datastore = require('@google-cloud/datastore');
const projectId = 'swaguestbook';

const datastore = Datastore({
  projectId: projectId
});

const express = require('express');
const bodyparser = require('body-parser')
const app = express();

app.use(bodyparser.json())
app.use('/static', express.static('static'))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/view', (req, res) => {
  var q = datastore.createQuery('gb');

  datastore.runQuery(q, function(err, entities, info) {
    if (err) {
      return;
    }

    var frontEndResponse = {
      gbentries: entities
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(frontEndResponse));
  });
});

app.post('/addmsg', (req, res) => {
   console.log(req.body)
   
   const taskKey = datastore.key('gb');

   const task = {
     key: taskKey,
     data: req.body
   }

   datastore.save(task)
    .then(() => {
      console.log('Saved');
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
});

// Start the server
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
