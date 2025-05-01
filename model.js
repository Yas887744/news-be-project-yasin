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
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id])
    .then(({rows}) => {
        return rows
    })
}
exports.insertComment = (id, author, body) => {
    return db
    .query(`INSERT INTO comments(article_id, body, author) VALUES($1, $2, $3) RETURNING *;`, [id, body, author])
    .then(({rows}) => {
        if(rows[0].author === null){
            return Promise.reject({
                status: 400,
                msg: "Username invalid no username given"
            })
        }
        return rows[0]
    })
}
exports.updateArticle = (id, votes) => {
    return db
    .query(`UPDATE articles  SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [votes, id])
    .then(({rows}) => {
        return rows[0]
    })
}
exports.deleteFromComments = (id) => {
    return db
    .query("DELETE FROM comments WHERE comment_id = $1", [id])
}