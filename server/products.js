const { client } = require('../index.js')
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT = process.env.JWT_SECRET || 'shhh'
if (JWT === 'shhh') {
  console.log('\nIf deployed, set process.env.JWT to something other than shhh')
}

async function createProducts({ Productsname, password }) {
  const SQL = `
    INSERT INTO Productss(id, Productsname, password) VALUES($1, $2, $3) RETURNING *
  `
  const response = await client.query(SQL, [uuid.v4(), Productsname, await bcrypt.hash(password, 5)])
  return response.rows[0]
}

async function fetchProductss() {
  const SQL = `
    SELECT id, Productsname FROM Productss;
  `
  const response = await client.query(SQL)
  return response.rows
}



async function findProductsWithToken(token) {
  let id
  try {
    const payload = jwt.verify(token, JWT)
    id = payload.id
  } catch (ex) {
    const error = Error('not authorized')
    error.status = 401
    throw error
  }
  const SQL = `
    SELECT id, Productsname FROM Productss WHERE id=$1;
  `
  const response = await client.query(SQL, [id])
  if (!response.rows.length) {
    const error = Error('not authorized')
    error.status = 401
    throw error
  }
  return response.rows[0]
}

async function authenticate({ Productsname, password }) {
  const SQL = `
    SELECT id, Productsname, password FROM Productss WHERE Productsname=$1;
  `
  const response = await client.query(SQL, [Productsname])
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error('not authorized')
    error.status = 401
    throw error
  }
  const token = jwt.sign({ id: response.rows[0].id }, JWT)
  return { token }
}

module.exports = {
  createProducts,
  fetchProductss,
  isLoggedIn,
  findProductsWithToken,
  authenticate
}