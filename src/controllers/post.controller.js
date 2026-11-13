const Post =require('../models/post')
const Tag =require('../models/tag')
const Comment =require('../models/comment')

const getPosts = async (req, res) => {
    try {
        const populateComments = {
            path: 'comments',
            select: 'content fechaCreacion post',

            transform: (comment) => ({
                content: comment.content,
                fechaCreacion: comment.fechaCreacion
            })
        };

        const posts = await Post.find().populate(populateComments);
        
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const getPostByPk = async (req, res) => {
    try {
        const id = req.params.id
        
        const populateComments = {
            path: 'comments',
            select: 'content fechaCreacion post',

            transform: (comment) => ({
                content: comment.content,
                fechaCreacion: comment.fechaCreacion
            })
        };

        const post = await Post.findById(id).populate(populateComments);

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const getImagesByPostId = async (req, res) => { // Imágenes incrustadas
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        res.status(200).json(post.images)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const getCommentsByPostId = async (req, res) => {
    try {
        const populateComments = {
            path: 'comments',
            select: 'content fechaCreacion post',

            transform: (comment) => ({
                content: comment.content,
                fechaCreacion: comment.fechaCreacion
            })
        };
        
        await req.post.populate(populateComments);

        res.status(200).json(req.post.comments);

    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const getTagsByPostId = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('tags');
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        res.status(200).json(post.tags)
    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const addImageToPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        post.images.push({
            url: req.body.url
        })

        await post.save()

        res.status(201).json(post.images)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const addTagToPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const tag = await Tag.findById(req.body.idTag)

        post.tags.push(tag._id)
        await post.save()

        res.status(201).json({
            mensaje: `El tag ${tag.name} fue agregado al post con id ${post._id}`
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const updatePost = async (req, res) => {
    try {
        const id = req.params.id
        const modifiedPost = req.body

        const post = await Post.findByIdAndUpdate(
            id,
            modifiedPost,
            { new: true }
        )

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        res.status(200).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const deletePost = async (req, res) => {
    try {
        const id = req.params.id

        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        await Comment.deleteMany({ post: id })
        await Post.findByIdAndDelete(id)

        res.status(200).json({
            message: `Post con id: ${id} eliminado correctamente`
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}


const deleteImageToPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        const imagen = post.images.id(req.params.imgId)

        if (!imagen) {
            return res.status(404).json({ message: 'Imagen no encontrada en ese post' })
        }

        imagen.deleteOne()
        await post.save()

        res.status(200).json({ message: 'Imagen eliminada correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const dissociateTagToPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        const tag = await Tag.findById(req.params.tagId)

        if (!tag) {
            return res.status(404).json({ message: 'Tag no encontrado' })
        }

        post.tags.pull(tag._id)
        await post.save()

        res.status(200).json({
            message: `Tag "${tag.name}" desasociado del post`
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}



module.exports = {
    getPosts, getPostByPk, getImagesByPostId, getCommentsByPostId, getTagsByPostId, addImageToPost, 
    addTagToPost, updatePost, deletePost, deleteImageToPost, dissociateTagToPost
}