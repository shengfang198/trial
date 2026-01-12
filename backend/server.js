/* eslint-env node */
/* global process */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());

// API routes
app.get('/', (req, res) => {
  res.send('Hello World from backend!');
});

// Test Supabase connection
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) throw error;
    res.json({ message: 'Supabase connected', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribe endpoint
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }]);
    if (error) throw error;
    res.json({ message: 'Subscribed successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from the React app build directory
app.use(express.static('public'));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
