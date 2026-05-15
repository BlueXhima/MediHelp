// src/data/intentData.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchResponse(text) {
  try {
    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Please enter a symptom or question');
    }

    console.log('Sending request to:', `${API_URL}/parse-intent`);
    console.log('With text:', text);

    const res = await fetch(`${API_URL}/parse-intent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() })
    });
    
    console.log('Response status:', res.status);
    
    // Get response data even if error
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      throw new Error('Server returned invalid response');
    }
    
    console.log('Response data:', data);
    
    // Handle HTTP errors
    if (!res.ok) {
      const errorMessage = data.details || data.error || `Server error: ${res.status}`;
      console.error('Server error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Validate response data
    if (!data || !data.text) {
      console.error('Invalid response structure:', data);
      throw new Error('Server returned empty response');
    }
    
    return {
      text: data.text,
      link: data.link || null
    };
    
  } catch (error) {
    console.error('fetchResponse error:', error);
    
    // Return user-friendly error that shows in chat
    return {
      text: `**Explanation**\nI encountered an error while processing your request.\n\n**Error Details**\n${error.message}\n\n**Suggested Action**\nPlease try again. If the problem continues, contact support.\n\n**Disclaimer:** Educational information only. Consult a doctor for personal advice.`,
      link: null,
      isError: true
    };
  }
}