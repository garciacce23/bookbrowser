<?php

// Database connection variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "books";
$socket = "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock";

// Include database name in the DSN
$dsn = "mysql:host=$servername;unix_socket=$socket;dbname=$dbname";

try {
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get data from POST request
    $title = $_POST['title'];
    $author = $_POST['author'];
    $releaseYear = $_POST['releaseYear'];
    $readStatus = $_POST['readStatus'] === "true" ? 1 : 0; // Convert to boolean
    $collection = $_POST['collection'];
    $image = $_POST['image'];

    // Define SQL query for insertion
    $sql = "INSERT INTO Books (title, author, releaseYear, readStatus, collection, image) 
            VALUES (:title, :author, :releaseYear, :readStatus, :collection, :image)";

    // Prepare and execute SQL query
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':title' => $title,
        ':author' => $author,
        ':releaseYear' => $releaseYear,
        ':readStatus' => $readStatus,
        ':collection' => $collection,
        ':image' => $image
    ]);

    // Check if insertion succeeded
    $rowCount = $stmt->rowCount();

    if ($rowCount > 0) {
        $newBookId = $conn->lastInsertId(); // Get the last inserted ID
        echo json_encode(['success' => 'Book inserted successfully', 'newBookId' => $newBookId]);
    } else {
        echo json_encode(['error' => 'Failed to insert book']);
    }
} catch (PDOException $e) {
    // Handle database connection errors
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>