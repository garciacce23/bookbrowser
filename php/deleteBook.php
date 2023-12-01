<?php

// Database connection variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "books";
$socket = "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock";

// Create DSN PDO
$dsn = "mysql:host=$servername;unix_socket=$socket;dbname=$dbname";

try {
    // Create PDO instance for database connection
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get bookId from POST request
    $bookId = $_POST['bookId'];

    // Prepare and execute SQL query to delete book
    $sql = "DELETE FROM Books WHERE book_id = :bookId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':bookId', $bookId, PDO::PARAM_INT);
    $stmt->execute();

    // Check if any rows were affected
    $rowCount = $stmt->rowCount();
    
    if ($rowCount > 0) {
        echo json_encode(['success' => 'Book deleted successfully']);
    } else {
        echo json_encode(['error' => 'No book found with the given bookId']);
    }
} catch (PDOException $e) {
    // Handle database connection errors
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>
