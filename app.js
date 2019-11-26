const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3003;

const servicePoints = [{
    id: '1',
    name: 'Järna',
    parcels: [],
}];

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/rest/service-points/:servicePointId', (req, res) => {
    const servicePoint = getServicePoint(req.params.servicePointId);

    if(!servicePoint) {
        res.send().status(400);
        return;
    }

    res.send(servicePoint);
});

app.get('/rest/service-points/:servicePointId/parcels', (req, res) => {
    const servicePoint = getServicePoint(req.params.servicePointId);

    if(!servicePoint) {
        res.send().status(400);
        return;
    }

    res.send(servicePoint.parcels);
});

app.post('/rest/service-points/:servicePointId/parcels', (req, res) => {
    const servicePoint = getServicePoint(req.params.servicePointId);
    console.log(servicePoint);

    if(!servicePoint) {
        res.send().status(400);
        return;
    }

    const itemId = req.body.itemId;
    const shelfNumber = req.body.shelfNumber;

    if(!itemId || !shelfNumber) {
        res.send('Missing parameters').status(400);
        return;
    }

    if(servicePoint.parcels.findIndex((parcel) => parcel.itemId === itemId) >= 0) {
        res.send('Item already exists').status(403);
        return;
    }

    servicePoint.parcels.push(
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

    res.send(servicePoint.parcels).status(201);
});

app.delete('/rest/service-points/:servicePointId/parcels/:parcelId', (req, res) => {
    const servicePoint = getServicePoint(req.params.servicePointId);

    if(!servicePoint) {
        res.send().status(400);
        return;
    }

    const itemId = req.params.parcelId;

    if(!itemId) {
        res.send('Missing item id').status(400);
        return;
    }

    const index = servicePoint.parcels.findIndex((parcel) => parcel.itemId === itemId)

    if(index >= 0) {
        servicePoint.parcels.splice(index, 1);
    }

    res.send(servicePoint.parcels);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const getServicePoint = (id) => {
    console.log(id);
    console.log(servicePoints);
    var index = servicePoints.findIndex((servicePoint) => servicePoint.id === id);

    return index >= 0 ? servicePoints[index] : null;
}
