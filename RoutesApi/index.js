const ordersRouter = require('./ordersRoutes.js')

const apiRouter = require('express').Router()

// full path
// <domain>/api

apiRouter.use('/auth', require('./auth.js'))

ordersRouter.use('/orderRoutes',require('./ordersRoutes.js'))
productssRouter.use('/productsRoutes',require('.productsRoutes.js'))

module.exports = apiRouter