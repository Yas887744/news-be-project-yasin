const db = require('./db/connection')

exports.selectTopics = () => {
    return db
    .query("SELECT * FROM topics")
    .then((result) => {
        return result.rows
    })
}
exports.selectArticleById = (id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found under article_id: ${id}`
            })
        }
        return rows[0]
    })
} 
exports.selectArticles = () => {
    return db
    .query(`SELECT articles.article_id, articles.title, 
        articles.topic, articles.author, 
        articles.created_at, articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC`)
    .then(({rows}) => {
        return rows
    })
}
exports.selectComments = (id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY created_at DESC`, [id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No comments found for article_id: ${id}`
            })
        }
        return rows
    })
}