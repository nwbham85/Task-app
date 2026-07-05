import Post from '../models/Post.js';  // ✅ correct path

// desc - get all posts
// route - GET /api/v1/posts
// access - public
export const getPosts = async (req, res, next) => {
    const posts = await Post.find();
    res.status(200).json({
        success: true,
        data: posts
    });
}

// desc - get single post
// route - GET /api/v1/posts/:id
// access - public
export const getPost = async (req, res, next) => {
    
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
        return res.status(400).json({success:false});
        }

        res.status(200).json({success:true});
    } catch (error) {

        res.status(400).json({success: false});
    }
}

// desc - create new post
// route - POST /api/v1/posts
// access - private
export const createPost = async (req, res, next) => {

    try {

    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
    } catch {
        res.status(400).json({success:false});
        console.error('400 error');
    }
}

// desc - update single post
// route - PUT /api/v1/posts/:id
// access - private
export const updatePost = async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: post });
}

// desc - delete single post
// route - DELETE /api/v1/posts/:id
// access - private
export const deletePost = async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
}