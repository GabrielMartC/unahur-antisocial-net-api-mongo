const Tag  = require('../models/tag')
const Post = require('../models/post');

const getTags = async (req, res) => {
    try {
        const tags = await Tag.find()

        res.status(200).json(tags)

    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const getTagByPk = async (req, res) => {
    try {
        const id = req.params.id
        const tag = await Tag.findById(id)
        if (!tag) {
            return res.status(404).json({ message: 'Tag no encontrado' })
        }


        res.status(200).json(tag)

    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const createTag = async (req, res) => {
    try {
        const newTag = await Tag.create(req.body)

        res.status(201).json(newTag)
    } catch (error) {
        res.status(500).json({ message: 'Error interno' })
    }
}

const updateTag = async (req, res) => {
    try {
        const id = req.params.id
        const modifiedTag = await Tag.findByIdAndUpdate(
            id,
            req.body,
            {new: true} //devuelve el documento actualizado (por defecto devuelve el anterior).
        )

        if (!modifiedTag) {
            return res.status(404).json({ message: 'Tag no encontrado' })
        }

        res.status(200).json(modifiedTag)
    } catch (error) {
        res.status(500).json({ message: 'Error interno' })

    }
}

const deleteTag = async (req, res) => {

    try {
        const idTag = req.params.id

        const tag = await Tag.findById(idTag)
        if (!tag) {
            return res.status(404).json({ message: 'Tag no encontrado' })
        }
       
        await Post.updateMany({ tags: idTag },{ $pull: { tags: idTag } }); // Quitar la referencia del tag en todos los posts

        await Tag.findByIdAndDelete(idTag);// Eliminar el tag

        res.status(200).json({ message: `Tag con id: ${idTag} eliminado correctamente`});

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({ message: "Error interno" });
    }

}

module.exports = { getTags, getTagByPk, createTag, updateTag, deleteTag }