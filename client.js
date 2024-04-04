

const pg = require ("pg")
const bcrypt = require ("bcrypt")
const jwt = require ('jsonwebtoken')
const client = new pg .client(
    process.env.DATABASE_URL || "postgress://localhost/ecommerce_smellstyles"
)

module.exports = { client }