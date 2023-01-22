CREATE DATABASE IF NOT EXISTS blog;

USE blog;

/**
   * @openapi
   * components:
   *   schemas:
   *     Admins:
   *       type: object
   *       properties:
   *         email:
   *           type: VARCHAR
   *           example: example@mail.com
   *         userName:
   *           type: VARCHAR
   *           example: John Doe
   *         password:
   *           type: VARCHAR
   *           example: yourpassword
   */
CREATE TABLE admins (
  id INT(11) NOT NULL AUTO_INCREMENT,
  email VARCHAR(32) NOT NULL,
  userName VARCHAR(11) NOT NULL,
  password VARCHAR(120) NOT NULL,
  role CHAR(2) DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (email),
  UNIQUE KEY (userName),
  PRIMARY KEY (id)
);

CREATE TABLE categories (
  id INT(11) NOT NULL AUTO_INCREMENT,
  description VARCHAR(60) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE posts (
  id INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  body VARCHAR(300) NOT NULL,
  category INT(11) NOT NULL,
  createdBy VARCHAR(45) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  editedBy VARCHAR(45) DEFAULT NULL,
  editedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
ALTER TABLE posts add FOREIGN KEY (category) REFERENCES categories (id);

CREATE TABLE post_images (
  id INT(11) NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(100) DEFAULT NULL,
  post_id INT(11) NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE post_images add FOREIGN KEY (post_id) REFERENCES posts (id);