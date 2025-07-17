// app/books/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  //fungsi handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingBook
      ? `/api/books/${editingBook.id}` // Jika mengedit, gunakan URL dengan ID
      : '/api/books'; // Jika menambah, gunakan URL biasa

    const method = editingBook ? 'PATCH' : 'POST'; // Sesuaikan metode HTTP

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    });

    // Reset semua state setelah selesai
    setTitle('');
    setAuthor('');
    setEditingBook(null);
    setIsModalOpen(false);
    fetchBooks(); // Ambil ulang data terbaru
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
      fetchBooks();
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book); // Simpan data buku yang akan diedit
    setTitle(book.title); // Isi form dengan judul yang ada
    setAuthor(book.author); // Isi form dengan penulis yang ada
    setIsModalOpen(true); // Buka modal
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Book Tracker</h1>

      {/* KONTEN UTAMA: GRID BUKU DAN KARTU TAMBAH */}
      <div>
        <h2 className="text-3xl font-semibold mb-6">Bookshelf</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
          {/* 1. Mapping untuk menampilkan setiap buku */}
          {books.map((book) => (
            <div key={book.id} className="p-6 bg-white border rounded-lg shadow-sm">
              {/* Tambahkan text-gray-900 di sini */}
              <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
  
              <p className="text-gray-600 mt-1">by {book.author}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => handleEditClick(book)} className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm">Edit</button>
                <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}

          {/* 2. Kartu statis untuk memicu modal "Add Book" */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="p-6 bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            <span className="text-4xl text-gray-400">+</span>
            <p className="mt-2 text-gray-500 font-semibold">Add a New Book</p>
          </div>
        </div>
      </div>

          {/* MODAL UNTUK FORM TAMBAH BUKU */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                  {/* Judul modal dinamis */}
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    {editingBook ? 'Edit Book' : 'Add a New Book'}
                  </h2>
                  {/* ... sisa input form sama ... */}
                  {/* ... */}
                  <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">
                      Cancel
                    </button>
                    {/* Teks tombol dinamis */}
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