// const s3 = require('../Utils/utils')
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mongoose = require('mongoose')
const Movie = require('../Models/MovieModel')
const Banner = require('../Models/BannerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/UserModel')
const dotenv = require('dotenv')
dotenv.config()

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    },
    region: process.env.region

})

let clients = [];

class AuthController {
    static Register = async (req, res) => {
        const { email, password, name } = req.body
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                res.status(200).json({
                    success: "false",
                    message: "Email Already Exists."
                });
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(req.body.password, salt);

                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    password: hash,
                });
                await newUser.save();

                res.status(200).json({
                    success: "true",
                    message: "User Created"
                });
            }
        } catch (err) {
            console.error(err);
            res.status(200).json({
                success: false,
                message: err.message
            });
        }
    }

    static SocialAuthRegister = async (req, res) => {
        const { name, email } = req.body
        const UserExist = await User.findOne({email, email})
        if(UserExist)
        {
            bcrypt.compare('123456789', UserExist.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        id: UserExist._id,
                        name: UserExist.name,
                        email: UserExist.email,
                    },
                        process.env.AppToken
                    )
                    res.status(200).json({
                        success: true,
                        data: {
                            id: UserExist.id,
                            name: UserExist.name,
                            email: UserExist.email,
                            token: token
                        }

                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: "Password doesn't match."
                    })
                }
            })
             
        }
        else
        {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('123456789', salt);

            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                email: email,
                password: hash,
            })
            await newUser.save()

            res.status(200).json({
                success: true,
                message: "You have registered successfully."
            }); 
        }
    }

    static Login = async (req, res) => {
        const { email, password } = req.body
        const UserExist = await User.findOne({ email: email })
        if (UserExist) {
            bcrypt.compare(password, UserExist.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        id: UserExist._id,
                        name: UserExist.name,
                        email: UserExist.email,
                    },
                        process.env.AppToken
                    )
                    return res.status(200).json({
                        success: true,
                        data: {
                            id: UserExist.id,
                            name: UserExist.name,
                            email: UserExist.email,
                            token: token
                        }

                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: "Password Doesn't Match"
                    })
                }
            })
        }

        else {
            res.status(200).json({
                success: false,
                message: "Email doesn't exist."
            })
        }

    }

    static AddMovie = async (req, res) => {
        const { thumbnail, video } = req.files;
        const { movieTitle, movieCategory, movieDescription } = req.body

        const currentDate = Date.now()

        const videoParams = {
            Bucket: process.env.Bucketname,
            Key: `${currentDate}_video_${video[0].originalname}`,
            Body: video[0].buffer,
            ContentType: video[0].mimetype,
        };

        const thumbnailParams = {
            Bucket: process.env.Bucketname,
            Key: `${currentDate}_thumbnail_${thumbnail[0].originalname}`,
            Body: thumbnail[0].buffer,
            ContentType: thumbnail[0].mimetype,
        };

        try {
            const videoUpload = new Upload({
                client: s3,
                params: videoParams,
                leavePartsOnError: false,
            });

            const thumbnailUpload = new Upload({
                client: s3,
                params: thumbnailParams,
                leavePartsOnError: false,
            });
            // console.log(upload)
            // return

            // const percentage = (progress.loaded / progress.total) * 100;
            // console.log(`Upload progress: ${percentage.toFixed(2)}%`);
            // clients.forEach(client => client.write(`data: ${percentage.toFixed(2)}\n\n`));
            //     await upload.done();
            // res.status(200).send('Upload complete');
            let lastPercentage = 0;

            videoUpload.on('httpUploadProgress', (progress) => {
                const percentage = Math.floor((progress.loaded / progress.total) * 100);
                console.log('Video upload progress:', percentage)
                if (percentage > lastPercentage) {
                    lastPercentage = percentage;
                    console.log(`Upload progress: ${percentage}%`);
                    clients.forEach(client => client.write(`data: ${percentage}\n\n`));
                }
            });

            // thumbnailUpload.on('httpUploadProgress', (progress) => {
            //     const percentage = Math.floor((progress.loaded / progress.total) * 100);
            //     console.log('Thumbnail upload progress:', percentage);
            //     if (percentage > lastPercentage) {
            //         lastPercentage = percentage;
            //         clients.forEach(client => client.write(`data: Thumbnail ${percentage}%\n\n`));
            //     }
            // });

            await Promise.all([videoUpload.done(), thumbnailUpload.done()]);

            if (videoUpload && thumbnailUpload) {
                const newMovie = Movie({
                    _id: new mongoose.Types.ObjectId(),
                    movieTitle: movieTitle,
                    movieCategory: JSON.parse(movieCategory),
                    movieDescription: movieDescription,
                    movieLink: videoParams.Key,
                    thumbnailLink: thumbnailParams.Key
                })
                await newMovie.save()
            }

            clients.forEach(client => client.write(`data: 100\n\n`)); // Ensure 100% is sent at the end
            res.status(200).json({
                success: true,
                message: "Your Video Has Been Uploaded."
            });


        } catch (error) {
            console.error('Error uploading:', error);
            res.status(200).json({
                success: false,
                message: error.message
            });
        }

    }

    static AddBanner = async (req, res) => {

        const currentDate = Date.now()
        const BannerObj = req.file;

        const BannerParams = {
            Bucket: process.env.Bucketname,
            Key: `Banner/${currentDate}_${BannerObj.originalname}`,
            Body: BannerObj.buffer,
            ContentType: BannerObj.mimetype,
        };

        try {
            const BannerUpload = new Upload({
                client: s3,
                params: BannerParams,
                leavePartsOnError: false,
            });
            await BannerUpload.done();

            if (BannerUpload) {
                const newBanner = new Banner({
                    _id: new mongoose.Types.ObjectId(),
                    Banner: BannerParams.Key,
                })
                await newBanner.save()
            }

            res.status(200).json({
                success: true,
                message: "Your Banner Has Been Uploaded."
            });

        } catch (error) {
            console.error('Error uploading:', error);
            res.status(200).json({
                success: false,
                message: error.message
            });
        }
    }

    static Events = async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        clients.push(res);

        req.on('close', () => {
            clients = clients.filter(client => client !== res);
        });
    };
}



module.exports = AuthController