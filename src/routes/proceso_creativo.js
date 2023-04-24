const express = require('express')
const router = express.Router()

const Proceso_Creativo = require('../models/proceso_creativo')

router.get('/',async (req, res) => {
    const procesos_creativos = await Proceso_Creativo.find()
    res.json(procesos_creativos)
})

router.post('/',async (req, res) => {
    const proceso_creativo = new Proceso_Creativo(req.body)
    await proceso_creativo.save()
    res.json({
        status: 'Proceso Creativo guardado'
    })
})

router.put('/:id',async (req, res) => {
    await Proceso_Creativo.findByIdAndUpdate(req.params.id, req.body)
    res.json({
        status: 'Proceso Creativo actualizado'
    })
})

router.delete('/:id',async (req, res) => {
    await Proceso_Creativo.findByIdAndRemove(req.params.id)
    res.json({
        status: 'Proceso Creativo eliminado'
    })
})

module.exports = router