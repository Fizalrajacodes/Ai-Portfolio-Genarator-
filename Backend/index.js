import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



// Store conversation history (in production, use a database)
const conversationHistory = new Map();

// System prompt for the AI
const SYSTEM_PROMPT = `You are a professional portfolio generation assistant. Your role is to help users create, optimize, and enhance their professional portfolios.

Key responsibilities:
1. Help users identify and showcase their skills effectively
2. Assist with project descriptions and presentation
3. Provide portfolio structure and design recommendations
4. Offer advice on content organization
5. Generate HTML/CSS code snippets when requested
6. Suggest improvements for existing portfolios

Always be:
- Professional and helpful
- Specific and actionable
- Encouraging and supportive
- Focused on portfolio optimization

When generating code, ensure it's:
- Modern and responsive
- Well-commented
- Accessible
- SEO-friendly

Remember to ask clarifying questions when needed to provide the best assistance.`;

// Test API key endpoint
app.post('/api/test-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        
        if (!apiKey) {
            return res.json({
                success: false,
                message: 'API key is required'
            });
        }

        // Test the API key by making a simple request
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Simple test prompt
        const result = await model.generateContent("Hello");
        await result.response;
        
        res.json({
            success: true,
            message: 'API key is valid'
        });
    } catch (error) {
        console.error('API key test error:', error);
        res.json({
            success: false,
            message: 'Invalid API key or API service unavailable'
        });
    }
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, apiKey, chatHistory = [] } = req.body;
        
        if (!apiKey) {
            return res.json({
                success: false,
                message: 'API key is required'
            });
        }

        if (!message) {
            return res.json({
                success: false,
                message: 'Message is required'
            });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        // Build conversation context
        let conversationContext = SYSTEM_PROMPT + "\n\nCurrent conversation:\n";
        
        // Add recent chat history for context
        chatHistory.slice(-6).forEach(chat => {
            const role = chat.role === 'user' ? 'User' : 'Assistant';
            conversationContext += `${role}: ${chat.content}\n`;
        });
        
        // Add current message
        conversationContext += `User: ${message}\nAssistant: `;

        // Generate response
        const result = await model.generateContent(conversationContext);
        const response = await result.response;
        const text = response.text();

        // Clean up the response
        const cleanedResponse = text.replace(/Assistant:\s*/g, '').trim();

        res.json({
            success: true,
            data: {
                response: cleanedResponse,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Chat endpoint error:', error);
        
        // Handle specific Gemini API errors
        let errorMessage = 'Failed to get response from AI service';
        
        if (error.message.includes('API_KEY_INVALID')) {
            errorMessage = 'Invalid API key. Please check your Gemini API key.';
        } else if (error.message.includes('quota')) {
            errorMessage = 'API quota exceeded. Please check your Gemini API usage limits.';
        } else if (error.message.includes('rate_limit')) {
            errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes('503') || error.message.includes('500')) {
            errorMessage = 'AI service temporarily unavailable. Please try again later.';
        }
        
        res.json({
            success: false,
            message: errorMessage
        });
    }
});

// Portfolio generation endpoint
app.post('/api/generate-portfolio', async (req, res) => {
    try {
        const { apiKey, requirements, style = 'modern' } = req.body;
        
        if (!apiKey) {
            return res.json({
                success: false,
                message: 'API key is required'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
Create a complete HTML portfolio website based on these requirements:
${requirements}

Style: ${style}
Requirements:
- Responsive design
- Modern layout
- Professional appearance
- Include sections for: Header, About, Skills, Projects, Contact
- Use semantic HTML5
- Include CSS in <style> tags
- Make it visually appealing

Generate complete HTML code with embedded CSS:
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const htmlCode = response.text();

        // Extract just the HTML code if AI includes explanations
        const htmlMatch = htmlCode.match(/```html\n([\s\S]*?)\n```/) || 
                         htmlCode.match(/<(!DOCTYPE|html)[\s\S]*<\/html>/i);
        
        const finalHTML = htmlMatch ? htmlMatch[1] || htmlMatch[0] : htmlCode;

        res.json({
            success: true,
            data: {
                html: finalHTML,
                style: style,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Portfolio generation error:', error);
        res.json({
            success: false,
            message: 'Failed to generate portfolio'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio Generator API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Generator Backend running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});