// components/Login.js
import React, { useState } from 'react';
import { Button,Checkbox,Container, CssBaseline, Paper,TextField, Typography  } from '@mui/material';
import { auth, googleProvider,db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Google } from '@mui/icons-material';
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginWithEmailAndPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during email/password login:', error);
      // Handle login error if needed
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);

      // Redirect to the dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Google login:', error);
      // Handle login error if needed
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/signup');
  };
  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' , minHeight: '100vh', marginTop: 4,marginBottom:4,}}>
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', maxWidth: 400 }}>
        {/* Add your logo here */}
        <img src="/reading.png" alt="Logo" style={{ width: 100, height: 100, marginBottom: 16 }} />

        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Login
        </Typography>
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
        <Checkbox
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          color="primary"
        />
        <Typography>Remember Me</Typography>
        <Button variant="contained" onClick={handleLoginWithEmailAndPassword} fullWidth sx={{ mt: 2 }}>
          
          Login
        </Button>

        <Button
          variant="contained"
          style={{ backgroundColor: '#db4a39', color: 'white' }}
          
          onClick={handleLoginWithGoogle}
          fullWidth
          sx={{ mt: 2 }}
        >
          Login with Google
          <Google fontSize="small" style={{ marginRight: 8 }} />
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Button color="primary" onClick={handleNavigateToSignup}>
            Sign up
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};
  
  export default Login;
  