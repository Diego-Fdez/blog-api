import { pool } from '../database/index.js';
import jwt from 'jsonwebtoken';

export const getPosts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM posts');

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

export const getPost = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :Id is required' },
    });
    return;
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ?`, [id]);

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

export const addPost = async (req, res) => {
  const { title, body, category, createdDate, createdBy } = req.body;

  try {
    const [rows] = await pool.query(
      'INSERT INTO posts (title, body, category, createdDate, createdBy) VALUES (?,?,?,?,?)',
      [title, body, category, createdDate, createdBy]
    );
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

export const updatePost = (req, res) => {
  const { title, body, category, editedBy, editedDate } = req.body;
  const postId = req.params.id;

  if (!postId) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :postId is required' },
    });
    return;
  }

  try {
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

export const deletePost = (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :postId is required' },
    });
    return;
  }

  try {
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};
