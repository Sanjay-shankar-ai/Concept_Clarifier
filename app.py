from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='dist', template_folder='dist')
CORS(app)

# Initialize ChatGroq with the API key and model
llm = ChatGroq(
    temperature=0, 
    groq_api_key=os.getenv("GROQ_API_KEY"), 
    model_name="llama-3.1-70b-versatile"
)

# Initialize the prompt template
prompt_teacher = PromptTemplate.from_template(
    """
    ### STUDENT QUERY:
    {student_query}
    
    ### INSTRUCTION:
    You are an AI tutor designed to help students understand concepts in a way that mimics a teacher-student interaction in a classroom. 
    Your job is to provide explanations, more examples, and encourage critical thinking, rather than giving direct answers. 
    Break down complex ideas into simpler parts, ask follow-up questions to gauge understanding, and use analogies when appropriate. 
    Provide your response in a friendly and engaging manner, as if you are having a conversation with the student.
    
    ### RESPONSE:
    """
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        conversation_history = data.get('conversation_history', [])
        
        # Add current message to conversation history
        conversation_history.append({"role": "user", "content": user_message})
        
        # Join the conversation history into a single string
        full_conversation = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history])
        
        # Prepare the input for the prompt template
        formatted_prompt = prompt_teacher.format(student_query=full_conversation)
        response = llm.invoke(formatted_prompt)
        
        ai_response = response.content
        
        # Add AI response to conversation history
        conversation_history.append({"role": "ai", "content": ai_response})
        
        return jsonify({
            'response': ai_response,
            'conversation_history': conversation_history
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)