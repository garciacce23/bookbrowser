<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "books";
$socket = "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock";

$dsn = "mysql:host=$servername;unix_socket=$socket";

try {
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the database exists
    $stmt = $conn->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$dbname'");
    
    if ((int) $stmt->fetchColumn() === 0) {
        // Create database
        $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
        $conn->exec($sql);
        echo "Database created successfully<br>";

        // Select database
        $conn->exec("USE $dbname");

        // Create table for books
        $sql = "CREATE TABLE IF NOT EXISTS Books (
                    book_id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    author VARCHAR(255) NOT NULL,
                    releaseYear INT,
                    readStatus BOOLEAN,
                    collection VARCHAR(255),
                    image VARCHAR(255)
                )";
        $conn->exec($sql);
        echo "Table Books created successfully<br>";

        // Call the script to load books from JSON
        include 'loadJSON.php';

        $response["message"] = "Database setup complete.";
        echo json_encode($response);
    } else {
        echo "Database already exists<br>";
    }
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}

echo "Books data inserted successfully"; // Plain text response

$conn = null;
?>
