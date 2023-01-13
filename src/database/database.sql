CREATE DATABASE IF NOT EXISTS companydb;

USE blog;

CREATE TABLE posts (
  id INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  body VARCHAR(300) NOT NULL,
  category INT(11) NOT NULL,
  createdBy VARCHAR(45) NOT NULL,
  createdDate date NOT NULL,
  editedBy VARCHAR(45) DEFAULT NULL,
  editedBy date DEFAULT NULL,
  PRIMARY KEY (id)
);

DESCRIBE posts;

INSERT INTO posts VALUES
(1, 'React', 'librería de JavaScript', 1, 'Diego', '12/1/2023')