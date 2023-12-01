<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $jsonString = file_get_contents('php://input');
    $data = json_decode($jsonString, true);

    // Save data to books.json
    file_put_contents('path/to/books.json', json_encode($data, JSON_PRETTY_PRINT));
    echo "Books updated successfully";
} else {
    echo "Invalid request";
}
?>