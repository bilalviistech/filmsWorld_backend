const express = require('express');
const app = express();
const port = 3020; // Example port, change as needed
const Route = require('./Route')
const multer = require('multer')
const { S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
const { Upload } = require('@aws-sdk/lib-storage');
const dotenv = require('dotenv')
dotenv.config()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) 

app.use("/api", Route)

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });


const s3 = new S3Client({
    credentials:{
        accessKeyId:  process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    },
    region: process.env.region
 
})


// let clients = [];

// app.get('/events', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     clients.push(res);

//     req.on('close', () => {
//         clients = clients.filter(client => client !== res);
//     });
// });

// app.post('/post-videos', upload.single('video'), async (req, res) => {
//     const currentDate = Date.now()
   
//     const params = {
//         Bucket: process.env.Bucketname,
//         Key: currentDate + req.file.originalname,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype,
//     };

//     try {
//         const upload = new Upload({
//             client: s3,
//             params,
//             leavePartsOnError: false,
//         });

//             // const percentage = (progress.loaded / progress.total) * 100;
//             // console.log(`Upload progress: ${percentage.toFixed(2)}%`);
//             // clients.forEach(client => client.write(`data: ${percentage.toFixed(2)}\n\n`));
//         //     await upload.done();
//         // res.status(200).send('Upload complete');
//         let lastPercentage = 0;

//         upload.on('httpUploadProgress', (progress) => {
//             const percentage = Math.floor((progress.loaded / progress.total) * 100);
//             console.log('this is first percentage', percentage)
//             if (percentage > lastPercentage) {
//                 lastPercentage = percentage;
//                 console.log(`Upload progress: ${percentage}%`);
//                 clients.forEach(client => client.write(`data: ${percentage}\n\n`));
//             }
//         });

//         await upload.done();
//         // UploadId
//         // Key
//         if(upload){

//         }
//         console.log(upload)
//         return
//         clients.forEach(client => client.write(`data: 100\n\n`)); // Ensure 100% is sent at the end
//         res.status(200).send('Upload complete');

        
//     } catch (error) {
//         console.error('Error uploading:', error);
//         res.status(500).send('Error uploading file');
//     }
// });


























