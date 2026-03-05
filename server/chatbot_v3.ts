import { Request, Response } from 'express';
import { fetchProperties } from './resales';

// GLM 4.5 Air API configuration
const TIGLM_API_KEY = 'de07c61a2bb74684a894eafc1b1b194a.GPlev7pRyuNvvxu4';
const TIGLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

interface ChatResponse {
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

const SYSTEM_PROMPT = `Eres Wanda, el asistente virtual experto de Wanda Estates, una selecta agencia inmobiliaria de lujo en Marbella, España.

Tu estilo de comunicación:
- Eres muy amable, servicial y profesional, pero NO empalagoso.
- Tienes un tono seguro, moderno y directo. Ofreces respuestas concisas.
- Responde principalmente en español.

Información de contacto:
- Email: info@wandaestates.com
- Teléfono: +34 952 000 000
- Dirección: El Rodeo Alto Nº4, Nueva Andalucía, 29660 Marbella, Málaga, Spain`;

export async function handleChatMessageV3(req: Request, res: Response) {
  try {
    console.log('[CHATBOT] Step 1: Parsing body');
    const { message, conversationHistory = [] }: ChatRequest = req.body;
    console.log('[CHATBOT] Step 2: Message check');


    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    let livePropertiesContext = "";
    try {
      const liveData = await fetchProperties({ p_PageSize: '10' });
      if (liveData && liveData.Property) {
        const props = Array.isArray(liveData.Property) ? liveData.Property : [liveData.Property];
        const catalog = props.slice(0, 10).map((p: any) =>
          `- Ref: ${p.Reference} | ${p.PropertyType?.NameType || 'Propiedad'} en ${p.Location} | Precio: ${p.Price}€`
        ).join("\n");
        livePropertiesContext = `\n\n### CATALOGO ACTUAL:\n${catalog}`;
      }
    } catch (e) {
      console.error("Context error", e);
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT + livePropertiesContext },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch(`${TIGLM_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TIGLM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4-air',
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Zhipu Error:', errorData);
      return res.status(response.status).json({ error: 'Error API Zhipu' });
    }

    const data: ChatResponse = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Error de respuesta';

    return res.json({
      response: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ]
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export function setupChatbotRoutes(app: any) {
  app.post('/api/chat', handleChatMessageV3);
}
