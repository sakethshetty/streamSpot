'use client';

import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import axios from 'axios';

export function SignupForm() {
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
      console.log('signup successful:', response.data);

      // Store login data in session storage if rememberMe is checked
      if (formData.rememberMe) {
        sessionStorage.setItem('signup', 'true');
      }
    } catch (error) {
      // Handle failed login
      console.error('signup failed:', error.response.data);
    }
  };

   return (
    <form className="flex max-w-md flex-col gap-4 p-4 shadow-md shadow-black rounded">
	  <h1 className="text-xl text-center p-2">Sign In</h1>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your valid email" />
        </div>
        <TextInput id="email1" type="email" placeholder="example@example.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Set password" />
        </div>
        <TextInput id="password1" type="password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit">Submit</Button>
      <h3 className="text-s text-center p-1">already have an account??</h3>
      <a href="/page1">
      <Button outline gradientDuoTone="purpleToBlue">
          Login
      </Button>
      </a>
    </form>
  );
}
