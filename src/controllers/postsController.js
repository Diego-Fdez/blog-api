import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../database/index.js';
import { validationResult } from 'express-validator';
import { badWords } from '../utilities/badWordsDictionary.js';

dotenv.config();

/** It creates a regular expression that matches any of the words in the array badWords, and then tests
 * the word passed to the function against that regular expression */
const checkBadWords = (word) => {
  const rgx = new RegExp(badWords.join('|') + '|' + '/gi');
  return rgx.test(word);
};

/** It gets the posts from the database and sends them to the client */
export const getPosts = async (req, res) => {
  const { category = 1, page = 0 } = req.query;

  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.body, c.description, i.image_url, p.createdAt, p.createdBy,
      p.editedBy, p.editedAt FROM posts p INNER JOIN post_images i ON p.id = i.post_id INNER JOIN 
      categories c ON p.category = c.id WHERE p.category = ${category}  ORDER BY p.createdAt desc LIMIT 10 OFFSET ${page}`
    );

    res.send({
      status: 'OK',
      data: rows,
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It gets a post from the database and returns it to the user */
export const getPost = async (req, res) => {
  const {
    params: { id },
  } = req;

  if (!id) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :Id is required' },
    });
    return;
  }

  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.body, c.description, i.image_url, p.createdAt, p.createdBy,
      p.editedBy, p.editedAt FROM posts p INNER JOIN post_images i ON p.id = i.post_id INNER JOIN 
      categories c ON p.category = c.id WHERE p.id = ${id}`
    );

    if (rows.length <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Post not found' },
      });
      return;
    }

    res.send({
      status: 'OK',
      data: rows[0],
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It takes an image URL and a post ID, and saves the image URL to the database */
async function saveImageURLToDB(imageURL, postId) {
  try {
    await pool.query(
      'INSERT INTO post_images (image_url, post_id) VALUES (?,?)',
      [imageURL, postId]
    );
    return {
      status: 'OK',
    };
  } catch (error) {
    return { status: 'FAILED', data: { error: error?.message || error } };
  }
}

/** It inserts a post into the posts table and if the imageURL is not empty, it will save the imageURL
 * and the postId to the post_images table */
export const addPost = async (req, res) => {
  const { title, body, category, imageURL, createdBy } = req.body;

  //show messages from express validator
  const mistakes = validationResult(req);
  if (!mistakes.isEmpty()) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: mistakes.array() },
    });
    return;
  }

  if (
    checkBadWords(body.toLowerCase()) === true ||
    checkBadWords(title.toLowerCase()) === true
  ) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'It is not allowed to include offensive language!' },
    });
    return;
  }

  try {
    /* Destructuring the rows from the result of the query. */
    const [rows] = await pool.query(
      'INSERT INTO posts (title, body, category, createdBy) VALUES (?,?,?,?)',
      [title, body, category, createdBy]
    );

    /* This is checking if the imageURL is not empty, if it is not empty, it will save the imageURL and
    the postId to the post_images table. */
    if (imageURL !== '') {
      const result = await saveImageURLToDB(imageURL, rows.insertId);
      if (result.status === 'FAILED') {
        throw result.data.error;
      }
    }

    res.send({
      status: 'OK',
      data: 'Post has been created.',
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It updates a post and its image returns The result of the query. */
export const updatePost = async (req, res) => {
  const { title, body, category, editedBy, imageURL } = req.body;
  const { id } = req.params;

  if (!id) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :postId is required' },
    });
    return;
  }

  //show messages from express validator
  const mistakes = validationResult(req);
  if (!mistakes.isEmpty()) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: mistakes.array() },
    });
    return;
  }

  if (
    checkBadWords(body.toLowerCase()) === true ||
    checkBadWords(title.toLowerCase()) === true
  ) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'It is not allowed to include offensive language!' },
    });
    return;
  }

  try {
    const [result] = await pool.query(
      'UPDATE posts p JOIN post_images i ON p.id = i.post_id SET title = ?, body = ?, category = ?, editedBy = ?, image_url = ?',
      [title, body, category, editedBy, imageURL]
    );

    if (result.affectedRows <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Post not found' },
      });
      return;
    }

    const [rows] = await pool.query(
      `SELECT *, image_url FROM posts p INNER JOIN post_images i ON p.id = i.post_id WHERE p.id = ?`,
      [id]
    );

    res.send({
      status: 'OK',
      data: rows[0],
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It deletes a post and its images from the database returns The result of the query. */
export const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).send({
      status: 'FAILED',
      data: { error: 'Not authenticated!' },
    });
    return;
  }

  /* Checking if the token is valid. */
  jwt.verify(token, process.env.JWT_SECRET, (error) => {
    if (error)
      res.status(403).send({
        status: 'FAILED',
        data: { error: 'Token is not valid!' },
      });
    return;
  });

  const { id } = req.params;

  if (!id) {
    res.status(404).send({
      status: 'FAILED',
      data: { error: 'Post not found!' },
    });
    return;
  }

  try {
    const [result] = await pool.query(
      'DELETE i, p FROM post_images i INNER JOIN posts p ON i.post_id = p.id WHERE p.id = ?',
      [id]
    );

    if (result.affectedRows <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Post not found' },
      });
      return;
    }

    res.send({
      status: 'OK',
      data: 'Post has been deleted.',
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};
