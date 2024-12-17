DROP TABLE IF EXISTS movie_reviews, favorite_movies, group_movies, user_groups, users, groups CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255) NOT NULL
);  

CREATE TABLE favorite_movies (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    movie_title TEXT,
    poster_path TEXT,
    genres INT[],
    release_date DATE,
    overview text,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_movies (
    id INT NOT NULL,
    movie_id INT NOT NULL,
    movie_title TEXT,
    poster_path TEXT,
    genres INT[],
    release_date DATE,
    overview text,
    PRIMARY KEY (id, movie_id),
    FOREIGN KEY (id) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE user_groups (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member'
);

CREATE TABLE movie_reviews (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    movie_title TEXT,
    grade SMALLINT NOT NULL CHECK (grade >=1 AND grade <=5),
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);