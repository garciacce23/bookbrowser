<?php

// Database connection variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "books";
$socket = "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock";

// Create DSN for PDO
$dsn = "mysql:host=$servername;unix_socket=$socket;dbname=$dbname";

try {
    // Create PDO instance for database connection
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get data from POST request
    $bookId = $_POST['bookId'];
    $title = $_POST['title'];
    $author = $_POST['author'];
    $releaseYear = $_POST['releaseYear'];
    $readStatus = $_POST['readStatus'] === "true" ? 1 : 0;
    $collection = $_POST['collection'];
    $image = $_POST['image'];

    // Prepare and execute SQL query to update book
    $sql = "UPDATE Books SET title = :title, author = :author, releaseYear = :releaseYear, readStatus = :readStatus, collection = :collection, image = :image WHERE book_id = :bookId";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':bookId' => $bookId,
        ':title' => $title,
        ':author' => $author,
        ':releaseYear' => $releaseYear,
        ':readStatus' => $readStatus,
        ':collection' => $collection,
        ':image' => $image
    ]);

    // Check if any rows were affected
    $rowCount = $stmt->rowCount();
    
    if ($rowCount > 0) {
        echo json_encode(['success' => 'Book updated successfully']);
    } else {
        echo json_encode(['error' => 'No book found with the given bookId or no changes made']);
    }
} catch (PDOException $e) {
    // Handle database connection errors
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>