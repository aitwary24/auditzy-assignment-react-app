// components/Signup.js
import React, { useState } from 'react';
import { Button, Checkbox, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      await db.collection('users').doc(user.uid).set({
        displayName,
        email,
        // Add other user data if needed
      });

      // Redirect to the dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during signup:', error);
      // Handle signup error if needed
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', width: '100vh' }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Sign Up
        </Typography>
        <TextField
          label="Display Name"
          fullWidth
          margin="normal"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleSignUp} fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button color="primary" onClick={() => navigate('/')}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
