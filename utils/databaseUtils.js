import Sequelize from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:111@localhost:5432/postgres');

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Products = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.TEXT
    },
    brand: {
        type: Sequelize.TEXT
    },
    company: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.FLOAT
    },
    isbn: {
        type: Sequelize.TEXT
    }
});

// force: true will drop the table if it already exists
// Products.sync({force: true}).then(() => {
//     // Table created
//     return Products.create({
//         firstName: 'John',
//         lastName: 'Hancock'
//     });
// });

Products.findAll().then(products => {
    console.log(products)
});