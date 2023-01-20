const nameQuery = (name) => {
  return `SELECT * FROM users WHERE name="${name}"`;
};

const createTable = (tableName) => {
  return `CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT,
        name VARCHAR(255), 
        PRIMARY KEY (id)
    ) `;
};

const insertUser = (userName) => {
  return `INSERT INTO users (name) VALUES ("${userName}")`;
};

module.exports = { nameQuery, createTable, insertUser };
