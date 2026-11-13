const User =require('../models/user')
const Post =require('../models/post')
const Comment =require('../models/comment')

const getUser = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const getUserByPk = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const getPostsByUserId = async (req, res) => {
    try {
        const posteos = await Post.find({ autor: req.params.id })
        res.status(200).json(posteos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const getCommentsByUserId = async (req, res) => {
    try {
        const comentarios = await Comment.find({ user: req.params.id })
        res.status(200).json(comentarios)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const createUser = async (req, res) => {
    try {
        const usuarioExistente = await User.findOne({
            nickName: req.body.nickName
        });

        if (usuarioExistente) {
            return res.status(409).json({ message: "El nickname ya esta registrado" });
        }

        const newUser = await User.create(req.body);
        res.status(201).json(newUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno' });
    }
}

const createPostByUserId = async (req, res) => {
    try {
        const nuevoPost = await Post.create({
            autor: req.params.id,
            content: req.body.content
        })

        res.status(201).json(nuevoPost)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const createCommentByUserId = async (req, res) => {
    try {
        const post = await Post.findById(req.body.PostId)
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' })
        }

        const nuevoComentario = await Comment.create({
            user: req.params.id,
            post: req.body.PostId,
            content: req.body.content
        })

        return res.status(201).json(nuevoComentario)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error interno' })
    }
}


const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const modifiedUser = req.body

        const user = await User.findByIdAndUpdate(
            id,
            modifiedUser,
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}



const deleteUser = async (req, res) => {/// eliminacion en cascada 
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        const posts = await Post.find({ autor: id });
        const postIds = posts.map(post => post._id);

        await Comment.deleteMany({ post: { $in: postIds } });
        await Comment.deleteMany({ user: id });
        await Post.deleteMany({ autor: id });
        
        await User.findByIdAndDelete(id);

        res.status(200).json({message: `Usuario con id: ${id} eliminado correctamente`});
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }
}

module.exports = {
    getUser, getUserByPk, getPostsByUserId, getCommentsByUserId, createUser, createPostByUserId,
    createCommentByUserId, updateUser, deleteUser
}
