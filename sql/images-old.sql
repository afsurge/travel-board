DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    comment TEXT NOT NULL CHECK (comment <> ''),
    image_id INT NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/travel-board/Karlsruhe-2017.jpg',
    'Abrar',
    'Karlsruhe',
    'First home in Germany since 2012.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/travel-board/Heidelberg-2017.jpg',
    'Abrar',
    'Heidelberg',
    'Close from home. Visited in 2017.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/travel-board/Zurich-2017.jpg',
    'Abrar',
    'Zurich',
    'First trip with wife. Conference plus sight-seeing in 2017.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/travel-board/Munich-2017.jpg',
    'Abrar',
    'Munich',
    'First German big city visit in 2017.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/travel-board/Neuschwanstein-2017.jpg',
    'Abrar',
    'Neuschwanstein Castle',
    'Disney castle visit from Munich in 2017.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/travel-board/Vienna-2017.jpg',
    'Abrar',
    'Vienna',
    'First festival with in-laws in Europe in 2017.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
    'funkychicken',
    'Welcome to Spiced and the Future!',
    'This photo brings back so many great memories.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
    'discoduck',
    'Elvis',
    'We can''t go on together with suspicious minds.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
    'discoduck',
    'To be or not to be',
    'That is the question.'
);
