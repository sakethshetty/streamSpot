'use client';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';

export default function NavbarComponent() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white mr-10">Streamspot</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
      <Dropdown label="Home" inline>
      <Dropdown.Item>Trending</Dropdown.Item>
      <Dropdown.Item>Subscribed</Dropdown.Item>
    </Dropdown>
      <Dropdown label="Create" inline>
      <Dropdown.Item>Upload</Dropdown.Item>
      <Dropdown.Item>live steam</Dropdown.Item>
    </Dropdown>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">User</span>
            <span className="block truncate text-sm font-medium">example@example.com</span>
          </Dropdown.Header>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        
      
        <Navbar.Toggle />
      </div>
    
    </Navbar>
  );
}

