const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class GeminiPortfolioHelper {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
        this.model = null;
        this.initializeModel();
    }

    initializeModel() {
        try {
            this.model = this.genAI.getGenerativeModel({ 
                model: "gemini-pro",
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            });
            console.log('✅ Gemini model initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Gemini model:', error.message);
        }
    }

    async generateResponse(prompt) {
        if (!this.model) {
            throw new Error('Gemini model not initialized. Check your API key.');
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyB_9_INbBT8efoN7I1gRiHdV9IHoDCLldU') {
            return this.getFallbackResponse(prompt);
        }

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('❌ Gemini API Error:', error);
            
            if (error.message.includes('API_KEY')) {
                throw new Error('Invalid or missing Gemini API key. Please check your .env file');
            } else if (error.message.includes('quota')) {
                throw new Error('API quota exceeded. Please check your Gemini API usage.');
            } else {
                return this.getFallbackResponse(prompt);
            }
        }
    }

    getFallbackResponse(prompt) {
        console.log('⚠️  Using fallback response (no Gemini API key)');
        
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes('skill')) {
            return `## Web Developer Skills

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- React, Vue.js, or Angular
- Responsive Design, CSS Frameworks (Bootstrap, Tailwind)
- Version Control (Git)

**Backend:**
- Node.js, Express.js
- Python, Django, or Flask
- Databases (MySQL, MongoDB, PostgreSQL)
- RESTful APIs

**Tools:**
- VS Code, Webpack, Docker
- AWS, Netlify, Vercel
- Postman, Chrome DevTools

*Note: Gemini API key not configured. Set GEMINI_API_KEY in .env file for AI-powered responses.*`;
        }
        else if (lowerPrompt.includes('project')) {
            return `## Portfolio Project Ideas

1. **Personal Portfolio Website**
   - Technologies: HTML, CSS, JavaScript, React
   - Features: Responsive design, project gallery, contact form

2. **Task Management App**
   - Technologies: React, Node.js, MongoDB
   - Features: CRUD operations, user authentication, real-time updates

3. **E-commerce Website**
   - Technologies: MERN Stack (MongoDB, Express, React, Node.js)
   - Features: Shopping cart, payment integration, admin panel

*Configure your Gemini API key for personalized project suggestions.*`;
        }
        else if (lowerPrompt.includes('html') || lowerPrompt.includes('portfolio')) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        /* Add your custom styles here */
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to My Portfolio</h1>
        <p>Add your Gemini API key to generate AI-powered portfolio code.</p>
    </div>
</body>
</html>`;
        }
        else {
            return `I'd be happy to help you with your portfolio! I can assist with:

• **Skills** - Technical and soft skills for web developers
• **Projects** - Portfolio project ideas and implementation
• **HTML Generation** - Complete portfolio website code

To get AI-powered responses, please add your Gemini API key to the .env file.

What would you like to work on today?`;
        }
    }

    async generatePortfolioResponse(userMessage) {
        const portfolioContext = `You are an AI Portfolio Generator assistant. Help users with:
- Portfolio website development
- Skills and technologies for web developers
- Project ideas and implementation
- HTML, CSS, JavaScript code generation
- Career advice for developers

Be practical, provide code examples when needed, and focus on modern web development practices.`;

        const prompt = `${portfolioContext}

User Question: ${userMessage}

Please provide a helpful, detailed response focused on portfolio development:`;

        return await this.generateResponse(prompt);
    }
}

// Create singleton instance
const geminiHelper = new GeminiPortfolioHelper();

// Export functions
module.exports = {
    generatePortfolioResponse: (message) => geminiHelper.generatePortfolioResponse(message),
    geminiHelper
};