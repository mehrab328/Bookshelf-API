const express = require('express')
const Books = require('../models/books')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/books', auth, async (req, res) => {
    const book = new Books(req.body)

    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/books/details', async (req, res) => {
    const books = await Books.find({})

    if (!books) {
        return res.status(400).send('No books available')
    }

    res.send(books)
})

router.get('/books/list', async (req, res) => {
    const books = await Books.find({})
    const up = books.map(book => book.title)
    res.send(up)
})

router.delete('/books/:id', auth, async (req, res) => {
    try {
        const book = await Books.findOneAndDelete({ _id: req.params.id })
        if (!book) {
            res.status(404).send()
        }
        res.send(book)

    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/books/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'author', 'genre', 'publisher']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const book = await Books.findOne({ _id: req.params.id })

    try {
        updates.forEach(update => book[update] = req.body[update])
        await book.save()
        res.send(book)
    } catch (e) {
        res.status(400).send()
    }
})


module.exports = router