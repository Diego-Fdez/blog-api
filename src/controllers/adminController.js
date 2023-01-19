import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { pool } from '../database/index.js';

dotenv.config();

//register a new admin
export const registerUser = async (req, res) => {
  const { userName, email } = req.body;

  //show messages from express validator
  const mistakes = validationResult(req);
  if (!mistakes.isEmpty()) {
    return res.status(400).json({ error: mistakes.array() });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;

  try {
    await pool.query(
      'INSERT INTO admins (userName, email, password) VALUES (?,?,?)',
      [userName, email, hashedPass]
    );

    res.send({
      status: 'OK',
      data: `User has been registered successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** It gets the users from the database and sends them to the client */
export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, email, userName FROM admins`);

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

/** It gets a user from the database and returns it to the user */
export const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, userName, email FROM admins WHERE id = ${id}`
    );

    if (rows.length <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'User not found' },
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

/**if the user exists, it checks if the password is correct, if the password is correct, it generates a
 * token and sends it back to the user */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check the user
    const [rows] = await pool.query(
      `SELECT * FROM admins WHERE email = '${email}'`
    );

    if (rows.length <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'User not found' },
      });
      return;
    }
    console.log(req.body.password);
    //Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      rows[0].password
    );

    if (!isPasswordCorrect) {
      res.status(400).send({
        status: 'FAILED',
        data: { error: 'Wrong email or password!' },
      });
      return;
    }

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET);
    const { password, createdAt, role, ...other } = rows[0];
    console.log(token);
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .send({
        status: 'OK',
        data: other,
      });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It clears the cookie and sends a response to the client */
export const logout = (req, res) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .send({
      status: 'OK',
      data: 'User has been logged out.',
    });
};
