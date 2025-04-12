# services/ai_chat.py

import asyncio
import logging
from typing import Optional, List
from .knowledge_base import KnowledgeBase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIChatService:
    def __init__(self):
        self.knowledge_base = KnowledgeBase()
        
        # Define welcome message and greetings
        self.welcome_message = (
            "Hello! I'm your Financial Advisor AI. I can help you with:\n\n"
            "• Explaining financial terms and concepts\n"
            "• Answering questions about investments\n"
            "• Providing information about market trends\n"
            "• Helping with portfolio management\n\n"
            "Feel free to ask me anything about finance and investments!"
        )
        
        self.greetings = [
            'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
            'greetings', 'howdy', 'sup', 'what\'s up', 'hi there', 'hello there'
        ]
        
    def is_greeting(self, message: str) -> bool:
        """Check if the message is a greeting."""
        return any(greeting in message.lower() for greeting in self.greetings)
        
    def generate_follow_up_questions(self, term: str, definition: str) -> List[str]:
        """Generate follow-up questions based on the term and its definition."""
        questions = []
        
        # Extract key concepts from the definition
        key_concepts = [
            "types", "benefits", "risks", "how to", "strategies", 
            "performance", "analysis", "comparison", "evaluation"
        ]
        
        # Generate questions based on the term and key concepts
        for concept in key_concepts:
            if concept in definition.lower():
                if concept == "types":
                    questions.append(f"What are the different types of {term}s?")
                elif concept == "benefits":
                    questions.append(f"What are the benefits of investing in {term}s?")
                elif concept == "risks":
                    questions.append(f"What are the risks associated with {term}s?")
                elif concept == "how to":
                    questions.append(f"How do I start investing in {term}s?")
                elif concept == "strategies":
                    questions.append(f"What are some effective {term} investment strategies?")
                elif concept == "performance":
                    questions.append(f"How do I evaluate {term} performance?")
                elif concept == "analysis":
                    questions.append(f"How do I analyze {term}s?")
                elif concept == "comparison":
                    questions.append(f"How do {term}s compare to other investment options?")
                elif concept == "evaluation":
                    questions.append(f"How do I evaluate a good {term} investment?")
        
        # Add some general follow-up questions
        general_questions = [
            f"How do {term}s fit into a diversified portfolio?",
            f"What factors should I consider when choosing {term}s?",
            f"How do {term}s perform in different market conditions?"
        ]
        
        # Combine and limit to 3 most relevant questions
        all_questions = questions + general_questions
        return all_questions[:3]
        
    async def get_response(self, message: str) -> str:
        try:
            # Add a small delay to make the interaction feel more natural
            await asyncio.sleep(1.5)
            
            # Check if it's a greeting
            if self.is_greeting(message):
                logger.info("Detected greeting message")
                return self.welcome_message
            
            # Clean and normalize the message
            clean_message = message.lower().strip()
            
            # Check the knowledge base
            logger.info(f"Checking knowledge base for: {clean_message}")
            knowledge_response = self.knowledge_base.get_definition(clean_message)
            
            if knowledge_response:
                logger.info("Found response in knowledge base")
                # Find the matching term
                matching_term = None
                for term, data in self.knowledge_base.definitions.items():
                    if clean_message in data['keywords']:
                        matching_term = term
                        break
                
                # Generate and add follow-up questions
                if matching_term:
                    follow_ups = self.generate_follow_up_questions(matching_term, knowledge_response)
                    if follow_ups:
                        knowledge_response += "\n\nWould you like to know more about:\n\n" + "\n".join(f"• {q}" for q in follow_ups)
                
                return knowledge_response
            
            # If not found in knowledge base, try to find similar terms
            similar_terms = []
            for term, data in self.knowledge_base.definitions.items():
                if any(keyword in clean_message for keyword in data['keywords']):
                    similar_terms.append(term)
            
            if similar_terms:
                logger.info(f"Found similar terms: {similar_terms}")
                response = "I'm not sure about your exact question, but here are some related topics I can help with:\n\n"
                for term in similar_terms[:3]:  # Show top 3 similar terms
                    response += f"• {term.capitalize()}\n"
                response += "\nWould you like to know more about any of these topics?"
                return response
            
            # If no similar terms found, return a helpful message
            return (
                "I'm sorry, but I don't have specific information about that topic. "
                "I can help you with financial terms and concepts like:\n\n"
                "• Stocks and bonds\n"
                "• Mutual funds and ETFs\n"
                "• Investment strategies\n"
                "• Market trends\n"
                "• Portfolio management\n\n"
                "Please try asking about one of these topics or check the welcome message "
                "for more information about what I can help with."
            )
            
        except Exception as e:
            logger.error(f"Error in get_response: {str(e)}", exc_info=True)
            return "I apologize, but I encountered an error. Please try again."
