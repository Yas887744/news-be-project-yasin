const endpoints = require('./endpoints.json')
const {selectTopics} = require('./model')


exports.getApi = (req, res) => {
    res.status(200).send({endpoints})
}
exports.getTopics = (req, res, next) => {
    return selectTopics().then((result)=>{
        res.status(200).send(result)
    })
}