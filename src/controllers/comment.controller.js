const Comment =require('../models/comment')

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find()

        res.status(200).json(comments)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const getCommentByPk = async (req, res) => {
    try {
        const id = req.params.id
        const comment = await Comment.findById(id)

        if (!comment) {
            return res.status(404).json({
                message: 'Comentario no encontrado'
            })
        }

        res.status(200).json(comment)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const updateComment = async (req, res) => {
    try {
        const id = req.params.id
        const modifiedComment = req.body

        const comment = await Comment.findByIdAndUpdate(
            id,
            modifiedComment,
            { new: true }
        )

        if (!comment) {
            return res.status(404).json({
                message: 'Comentario no encontrado'
            })
        }

        res.status(200).json(comment)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id

        const comment = await Comment.findByIdAndDelete(id)

        if (!comment) {
            return res.status(404).json({
                message: 'Comentario no encontrado'
            })
        }

        res.status(200).json({
            message: `Comentario con id: ${id} eliminado correctamente`
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno' })
    }
}

module.exports = { getComments, getCommentByPk, updateComment, deleteComment }