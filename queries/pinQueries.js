const pinTableCreate =
  "CREATE TABLE IF NOT EXISTS pins (id INT AUTO_INCREMENT, name VARCHAR(255), about VARCHAR(300), date DATE, PRIMARY KEY (id))";

const insertPin = "INSERT INTO pins (name,about,date) VALUES (?,?,?)";

const pinSearchAll = "SELECT * FROM pins";

const pinSearchParam = "SELECT * FROM pins WHERE name LIKE ?";

module.exports = { pinTableCreate, insertPin, pinSearchAll, pinSearchParam };
