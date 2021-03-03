const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    const q = `
    SELECT * 
    FROM images
    ORDER BY id DESC
    LIMIT 4
    `;
    return db.query(q);
};

module.exports.addImage = (url, username, title, description) => {
    const q = `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

// get selected image info plus next, previous image ids (subqueries)
module.exports.getSelImage = (id) => {
    const q = `
    SELECT *, (
        SELECT id FROM images
        WHERE id <$1
        ORDER BY id DESC
        LIMIT 1
    ) AS "nextImgId", (
        SELECT id FROM images
        WHERE id >$1
        ORDER BY id ASC
        LIMIT 1
    ) AS "prevImgId"
    FROM images
    WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.getMoreImages = (id) => {
    const q = `
    SELECT id, url, title, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id <$1
    ORDER BY id DESC
    LIMIT 4
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.getComments = (id) => {
    const q = `
    SELECT *
    FROM comments
    WHERE image_id = $1
    ORDER BY id DESC
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addComment = (username, comment, image_id) => {
    const q = `
    INSERT INTO comments (username, comment, image_id)
    VALUES ($1, $2, $3)
    `;
    const params = [username, comment, image_id];
    return db.query(q, params);
};
