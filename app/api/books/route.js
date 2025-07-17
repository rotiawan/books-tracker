// app/api/books/route.js
import { NextResponse } from 'next/server';
import books from '../../../data.js';

export async function GET() {
  return NextResponse.json(books);
}

export async function POST(request) {
  const { title, author } = await request.json();
  const newBook = { id: Date.now(), title, author };
  books.push(newBook);
  return NextResponse.json(newBook, { status: 201 });
}