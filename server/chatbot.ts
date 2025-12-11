import { Request, Response } from 'express';

// Perplexity API configuration
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompt for the Wanda Estates chatbot
const SYSTEM_PROMPT = `Eres un asistente virtual experto de Wanda Estates, una prestigiosa agencia inmobiliaria de lujo en Marbella, España.

Tu rol es:
- Proporcionar información profesional y detallada sobre propiedades de lujo en la Costa del Sol
- Ayudar a los clientes con consultas sobre apartamentos, villas y propiedades exclusivas
- Ofrecer información sobre ubicaciones premium como Nueva Andalucía, Puerto Banús, Sierra Blanca, y otras zonas exclusivas
- Responder preguntas sobre servicios inmobiliarios, proceso de compra, y asesoramiento
- Mantener un tono profesional, cordial y personalizado
- Responder principalmente en español, pero puedes cambiar a inglés si el cliente lo prefiere

Información de contacto de Wanda Estates:
- Email: info@wandaestates.com
- Teléfono: +34 952 000 000
- Dirección: El Rodeo Alto Nº4, Nueva Andalucía, 29660 Marbella, Málaga, Spain
- Horario: Lunes a Viernes 9:00-18:00, Sábado con cita previa, Domingo cerrado
- Web: www.wandaestates.com

Siempre invita a los clientes a contactar directamente o visitar la oficina para una atención personalizada.`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        error: 'El mensaje no puede estar vacío'
      });
    }

    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY no está configurada');
      return res.status(500).json({
        error: 'Error de configuración del servidor'
      });
    }

    // Build message history
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call Perplexity API
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', errorData);
      return res.status(response.status).json({
        error: 'Error al procesar la solicitud'
      });
    }

    const data: PerplexityResponse = await response.json();
    
    const assistantMessage = data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

    return res.json({
      response: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ]
    });

  } catch (error) {
    console.error('Error in chatbot handler:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

export function setupChatbotRoutes(app: any) {
  app.post('/api/chat', handleChatMessage);
}
