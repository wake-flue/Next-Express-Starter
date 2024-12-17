'use client';

import { useState } from 'react';
import { TodoList } from "@/components/features/TodoList";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-3xl">
        <TodoList />
      </div>
    </main>
  );
}
