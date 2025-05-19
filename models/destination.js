const pool = require('../config/database');

class Destination {
  static async findAll(searchTerm) {
    const result = await pool.query(
      'SELECT * FROM destinations WHERE category ILIKE $1 OR name ILIKE $1 OR description ILIKE $1 OR detailed_description ILIKE $1',
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  static async create(name, description, detailed_description, imageUrl, category, timezone, activities, latitude, longitude) {
    const result = await pool.query(
      'INSERT INTO destinations (name, description, detailed_description, image_url, category, timezone, activities, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, detailed_description || null, imageUrl, category, timezone || null, activities ? activities.split(',').map(item => item.trim()) : [], parseFloat(latitude), parseFloat(longitude)]
    );
    return result.rows[0];
  }
}

module.exports = Destination;