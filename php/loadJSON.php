<?php
// Assumes that $conn is already defined and connected to the database

$jsonFilePath = '../books.json';

if (file_exists($jsonFilePath)) {
    $json = file_get_contents($jsonFilePath);
    $books = json_decode($json, true)['books'];

    foreach ($books as $book) {
        $readStatus = $book['readStatus'] ? 1 : 0; // Convert to 1 or 0
        $sql = "INSERT INTO Books (title, author, releaseYear, readStatus, collection, image) 
                VALUES (:title, :author, :releaseYear, :readStatus, :collection, :image)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            'title' => $book['title'],
            'author' => $book['author'],
            'releaseYear' => $book['releaseYear'],
            'readStatus' => $readStatus, // Use converted value
            'collection' => $book['collection'],
            'image' => $book['image']
        ]);
    }
    
    echo "Books data loaded successfully<br>";
} else {
    echo "Error: books.json file not found.";
}
?>