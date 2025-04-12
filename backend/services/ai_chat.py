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
        self.conversation_history = {}  # Store conversation history
        
        # Define welcome message and greetings
        self.welcome_message = (
            "Hello! I'm your Financial Advisor AI. I can help you with:\n\n"
            "• Stocks\n"
            "• Bonds\n"
            "• Mutual funds\n"
            "• ETFs\n"
            "Please try asking about one of these topics or check the welcome message "
        )
        
        self.greetings = [
            'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
            'greetings', 'howdy', 'sup', 'what\'s up', 'hi there', 'hello there'
        ]
        
    def is_greeting(self, message: str) -> bool:
        """Check if the message is a greeting."""
        return any(greeting in message.lower() for greeting in self.greetings)
        
    def generate_follow_up_questions(self, term: str) -> List[str]:
        """Generate relevant follow-up questions based on the current term."""
        # Get the definition to find related terms
        definition = self.knowledge_base.get_definition(term)
        if not definition:
            return []

        # Extract potential terms from the definition
        related_terms = []
        for key in self.knowledge_base.definitions.keys():
            if key.lower() != term.lower() and key.lower() in definition.lower():
                # Check if the related term has actual content
                related_content = self.knowledge_base.get_definition(key)
                if related_content:
                    related_terms.append(key)

        # Generate questions only for terms that exist in our knowledge base
        questions = []
        for related_term in related_terms:
            questions.append(related_term)

        return questions[:3]  # Return at most 3 follow-up questions
        
    async def get_response(self, message: str, conversation_id: str = None) -> str:
        try:
            # Add a small delay to make the interaction feel more natural
            await asyncio.sleep(1.5)
            
            # Initialize conversation history if new conversation
            if not conversation_id:
                conversation_id = str(len(self.conversation_history))
                self.conversation_history[conversation_id] = []
            
            # Store the user's message
            self.conversation_history[conversation_id].append({
                'role': 'user',
                'content': message
            })
            
            # Check if it's a greeting
            if self.is_greeting(message):
                logger.info("Detected greeting message")
                response = self.welcome_message
            else:
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
                    
                    # Generate and add follow-up questions only if we have answers
                    if matching_term:
                        follow_ups = self.generate_follow_up_questions(matching_term)
                        if follow_ups:
                            response = knowledge_response + "\n\nWould you like to know more about:\n\n" + "\n".join(f"• {q}" for q in follow_ups)
                        else:
                            response = knowledge_response
                    else:
                        response = knowledge_response
                else:
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
                    else:
                        response = (
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
            
            # Store the assistant's response
            self.conversation_history[conversation_id].append({
                'role': 'assistant',
                'content': response
            })
            
            return response, conversation_id
            
        except Exception as e:
            logger.error(f"Error in get_response: {str(e)}", exc_info=True)
            return "I apologize, but I encountered an error. Please try again.", conversation_id
