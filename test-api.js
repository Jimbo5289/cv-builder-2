// Simple script to test the API registration endpoint
import fetch from 'node-fetch';

async function testRegistration() {
  const testUser = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'JohnSmith123!',
    marketingOptIn: true
  };

  console.log('Testing registration endpoint...');
  console.log('User data:', testUser);

  try {
    const response = await fetch('http://localhost:3005/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing registration:', error.message);
  }
}

testRegistration(); 