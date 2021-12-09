const catchAsync = require('./../../Exceptions/catchAsync');
const filesystem = require('fs');
const AppError = require('./../../Exceptions/appError');
const Controller = require('./Controller');
const Post = require('../../Models/Post');

const multer = require('multer');
const sharp = require('sharp');

class PostController extends Controller{
    constructor() {
        super();

        this.multerStorage = multer.memoryStorage();
    }

    multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')){
            cb(null, true);
        }else {
            cb(new AppError('File not supported, we only support images or videos', 400), false);
        }

    }

    upload = multer({
        storage: this.multerStorage,
        fileFilter: this.multerFilter
    });

    //User Image Processing methods
    uploadMedia = this.upload.single('media');

    setUpMedia = catchAsync(async (req, res, next) => {
        // 1. check if a file is uploaded
        if (!req.file) return next();

        //2. Check file size
        if (req.file.size > 52428800){
            return next(new AppError('File too large, file must not be greater than 50MB', 400))
        }

        //3. Encode the image file to jpeg and upload
        if (req.file.mimetype.startsWith('image')){
            req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
            await sharp(req.file.buffer)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/uploads/images/posts/${req.file.filename}`);
        }
        next();
    });

    removePostMedia = async (filename) => {
        await filesystem.unlink(`public/uploads/images/posts/${filename}`, function (err) {
        });
    }

    createPost = catchAsync(async (req, res, next) => {
       // Add user and media details to the request body
        if (!req.body.content || !req.file){
            return next(new AppError('We need the content or the media of the post', 400));
        }

        req.body.user = req.user._id;
        if (req.file){
            req.body.media = req.file.filename;
        }

        // Delete Unwanted fields
        delete req.body.createdAt;
        delete req.body.updatedAt;

        const post = await Post.create(req.body);
        if (!post){
            return next(new AppError('Something went wrong with the upload', 400))
        }

        res.status(201).json({
            status: 'success',
            data: {
                post
            }
        })
    });

    updatePost = catchAsync(async (req, res, next) => {

        const post = await Post.findOne({ _id: req.params.id });
        if (!post){
            return next(new AppError('Sorry, we couldn\'t find the post', 404));
        }

        //2.Verify if the current User Owns the account
        if (post.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to perform this update', 403));
        }
        // Add user and media details to the request body
        if (req.file){
            req.body.media = req.file.filename;
            // Delete old media if exist
            if (post.media){ await this.removePostMedia(post.media); }
        }


        // Delete Unwanted fields
        delete req.body.createdAt;
        delete req.body.updatedAt;

        const updatedPost = await Post.findByIdAndUpdate(post._id, req.body, {
            new: true, //To return the updated version of the document
            runValidators: true, // To validate inputs based on the Business schema
            useFindAndModify: false
        });

        res.status(202).json({
            status: 'success',
            data: {
                updatedPost
            }
        })
    });

    getAppPosts = this.getAll(Post);

    getPost = this.getOne(Post);

    deletePost = catchAsync(async (req, res, next) => {

        const post = await Post.findOne({ _id: req.params.id });
        if (!post){
            return next(new AppError('Sorry, we couldn\'t find the post', 404));
        }

        //2.Verify if the current User Owns the account
        if (post.user._id.toString() !== req.user._id.toString()){
            return next(new AppError('You are not Authorized to delete this post', 403));
        }

        // Delete any media attached with the post
         if (post.media){ await this.removePostMedia(post.media); }

         //Delete the post from database
         await post.delete();

        res.status(202).json({
            status: 'success',
            message: "Post Deleted successfully"
        })
    });

    getMyPosts = catchAsync(async (req, res, next) => {

        const posts = await Post.find({ user: req.user._id });
        if (!posts){
            return next(new AppError('Sorry, we couldn\'t find any post for you', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                posts
            }
        })
    });




}

module.exports = new PostController;