'use client';

import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import axios from 'axios';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (event) => {

    const { id, value, type, checked } = event.target;
    console.log(id, value, type, checked)
    setFormData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Implement login logic here, using formData.email and formData.password
      const response = await axios.post("http://localhost:5000/login", {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true // Allow session and cookie details
      });

      // Handle successful login
      console.log('Login successful:', response.data);

      // Store login data in session storage if rememberMe is checked
      if (formData.rememberMe) {
        sessionStorage.setItem('loggedIn', 'true');
      }
    } catch (error) {
      // Handle failed login
      console.error('Login failed:', error.response.data);
    }
  };

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
