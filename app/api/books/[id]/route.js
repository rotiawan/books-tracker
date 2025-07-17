// app/api/books/[id]/route.js
import { NextResponse } from 'next/server';
import books from '../../../../data.js';

export async function PATCH(request, { params }) {
  const { id } = params;
  const { title, author } = await request.json();
  const bookIndex = books.findIndex((b) => b.id === parseInt(id));
  if (bookIndex === -1) return NextResponse.json({ message: 'Book not found' }, { status: 404 });
  if (title) books[bookIndex].title = title;
  if (author) books[bookIndex].author = author;
  return NextResponse.json(books[bookIndex]);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const newBooks = books.filter((b) => b.id !== parseInt(id));
  books.length = 0;
  books.push(...newBooks);
  return NextResponse.json({ message: 'Book deleted' });
}