import React, { useState, useRef, useEffect } from 'react';
import { 
  Container,
  TextField,
  IconButton,
  Button,
  Avatar,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box
} from '@material-ui/core';
import axios from 'axios';
import { Send, SmartToy } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { CHATBOT_URL } from '../config';
const useStyles = makeStyles((theme) => ({
  container: {
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderRadius: '18px 18px 4px 18px',
  },
  botMessage: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    backgroundColor: theme.palette.grey[100],
    borderRadius: '18px 18px 18px 4px',
  },
  inputContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const FusionChatbot = () => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now(),
      content: input,
      role: 'user',
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      // Real API call
      const response = await axios.post(
        `${CHATBOT_URL}webhooks/rest/webhook`,
        {
          sender: "user",
          message: input
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle API response
      if (response.data && response.data.length > 0) {
        const botMessage = {
          id: Date.now() + 1,
          content: response.data[0].text,
          role: 'assistant',
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const mockApiCall = (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a mock response to: "${query}". The actual implementation would connect to your chatbot API.`);
      }, 1500);
    });
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.chatContainer}>
        <List className={classes.messageList}>
          {messages.map((message) => (
            <ListItem 
              key={message.id}
              className={message.role === 'user' ? classes.userMessage : classes.botMessage}
            >
              {/* {message.role === 'assistant' && (
                <ListItemAvatar>
                  <Avatar>
                    <SmartToy />
                  </Avatar>
                </ListItemAvatar>
              )} */}
              <ListItemText 
                primary={message.content} 
                primaryTypographyProps={{
                  style: { whiteSpace: 'pre-wrap' }
                }}
              />
              {/* {message.role === 'user' && (
                <ListItemAvatar>
                  <Avatar src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
              )} */}
            </ListItem>
          ))}
          {loading && (
            <ListItem className={classes.botMessage}>
              {/* <ListItemAvatar>
                <Avatar>
                  <SmartToy />
                </Avatar>
              </ListItemAvatar> */}
              <div className={classes.loadingContainer}>
                <CircularProgress size={20} />
                <Typography variant="body2">Thinking...</Typography>
              </div>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box component="form" onSubmit={handleSubmit} className={classes.inputContainer}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          multiline
          maxRows={4}
        />
        <IconButton 
          color="primary" 
          type="submit"
          disabled={!input.trim() || loading}
        >
          <Send />
        </IconButton>
        {/* <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Next: Add Size Measurements
                </Button> */}
      </Box>
    </Container>
  );
};

export default FusionChatbot;