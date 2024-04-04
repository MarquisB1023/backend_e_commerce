const pg = require ("pg")
const bcrypt = require ("bcrypt")
const jwt = require ('jsonwebtoken')
const client = new pg .client(
    process.env.DATABASE_URL || "postgress://localhost/ecommerce_smellstyles"
)

module.exports = client;
const UUID = "uuid";


const  createTables =  async()  => {
   
    const SQL= `

    DROP TABLE IF EXIST products,
    DROP TABLES IF EXIST users,
    DROP TABLES IF EXIST  orders,
    DROP TABLES IF EXIST  orderItems,


    CREATE TABLE products(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL
        );
       
        CREATE TABLE users(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
            );
        
           CREATE TABLE order(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            product_id UUID REFERENCES products(id),
            CONSTRAINT unique_product_user UNIQUE (user_id,product_id)
            );
    
            INSERT INTO  users (name, password,email) VALUES ('Frank','password','email');
            INSERT INTO  users (name, password ,email) VALUES ('jake','password','email');
            INSERT INTO  users(name, password,email) VALUES ('gill','password','email');
            INSERT INTO  users(name, password,email) VALUES ('Mate','password','email');
    
            INSERT INTO products (id) VALUES('colange_Versace');
            INSERT INTO products (id) VALUES('colange_Rebanne');
            INSERT INTO products (id) VALUES('colange_Prada);
            INSERT INTO products (id) VALUES('perfume_FORVRMood');
            INSERT INTO products (id) VALUES('perfume_lovestick');
            INSERT INTO products (id) VALUES('perfume_valetino');
            
            INSERT INTO order (id) VALUES ('UUID');
            INSERT INTO order (id) VALUES('UUID');
            INSERT INTO order (id) VALUES('UUID');
            INSERT INTO order (id) VALUES('UUID');
    `
    await client.query(SQL,[await bcrypt.hash("password",5),await bcrypt.hash("password",5),await bcrypt.hash("password",5),await bcrypt.hash("password",5)]);
}



const autheticateuser = async ()=>{
    const SQL = `
    SELECT id, password
    FROM users
    WHERE name = $1
    `
    const response = await client.query(SQL,[username])
    userInfo = response.rows
    if(userInfo.length || await bcrypt.compare(userInfo[0].password,password)) {
    const error = Error('Not Authorized')
  error.status = 401
  throw error
}
const token = await jwt.sign({id: response.rows[0].id},JWT)
console.log(token,"here")
return {token:token}
}

const createuser = async (name,password)=>{
  const SQL = `
  INSERT INTO  users (name, password) 
  VALUES ($1, $2)
   RETURNING *;
    `;
  const response = await client.query(SQL,[name,password][await bcrypt.hash("password",5)]);
  return response.rows;
}
const createproducts = async (products_id) => {
  const SQL = `
  INSERT INTO  products (name) 
  VALUES ($1, $2)
   RETURNING *;
    `;
  const response = await client.query(SQL,[await bcrypt.hash("password",5)]);
  return response.rows;
};


const fetchusers = async (user_id) => {
  const SQL = `
    SELECT * from users
    WHERE id =$1
    `;
  const response = await client.query(SQL,[user_id]);
  return response.rows;
};

const fetchproducts = async (products_id) => {
  const SQL = `
    SELECT * from products
    WHERE id =$1
    `;
  const response = await client.query(SQL,[products_id]);

  return response.rows;
};

const fetchorderItemss = async (user_id,products_id) => {
  const SQL = `
  SELECT *
  FROM order
  WHERE user_id = $1
    `;
  const response = await client.query(SQL,[user_id,products_id]);

  return response.rows;
};

const orderItems = async (user_id, product_id) => {
  const SQL = `
    INSERT INTO users_products(id, userId,productId)
    VALUES($1 ,$2, $3)
    `;
  const response = await client.query(SQL, [UUID.v4(), user_id, product_id]);
  return response.rows;
};

module.exports = {
  createTables,
  client,
  autheticateuser,
  createuser,
  createproducts,
  fetchusers,
  fetchproducts,
  fetchorderItemss,
  orderItems,
};