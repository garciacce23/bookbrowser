export default class Book {
    constructor(title, author, releaseYear, readStatus, collection, image) {
        this.title = title;
        this.author = author;
        this.releaseYear = releaseYear;
        this.readStatus = readStatus;
        this.collection = collection;
        this.image = image;
    }
}

// Not used
let books = [
    new Book("Mistborn: The Final Empire", "Brandon Sanderson", 2006, false, "Mistborn Era 1", "image/finalEmpire.png"),
    new Book("The Well of Ascension", "Brandon Sanderson", 2007, false, "Mistborn Era 1", "path/to/image2.jpg"),
    new Book("The Hero of Ages", "Brandon Sanderson", 2008, false, "Mistborn Era 1", "path/to/image3.jpg"),
    new Book("The Alloy of Law", "Brandon Sanderson", 2011, false, "Mistborn Era 2", "path/to/image4.jpg"),
    new Book("Shadows of Self", "Brandon Sanderson", 2015, false, "Mistborn Era 2", "path/to/image5.jpg"),
    new Book("The Bands of Mourning", "Brandon Sanderson", 2016, false, "Mistborn Era 2", "path/to/image6.jpg"),
    new Book("The Way of Kings", "Brandon Sanderson", 2010, false, "The Stormlight Archive", "path/to/image7.jpg"),
    new Book("Words of Radiance", "Brandon Sanderson", 2014, false, "The Stormlight Archive", "path/to/image8.jpg"),
    new Book("Oathbringer", "Brandon Sanderson", 2017, false, "The Stormlight Archive", "path/to/image9.jpg"),
    new Book("The Eye of the World", "Robert Jordan", 1990, false, "The Wheel of Time", "path/to/image10.jpg"),
];