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
    .query(`SELECT articles.article_id, articles.title, 
        articles.topic, articles.author, articles.body, articles.created_at, 
        articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1 GROUP BY articles.article_id;` , [id])
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
exports.selectArticles = (sort = "created_at", order = "DESC", topic) => {
    const allowedInputsSort = ["title", "topic", "author", "body", "created_at", "votes", "article_img_url"]
    const allowedInputsOrder = ["ASC", "DESC", "asc", "desc"]
    if(!allowedInputsSort.includes(sort) || !allowedInputsOrder.includes(order)){
		return Promise.reject({
			status : 400,
			msg: "Invalid input"
		})
	}
    const query = `SELECT articles.article_id, articles.title, 
        articles.topic, articles.author, 
        articles.created_at, articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count
        FROM articles`
    
    const condition = ` LEFT JOIN comments ON articles.article_id = comments.article_id`
    const topicQuery = ` WHERE topic = $1` 
    const sortOrderQuery = ` GROUP BY articles.article_id ORDER BY ${sort} ${order}`
    if(topic){
        return db
        .query(query + condition + topicQuery + sortOrderQuery, [topic])
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: `No topic found for ${topic}`
                })
            }
            return rows
        })
    }
    return db.query(query + condition + sortOrderQuery)
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
    .then(({rowCount})=>{
       if(rowCount===0){
        return Promise.reject({
            status: 404,
            msg: `No comment found under comment_id: ${id}`
        })
       }
    })
}
exports.selectUsers = () => {
    return db
    .query("SELECT * FROM users")
    .then(({rows})=>{
        return rows
    })
}