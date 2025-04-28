const endpoints = require('./endpoints.json')
//const {} = require('./model')


exports.getApi = (req, res) => {
    res.status(200).send(endpoints)
    console.log(endpoints, ">>>>endpoints")
}