import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist folder in production
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory conversation storage (in production, you'd use a database)
const conversations = new Map();

// Function to call Groq API
async function callGroqAPI(messages) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }

  // Format conversation history for the prompt
  const conversationText = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  
  const prompt = `
### STUDENT QUERY:
${conversationText}

### INSTRUCTION:
You are an AI tutor designed to help students understand concepts in a way that mimics a teacher-student interaction in a classroom. 
Your job is to provide explanations, more examples, and encourage critical thinking, rather than giving direct answers. 
Break down complex ideas into simpler parts, ask follow-up questions to gauge understanding, and use analogies when appropriate. 
Provide your response in a friendly and engaging manner, as if you are having a conversation with the student.

### RESPONSE:
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation_history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Add current message to conversation history
    const updatedHistory = [...conversation_history, { role: 'user', content: message }];
    
    // Get AI response
    const aiResponse = await callGroqAPI(updatedHistory);
    
    // Add AI response to conversation history
    updatedHistory.push({ role: 'ai', content: aiResponse });
    
    res.json({
      response: aiResponse,
      conversation_history: updatedHistory
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve the React app for all other routes (in production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Concept Clarifier API ready!`);
});