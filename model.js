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