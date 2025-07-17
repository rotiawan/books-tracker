// app/books/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Mengambil data buku dari API saat komponen dimuat
  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Menangani submit form (untuk menambah atau mengedit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books';
    const method = editingBook ? 'PATCH' : 'POST';

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    });

    handleCloseModal(); // Menutup modal dan mereset form
    fetchBooks(); // Mengambil ulang data terbaru
  };

  // Menangani klik tombol hapus
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
      fetchBooks();
    }
  };

  // Menyiapkan form untuk mode edit
  const handleEditClick = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsModalOpen(true);
  };

  // Menyiapkan form untuk mode tambah baru
  const handleAddClick = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setIsModalOpen(true);
  };

  // Menutup modal dan mereset state form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    setTitle('');
    setAuthor('');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">My Book Tracker</h1>

     <h2 className="text-3xl font-semibold mb-6 text-gray-200">Bookshelf</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Menampilkan setiap kartu buku */}
        {books.map((book) => (
          <div key={book.id} className="p-6 bg-white border rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
              <p className="text-gray-600 mt-1">by {book.author}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleEditClick(book)} className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm">Edit</button>
              <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}

        {/* Kartu untuk menambah buku baru */}
        <div
          onClick={handleAddClick}
          className="p-6 bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors"
        >
          <span className="text-4xl text-gray-400">+</span>
          <p className="mt-2 text-gray-500 font-semibold">Add a New Book</p>
        </div>
      </div>

      {/* MODAL (Hanya ditampilkan jika isModalOpen bernilai true) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                {editingBook ? 'Edit Book' : 'Add a New Book'}
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md"
                />
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600">
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}