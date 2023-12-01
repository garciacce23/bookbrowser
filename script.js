document.addEventListener('DOMContentLoaded', (event) => {
    let currentIndex = 0;
    let books = [];

    // Book class definition
    class Book {
        constructor(id, title, author, releaseYear, readStatus, collection, image) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.releaseYear = releaseYear;
            this.readStatus = readStatus;
            this.collection = collection;
            this.image = image;
        }
    }
    

    // fetch('books.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         books = data.books.map(book => new Book(book.title, book.author, book.releaseYear, book.readStatus, book.collection, book.image));
    //         displayBook(currentIndex);
    //     })
    //     .catch(error => console.error('Error:', error));

    let currentBookId = null;

    function fetchBooks(callback = () => {}, maintainOrder = false) {
        fetch('php/fetchBooks.php')
        .then(response => response.json())
        .then(data => {
            if (!maintainOrder) {
                // Sort or rearrange books here if necessary
                books = data.map(book => new Book(book.book_id, book.title, book.author, book.releaseYear, book.readStatus, book.collection, book.image));
            } else {
                // Update books array without changing order
                books = books.map(book => {
                    const updatedBook = data.find(b => b.book_id === book.id);
                    return updatedBook ? new Book(updatedBook.book_id, updatedBook.title, updatedBook.author, updatedBook.releaseYear, updatedBook.readStatus, updatedBook.collection, updatedBook.image) : book;
                });
            }
            callback(); // Execute callback after books have been updated
        })
        .catch(error => console.error('Error fetching books:', error));
    }
    
    

    function displayBook(index) {
        let book = books[index];
        currentBookId = book.id;
        let bookDisplay = document.getElementById('bookDisplay');
        let readStatusDropdown = document.getElementById('readStatus');
    
        // Update book display
        bookDisplay.innerHTML = `
            <h2>${book.title}</h2>
            <p>Author: ${book.author}</p>
            <p>Release Year: ${book.releaseYear}</p>
            <p>Collection: ${book.collection}</p>
            <p>Read: ${book.readStatus ? 'Yes' : 'No'}</p>
            <img src="${book.image}" alt="${book.title}" class="book-image" />
            <p>Book ${index + 1} of ${books.length}</p>
        `;
    
        // Prefill form
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('releaseYear').value = book.releaseYear;
        readStatusDropdown.value = book.readStatus ? "true" : "false"; // Set value of readStatus dropdown
        document.getElementById('collection').value = book.collection;
        document.getElementById('image').value = book.image;
    
        // Optionally, disable form fields if needed
        // setFormFieldsEditable(false);
    }
    

    // Function to fetch books and update the UI
    // function fetchBooks() {
    //     fetch('php/fetchBooks.php')
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             books = data.map(book => new Book(book.book_id, book.title, book.author, book.releaseYear, book.readStatus, book.collection, book.image));
    //             currentIndex = 0; // Reset to first book
    //             displayBook(currentIndex);
    //         })
    //         .catch(error => console.error('Error fetching books:', error));
    // }


    function getCurrentBookId() {
        return currentBookId;
    }
    

    function clearForm() {
        // Clear all  input fields in the form
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('releaseYear').value = '';
        document.getElementById('readStatus').value = 'false'; // Assuming 'false' as the default value
        document.getElementById('collection').value = '';
        document.getElementById('image').value = '';
    
        // Optionally, reset the current book ID if you're tracking it
        currentBookId = null;
    }
    

    function saveBook() {
        let bookId = getCurrentBookId();
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let releaseYear = document.getElementById('releaseYear').value;
        let readStatus = document.getElementById('readStatus').value === "true";
        let collection = document.getElementById('collection').value;
        let image = document.getElementById('image').value;
    
        fetch('php/updateBook.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'bookId': bookId,
                'title': title,
                'author': author,
                'releaseYear': releaseYear,
                'readStatus': readStatus,
                'collection': collection,
                'image': image
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.success);
            // Refresh book display / UI as needed, maintaining current order
            fetchBooks(() => displayBook(currentIndex), true);
        });
    }
    
    
    function insertBook() {
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let releaseYear = document.getElementById('releaseYear').value;
        let readStatus = document.getElementById('readStatus').value === "true";
        let collection = document.getElementById('collection').value;
        let image = document.getElementById('image').value;
    
        fetch('php/insertBook.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'title': title,
                'author': author,
                'releaseYear': releaseYear,
                'readStatus': readStatus,
                'collection': collection,
                'image': image
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.success);
                // Fetch and display new book
                fetchBooks(() => displayNewBook(data.newBookId));
            }
        });
    }
    
    function displayNewBook(newBookId) {
        const newBookIndex = books.findIndex(book => book.id.toString() === newBookId.toString());
        if (newBookIndex >= 0) {
            currentIndex = newBookIndex;
            displayBook(currentIndex);
        } else {
            console.error("Newly inserted book not found");
        }
    }


    function deleteBook() {
        let bookId = getCurrentBookId();
    
        fetch('php/deleteBook.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ 'bookId': bookId })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.success);
            // Update UI and remove book from list
            fetchBooks(() => displayBook(0)); // Assuming this will refresh the book list
        });
    }
    

    fetch('php/fetchBooks.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        books = data.map(book => new Book(book.title, book.author, book.releaseYear, book.readStatus, book.collection, book.image));
        displayBook(currentIndex);
    })
    .catch(error => console.error('Error fetching books:', error));


    // Use fetchBooks with a callback to display the first book
    fetchBooks(() => displayBook(currentIndex));
    

    document.getElementById('setupDbButton').addEventListener('click', function() {
        fetch('php/database-setup.php')
            .then(response => response.text()) // Expecting text, not JSON
            .then(data => {
                console.log(data); // Log full response for debugging
                // Check content of response for success
                if (data.includes("Books data inserted successfully")) {
                    alert("Database setup and data load completed successfully.");
                    // Re-fetch books here to update UI without reloading the page
                    fetchBooks();
                } else {
                    // Handle any other response
                    alert("There might have been an issue setting up the database. Please check the console for more information.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error setting up the database.");
            });
    });

    setFormFieldsEditable(false);

    

    document.getElementById('defaultOrderButton').addEventListener('click', function() {
        fetchBooks(() => {
            currentIndex = 0;
            displayBook(currentIndex); // Display first book after fetching
        });
    });
    
    
    
    

    document.getElementById('sortButton').addEventListener('click', function() {
        books.sort((a, b) => a.releaseYear - b.releaseYear);
        currentIndex = 0;
        displayBook(currentIndex);
    });    


    let isEditable = false;

    document.getElementById('toggleEditButton').addEventListener('click', function() {
        isEditable = !isEditable;
        setFormFieldsEditable(isEditable);
    });
    

    document.getElementById('imageUploadForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
    
        var formData = new FormData(this);
        fetch('php/uploadFile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Assuming response contains the file name or path
            var uploadedImagePath = 'images/' + extractFileNameFromResponse(data); // Implement this function
            document.getElementById('image').value = uploadedImagePath;
        })
        .catch(error => console.error('Error uploading image:', error));
    });
    

    document.getElementById('firstButton').addEventListener('click', function() {
        currentIndex = 0;
        displayBook(currentIndex);
    });
    

    document.getElementById('nextButton').addEventListener('click', function() {
        if (currentIndex < books.length - 1) {
            currentIndex++;
            displayBook(currentIndex);
        }
    });

    document.getElementById('prevButton').addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            displayBook(currentIndex);
        }
    });

    document.getElementById('lastButton').addEventListener('click', function() {
        currentIndex = books.length - 1;
        displayBook(currentIndex);
    });
    

    document.getElementById('saveButton').addEventListener('click', saveBook);
    document.getElementById('insertButton').addEventListener('click', insertBook);
    document.getElementById('deleteButton').addEventListener('click', deleteBook);

    
});

function setFormFieldsEditable(isEditable) {
    document.getElementById('title').disabled = !isEditable;
    document.getElementById('author').disabled = !isEditable;
    document.getElementById('releaseYear').disabled = !isEditable;
    document.getElementById('readStatus').disabled = !isEditable;
    document.getElementById('collection').disabled = !isEditable;
    document.getElementById('image').disabled = !isEditable;
}