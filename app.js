const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3003;

const servicePoints = [{ name: 'Järna', }];
let parcels = [];

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/rest/parcels', (req, res) => {
    res.send(parcels);
});

app.post('/rest/parcels', (req, res) => {
    const itemId = req.body.itemId;
    const shelfNumber = req.body.shelfNumber;

    if(!itemId || !shelfNumber) {
        res.send('Missing parameters').status(400);
        return;
    }

    if(parcels.findIndex((parcel) => parcel.itemId === itemId) >= 0) {
        res.send('Item already exists').status(403);
        return;
    }

    parcels.push(
        {
            itemId,
            shelfNumber,
            recipientName: req.body.recipientName || '',
            recipientAddress: req.body.recipientAddress || '',
            recipientAddress2: req.body.recipientAddress2 || '',
            recipientPostalCode: req.body.recipientPostalCode || '',
            recipientCity: req.body.recipientCity || '',
            recipientCountry: req.body.recipientCountry || '',
            senderName: req.body.senderName || '',
        }
    );

    res.send(parcels).status(201);
});

app.delete('/rest/parcels/:id', (req, res) => {
    const itemId = req.params.id;

    if(!itemId) {
        res.send('Missing item id').status(400);
        return;
    }

    const index = parcels.findIndex((parcel) => parcel.itemId === itemId)

    if(index >= 0) {
        parcels.splice(index, 1);
    }

    res.send(parcels);
});

app.get('/rest/service-points/:id', (req, res) => {
    const servicePointId = req.params.id;

    if(servicePointId === -1) {
        res.send().status(400);
        return;
    }

    res.send(servicePoints[servicePointId-1]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));