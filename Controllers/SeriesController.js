const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3')
const mongoose = require('mongoose')
const Series = require('../Models/SeriesModel')
const Episodes = require('../Models/EpisodesModel')
const Season = require('../Models/SeasonModel')
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
            Key: `Series/Thumbnail/${currentDate}_${SeriesObj.originalname}`,
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

    // static AddSeason = async (req, res) => {
    //     const SeasonID = req.params.SeasonID
    //     const SeasonNumber = req.params.SeasonNumber

    //     try {
    //         const SeasonExist = await Season.findOne({_id: SeasonID})
    //         if(SeasonExist){
    //             const SeasonNumberExist = await Season.findOne({ Season: { $in: [SeasonNumber] } })

    //             if(SeasonNumberExist){
    //                 return res.status(200).json({
    //                     success: false,
    //                     message: "Season already added."
    //                 })
    //             }
    
    //             await SeasonExist.updateOne({ $addToSet: { Season: SeasonNumber } })
    
    //             res.status(200).json({
    //                 success: true,
    //                 message: "Season add successfuly."
    //             })
    //         }
    //         else{
    //             const newSeason = new Season({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 Season: SeasonNumber,
    //             })
    //             await newSeason.save()

    //             res.status(200).json({
    //                 success: true,
    //                 message: "Season add successfuly."
    //             })
    //         }

    //     } catch (error) {
    //         res.status(200).json({
    //             success: false,
    //             message: error.message
    //         })
    //     }
    // }

    static AddSeason = async (req, res) => {
        const SeriesID = req.params.SeriesID
        const SeasonNumber = req.params.SeasonNumber

        try {
            const SeriesExist = await Series.findOne({_id: SeriesID})
            if(!SeriesExist){
                return res.status(200).json({
                    success: false,
                    message: "Series doesn't exist."
                })
            }  

            // Check if the season number already exists
            const seasonExists = SeriesExist.Season.find(e => e == SeasonNumber);
            if (seasonExists) {
                return res.status(200).json({
                    success: false,
                    message: "This season has already been added to the series."
                });
            }
    
            // Add the new season number to the series
            SeriesExist.Season.push(SeasonNumber);
            await SeriesExist.save();

            res.status(200).json({
                success: true,
                message: "Season added successfuly."
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static AddEpisodes = async (req, res) => {
        const episodeThumbnail = req.file;
        const { EpisodeTitle, EpisodeNumber, seriesId, EpisodeVideoLink, seasonNo }= req.body

        const currentDate = Date.now()

        const EpisodeThumbnailParams = {
            Bucket: process.env.Bucketname,
            Key: `Episode/Thumbnail/${currentDate}_${episodeThumbnail.originalname}`,
            Body: episodeThumbnail.buffer,
            ContentType: episodeThumbnail.mimetype,
        };

        try{
            const SeriesExist = await Series.findOne({_id:seriesId})

            if(SeriesExist)
            {
                const EpisodeThumbnailUpload = new Upload({
                    client: s3,
                    params: EpisodeThumbnailParams,
                    leavePartsOnError: false,
                });
                await EpisodeThumbnailUpload.done();

                if(EpisodeThumbnailUpload){
                    const SeriesEpisodes = new Episodes({
                        _id: new mongoose.Types.ObjectId(),
                        EpisodeTitle: EpisodeTitle,
                        EpisodeNumber: EpisodeNumber,
                        EpisodeImage: EpisodeThumbnailParams.Key,
                        EpisodeVideo: EpisodeVideoLink,
                        seasonNo: seasonNo,
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

    static GetAllSeasonBySeries = async(req, res)=>{
        const seriesId = req.params.seriesId
        try {
            const GetAllSeasonBySeries = await Series.findOne({_id: seriesId})
            res.status(200).json({
                success: true,
                data: GetAllSeasonBySeries
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

}
module.exports = SeriesController