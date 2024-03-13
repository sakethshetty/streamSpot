'use client';

import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

export function LoginForm() {
  return (
    <form className="flex max-w-md flex-col gap-4 p-4 shadow-md shadow-black rounded">
	  <h1 className="text-xl text-center p-2">Login Here</h1>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Your password" />
        </div>
        <TextInput id="password1" type="password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}

