const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3')
const mongoose = require('mongoose')
const Series = require('../Models/SeriesModel')
const Episodes = require('../Models/EpisodesModel')
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

class SeriesController{

    static AddSeries = async (req, res) => {
        const { Title } = req.body;

        const currentDate = Date.now()
        const SeriesObj = req.file;

        const SeriesParams = {
            Bucket: process.env.Bucketname,
            Key: `Series/${currentDate}_${SeriesObj.originalname}`,
            Body: SeriesObj.buffer,
            ContentType: SeriesObj.mimetype,
        };

        try {
            const SeriesUpload = new Upload({
                client: s3,
                params: SeriesParams,
                leavePartsOnError: false,
            });
            await SeriesUpload.done();

            if (SeriesUpload) {
                const newSeries = new Series({
                    _id: new mongoose.Types.ObjectId(),
                    Title: Title,
                    SeriesBanner: SeriesParams.Key
                });
        
                await newSeries.save();
                res.status(200).json({
                    success: true,
                    message: "Series added successfully."
                });
            }
            else{
                res.status(200).json({
                    success: false,
                    message: "Network problem try again."
                });
            }
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            });
        }
    }

    static AddEpisodes = async (req, res) => {
        const { EpisodeTitle, EpisodeNumber }= req.body
        const seriesId = req.params.seriesid

        const currentDate = Date.now()
        const EpisodeObj = req.file;

        const EpisodeParams = {
            Bucket: process.env.Bucketname,
            Key: `Episode/${currentDate}_${EpisodeObj.originalname}`,
            Body: EpisodeObj.buffer,
            ContentType: EpisodeObj.mimetype,
        };

        try{
            const SeriesExist = await Series.findOne({_id:seriesId})

            if(SeriesExist)
            {
                const EpisodeUpload = new Upload({
                    client: s3,
                    params: EpisodeParams,
                    leavePartsOnError: false,
                });
                await EpisodeUpload.done();

                if(EpisodeUpload){
                    const SeriesEpisodes = new Episodes({
                        _id: new mongoose.Types.ObjectId(),
                        EpisodeTitle: EpisodeTitle,
                        EpisodeNumber: EpisodeNumber,
                        EpisodeImage: EpisodeParams.Key,
                        SeriesId:seriesId
                    });
                    await SeriesEpisodes.save();

                    res.status(200).json({
                        success: true,
                        message: "Episode added successfully."
                    });
                }
                else{
                    res.status(200).json({
                        success: false,
                        message: "Network problem try again."
                    });
                }
            }
            else{
                res.status(200).json({
                    success: false,
                    message: "Series doesn't exist."
                })
            }

        }
        catch(error){
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllSeries = async(req, res)=>{
        try {
            const GetAllSeries = await Series.find({})

            res.status(200).json({
                success: true,
                path: process.env.movieDomainURL,
                data: GetAllSeries
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetEpisodesBySeries = async(req, res)=>{
        try {
            
            const SeriesId = req.params.SeriesId
            const SeriesExist = await Series.findOne({_id: SeriesId})
            
            if(SeriesExist){
                const AllEpisodes = await Episodes.find({SeriesId: SeriesExist._id})
    
                res.status(200).json({
                    success: true,
                    path: process.env.movieDomainURL,
                    data: AllEpisodes
                })
            }
            else{
                res.status(200).json({
                    success: false,
                    message: "Series doesn't exist."
                })
            }
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }

    }

}
module.exports = SeriesController