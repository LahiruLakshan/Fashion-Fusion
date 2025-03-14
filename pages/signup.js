import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  makeStyles
} from '@material-ui/core';
import Link from 'next/link';
import { BACKEND_URL } from '../config';
import { useRouter } from 'next/router';  

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    padding: theme.spacing(4),
    maxWidth: 400,
  },
  form: {
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#3f51b5',
    color: 'white',
  },
  title: {
    marginBottom: theme.spacing(2),
  }
}));

export default function Signup() {
  const classes = useStyles();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'USER',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
        username:formData.username,
        email:formData.email,
        password:formData.password
    }
    try {
      const response = await axios.post(`${BACKEND_URL}api/auth/signup/`, data);
      console.log(response.data);
      alert('Registration successful! Please login.');
      router.push('/');
      localStorage.setItem('authData', JSON.stringify(data));
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.root} elevation={3}>
        <Typography component="h1" variant="h5" className={classes.title} align="center">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}