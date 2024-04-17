// Assuming you have Node.js installed and can use require to include built-in modules

// Include the HTTP module from Node.js to create a server
const http = require('http');

// Define the server and request handling
const server = http.createServer((req, res) => {
  if (req.url === '/api/signup' && req.method === 'POST') {
    console.log('got the req')
    let body = '';
I 
    // Collect data sent in the POST request
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // When all data chunks have been received
    req.on('end', () => {
      // Parse the body data as JSON
      const userData = JSON.parse(body);

      // Perform your logic here, e.g., save the user to a database

      // Send a response to the client
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User signed up successfully!' }));
    });
  } else {
    // Handle any other URL or method
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
