// using built-in fetch

async function testLogin() {
    try {
        console.log('Testing username login...');

        // Try to login with one of the migrated users
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'alice_mentor', // One of the demo users
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('SUCCESS: Login with username worked!');
            console.log('User:', data.name, data.role);
        } else {
            console.log('FAILED: Login failed.');
            console.log('Status:', response.status);
            console.log('Message:', data.message);

            // If it failed with "Invalid credentials", it might be because the server
            // is still expecting email (old code).
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
