// api/new-meetup --> url of this file, will trigger function defined in this file

import { MongoClient } from 'mongodb'

// req stores data from request
async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;

       const client = await MongoClient.connect('mongodb+srv://nicholascheong2618:Inaymmm2618@cluster0.jyw8gxz.mongodb.net/?retryWrites=true&w=majority')
       const db = client.db();

       const meetupsCollection = db.collection('meetups');

       const result = await meetupsCollection.insertOne(data)
       console.log(result)
       client.close()
        // status = 201 indicates insertion was successful
       res.status(201).json({message: 'Meetup inserted!'})
    }
}

export default handler;