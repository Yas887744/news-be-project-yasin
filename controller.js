const endpoints = require('./endpoints.json')
const {selectTopics, selectArticleById, selectArticles, selectComments} = require('./model')


exports.getApi = (req, res) => {
    res.status(200).send({endpoints})
}
exports.getTopics = (req, res, next) => {
    return selectTopics().then((result)=>{
        res.status(200).send(result)
    })
}
exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    return selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}
exports.getArticles = (req, res, next) => {
    return selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}
exports.getComments = (req, res, next) => {
    const {article_id} = req.params
    return selectComments(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}