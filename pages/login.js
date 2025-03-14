import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  makeStyles,
} from "@material-ui/core";
import Link from "next/link";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/router"; // Add this import

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
    backgroundColor: "#3f51b5",
    color: "white",
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

export default function Login() {
  const router = useRouter();

  const classes = useStyles();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}api/auth/login/`,
        credentials
      );
      localStorage.setItem('authData', JSON.stringify(credentials));
      console.log(response.data);
      // Store token and handle redirection
      alert("Login successful!");
      router.push('/');
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.root} elevation={3}>
        <Typography
          component="h1"
          variant="h5"
          className={classes.title}
          align="center"
        >
          Login
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
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
