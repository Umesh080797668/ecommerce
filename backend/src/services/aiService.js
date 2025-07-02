/**
 * AI Service
 * Handles AI-powered features like content moderation, semantic search, and analysis
 */

const OpenAI = require('openai');
const sentiment = require('sentiment');

// Initialize OpenAI (in production, use environment variable)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Sentiment analyzer
const sentimentAnalyzer = new sentiment();

/**
 * Moderate content using AI
 */
async function moderateContent(content) {
    try {
        // Basic sentiment analysis
        const sentimentResult = sentimentAnalyzer.analyze(content);
        const sentimentScore = (sentimentResult.score + 5) / 10; // Normalize to 0-1
        
        // Simple toxicity detection (in production, use OpenAI Moderation API)
        const toxicityScore = await detectToxicity(content);
        
        return {
            sentiment: Math.max(0, Math.min(1, sentimentScore)),
            toxicity: toxicityScore,
            isApproved: toxicityScore < 0.3,
            confidence: 0.85
        };
    } catch (error) {
        console.error('Error in content moderation:', error);
        // Fallback to manual moderation
        return {
            sentiment: 0.5,
            toxicity: 0.1,
            isApproved: false,
            confidence: 0.0,
            requiresManualReview: true
        };
    }
}

/**
 * Detect toxicity in content
 */
async function detectToxicity(content) {
    // Simple keyword-based detection (in production, use ML model)
    const toxicKeywords = [
        'spam', 'scam', 'fake', 'clickbait', 'hate', 'toxic',
        'abuse', 'harass', 'troll', 'stupid', 'idiot', 'dumb'
    ];
    
    const lowercaseContent = content.toLowerCase();
    let toxicityScore = 0;
    
    toxicKeywords.forEach(keyword => {
        if (lowercaseContent.includes(keyword)) {
            toxicityScore += 0.2;
        }
    });
    
    // Check for excessive caps
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.5) {
        toxicityScore += 0.1;
    }
    
    return Math.min(1, toxicityScore);
}

/**
 * Perform semantic search using AI
 */
