const endpoints = require('./endpoints.json')
const {selectTopics, selectArticleById, selectArticles, selectComments, insertComment, updateArticle, deleteFromComments, selectUsers} = require('./model')


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
    const {sort_by, order, topic} = req.query
    return selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}
exports.getComments = (req, res, next) => {
    const {article_id} = req.params
    return selectArticleById(article_id).then(() => {
        return selectComments(article_id).then((comments) => {
            if(comments.length === 0){
                res.status(404).send({msg: `No comments found for article_id: ${article_id}`})
            }
            res.status(200).send({comments})
        })
    })
    .catch((err)=>{next(err)})
}
exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    return selectArticleById(article_id).then(() => {
        return insertComment(article_id, username, body).then((comment)=>{
            res.status(201).send({comment})
        })
    })
    .catch((err)=>{
        next(err)
    })
}
exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    return selectArticleById(article_id).then(() => {
        return updateArticle(article_id, inc_votes).then((article)=>{
            res.status(200).send({article})
        })
    })
    .catch((err) => {
        next(err)
    })
}
exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    return deleteFromComments(comment_id).then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}
exports.getUsers = (req, res, next) => {
    return selectUsers().then((users)=>{
        res.status(200).send({users})
    })
}

