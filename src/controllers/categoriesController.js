import { pool } from '../database/index.js';
import { validationResult } from 'express-validator';

/** It gets the categories from the database and sends them to the client */
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, description FROM categories ORDER BY createdAt desc'
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

/** It gets a category from the database and returns it to the user */
export const getCategory = async (req, res) => {
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
      `SELECT id, description FROM categories WHERE id = ?`,
      [id]
    );

    if (rows.length <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Category not found' },
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

/** It inserts a category into the categories table */
export const addCategory = async (req, res) => {
  const { description } = req.body;

  //show messages from express validator
  const mistakes = validationResult(req);
  if (!mistakes.isEmpty()) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: mistakes.array() },
    });
    return;
  }

  try {
    /* Destructuring the rows from the result of the query. */
    const [rows] = await pool.query(
      'INSERT INTO categories (description) VALUES (?)',
      [description]
    );

    res.send({
      status: 'OK',
      data: 'Category has been created.',
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It updates a category in the categories table */
export const updateCategory = async (req, res) => {
  const { description } = req.body;
  const { id } = req.params;

  if (!id) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :id is required' },
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

  try {
    const [result] = await pool.query(
      'UPDATE categories SET description = ? WHERE id = ?',
      [description, id]
    );

    if (result.affectedRows <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Category not found' },
      });
      return;
    }

    const [rows] = await pool.query(
      `SELECT id, description  FROM categories  WHERE id = ?`,
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

/** It deletes a category from the categories table */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).send({
      status: 'FAILED',
      data: { error: 'Parameter :id is required' },
    });
    return;
  }

  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [
      id,
    ]);

    if (result.affectedRows <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Category not found' },
      });
      return;
    }

    res.send({
      status: 'OK',
      data: 'Category has been deleted.',
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};