async function performSemanticSearch(query, filters = {}) {
    try {
        // Mock blog posts database
        const mockPosts = [
            {
                id: 1,
                title: "The AI Revolution: How Machine Learning is Transforming Industries",
                content: "Artificial Intelligence and Machine Learning are reshaping business...",
                category: "technology",
                tags: ["AI", "Machine Learning", "Technology"],
                publishedAt: "2024-12-28",
                author: "John Doe"
            },
            {
                id: 2,
                title: "Future of Web Development: Trends to Watch in 2025",
                content: "Web development technologies and frameworks evolution...",
                category: "programming",
                tags: ["Web Development", "React", "JavaScript"],
                publishedAt: "2024-12-27",
                author: "Jane Smith"
            },
            {
                id: 3,
                title: "Design Thinking: Creating User-Centered Experiences",
                content: "Design thinking principles and user experience design...",
                category: "design",
                tags: ["Design", "UX", "User Experience"],
                publishedAt: "2024-12-26",
                author: "Mike Johnson"
            }
        ];
        
        // Simple semantic search (in production, use vector embeddings)
        const results = mockPosts.filter(post => {
            const searchableText = `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
            const queryWords = query.toLowerCase().split(' ');
            
            return queryWords.some(word => searchableText.includes(word));
        });
        
        // Apply filters
        let filteredResults = results;
        
        if (filters.category && filters.category !== 'all') {
            filteredResults = filteredResults.filter(post => post.category === filters.category);
        }
        
        if (filters.author) {
            filteredResults = filteredResults.filter(post => 
                post.author.toLowerCase().includes(filters.author.toLowerCase())
            );
        }
        
        // Calculate relevance scores
        const scoredResults = filteredResults.map(post => {
            let relevanceScore = 0;
            const queryWords = query.toLowerCase().split(' ');
            
            queryWords.forEach(word => {
                if (post.title.toLowerCase().includes(word)) relevanceScore += 3;
                if (post.content.toLowerCase().includes(word)) relevanceScore += 1;
                if (post.tags.some(tag => tag.toLowerCase().includes(word))) relevanceScore += 2;
            });
            
            return {
                ...post,
                relevanceScore,
                snippet: generateSnippet(post.content, query)
            };
        });
        
        // Sort by relevance
        scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        return {
            query,
            totalResults: scoredResults.length,
            results: scoredResults.slice(0, 10), // Limit to 10 results
            suggestions: generateSearchSuggestions(query),
            processingTime: Math.random() * 200 + 50 // Mock processing time
        };
        
    } catch (error) {
        console.error('Error in semantic search:', error);
        throw new Error('Search service temporarily unavailable');
    }
}

/**
 * Generate content snippet with highlighted query terms
 */
function generateSnippet(content, query) {
    const queryWords = query.toLowerCase().split(' ');
    const sentences = content.split('. ');
    
    // Find sentence containing query words
    const relevantSentence = sentences.find(sentence => 
        queryWords.some(word => sentence.toLowerCase().includes(word))
    );
    
    if (relevantSentence) {
        let snippet = relevantSentence;
        
        // Highlight query words
        queryWords.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');
        });
        
        return snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet;
    }
    
    return content.substring(0, 150) + '...';
}

/**
 * Generate search suggestions
 */
function generateSearchSuggestions(query) {
    const suggestions = [
        'AI and machine learning',
        'Web development trends',
        'Design thinking process',
        'JavaScript frameworks',
        'User experience design',
        'Technology innovation',
        'Software development',
        'Digital transformation'
    ];
    
    // Filter suggestions based on query
    return suggestions.filter(suggestion => 
        !suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

/**
 * Analyze content for SEO optimization
 */
async function analyzeSEOContent(content, title) {
    try {
        const analysis = {
            readabilityScore: calculateReadabilityScore(content),
            sentimentScore: sentimentAnalyzer.analyze(content).score,
            wordCount: content.split(' ').length,
            keywordDensity: calculateKeywordDensity(content),
            suggestions: []
        };
        
        // Generate SEO suggestions
        if (analysis.wordCount < 300) {
            analysis.suggestions.push('Consider adding more content. Articles with 300+ words tend to rank better.');
        }
        
        if (analysis.readabilityScore < 60) {
            analysis.suggestions.push('Try using shorter sentences and simpler words to improve readability.');
        }
        
        if (!title || title.length < 30) {
            analysis.suggestions.push('Consider a longer, more descriptive title (30-60 characters).');
        }
        
        return analysis;
        
    } catch (error) {
        console.error('Error in SEO analysis:', error);
        return {
            readabilityScore: 70,
            sentimentScore: 0,
            wordCount: 0,
            suggestions: ['Analysis temporarily unavailable']
        };
    }
}

/**
 * Calculate readability score (simplified Flesch Reading Ease)
 */
function calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.split(/\s+/).length;
    const syllables = countSyllables(text);
    
    if (sentences === 0 || words === 0) return 0;
    
    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, score));
}

/**
 * Count syllables in text (simplified)
 */
function countSyllables(text) {
    return text.toLowerCase()
        .replace(/[^a-z]/g, '')
        .replace(/e$/, '')
        .replace(/[aeiouy]{2,}/g, 'a')
        .match(/[aeiouy]/g)?.length || 1;
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(content) {
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = {};
    
    words.forEach(word => {
        word = word.replace(/[^a-z]/g, '');
        if (word.length > 3) { // Ignore short words
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });
    
    const totalWords = words.length;
    const densities = {};
    
    Object.entries(wordCount).forEach(([word, count]) => {
        densities[word] = ((count / totalWords) * 100).toFixed(2);
    });
    
    // Return top 10 keywords
    return Object.entries(densities)
        .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a))
        .slice(0, 10)
        .reduce((obj, [word, density]) => {
            obj[word] = parseFloat(density);
            return obj;
        }, {});
}

/**
 * Generate content suggestions using AI
 */
async function generateContentSuggestions(topic, contentType = 'blog_post') {
    try {
        // Mock suggestions (in production, use OpenAI API)
        const suggestions = {
            titles: [
                `The Complete Guide to ${topic}`,
                `${topic}: Best Practices and Tips`,
                `Understanding ${topic}: A Beginner's Guide`,
                `Advanced ${topic} Techniques`,
                `${topic} Trends and Future Predictions`
            ],
            tags: [
                topic.toLowerCase(),
                'tutorial',
                'guide',
                'tips',
                'best practices'
            ],
            outline: [
                'Introduction',
                `What is ${topic}?`,
                'Key Benefits',
                'Implementation Guide',
                'Common Challenges',
                'Best Practices',
                'Future Outlook',
                'Conclusion'
            ]
        };
        
        return suggestions;
        
    } catch (error) {
        console.error('Error generating content suggestions:', error);
        return {
            titles: [`Guide to ${topic}`],
            tags: [topic.toLowerCase()],
            outline: ['Introduction', 'Main Content', 'Conclusion']
        };
    }
}

/**
 * Auto-generate excerpt from content
 */
function generateExcerpt(content, maxLength = 160) {
    // Remove HTML tags
    const cleanContent = content.replace(/<[^>]*>/g, '');
    
    // Get first paragraph or first few sentences
    const paragraphs = cleanContent.split('\n\n');
    let excerpt = paragraphs[0];
    
    if (excerpt.length > maxLength) {
        const sentences = excerpt.split('. ');
        excerpt = sentences[0];
        
        if (excerpt.length > maxLength) {
            excerpt = excerpt.substring(0, maxLength - 3) + '...';
        } else {
            excerpt += '.';
        }
    }
    
    return excerpt;
}

module.exports = {
    moderateContent,
    performSemanticSearch,
    analyzeSEOContent,
    generateContentSuggestions,
    generateExcerpt,
    detectToxicity
};