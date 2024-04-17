'use client'
import React from 'react';
import { Avatar, Card } from 'flowbite-react';
// import { useSearchParams } from 'react-router-dom';

export function Account() {
  // const [searchParams] = useSearchParams();
  const name =  "username";
  const email =  "email";

  return (
    <Card className="flex flex-col items-center justify-center px-4 py-8 shadow-md rounded-lg bg-gray-50 dark:bg-gray-800">
      <Avatar src="https://i.pravatar.cc/150?u=johndoe" size="xl" className="mb-4" />
      <p className="text-gray-600 text-center dark:text-gray-400">{name}</p>
      <p className="text-gray-600 text-center dark:text-gray-400">{email}</p>
    </Card>
  );
}
