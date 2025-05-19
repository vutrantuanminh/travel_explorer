const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seedDatabase() {
  try {
    const dataPath = path.join(__dirname, 'data/travel_recommendation_api.json');
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);

    for (const beach of data.beaches) {
      await pool.query(
        'INSERT INTO destinations (name, description, image_url, category, timezone) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [beach.name, beach.description, `/images/${beach.imageUrl}`, 'beaches', beach.timezone]
      );
      console.log(`Đã nhập bãi biển: ${beach.name}`);
    }

    for (const temple of data.temples) {
      await pool.query(
        'INSERT INTO destinations (name, description, image_url, category, timezone) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [temple.name, temple.description, `/images/${temple.imageUrl}`, 'temples', temple.timezone]
      );
      console.log(`Đã nhập đền: ${temple.name}`);
    }

    for (const country of data.countries) {
      for (const city of country.cities) {
        await pool.query(
          'INSERT INTO destinations (name, description, image_url, category, timezone) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
          [city.name, city.description, `/images/${city.imageUrl}`, 'cities', city.timezone]
        );
        console.log(`Đã nhập thành phố: ${city.name}`);
      }
    }

    console.log('Nhập dữ liệu thành công!');
  } catch (error) {
    console.error('Lỗi khi nhập dữ liệu:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();