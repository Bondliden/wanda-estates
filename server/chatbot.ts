import { Request, Response } from 'express';
import { fetchProperties } from './resales';

// GLM 4.5 Air API configuration (Z.ai - Official from screenshot)
const TIGLM_API_KEY = 'de07c61a2bb74684a894eafc1b1b194a.GPlev7pRyuNvvxu4';
const TIGLM_API_URL = 'https://api.z.ai/api/coding/paas/v4';
const TIGLM_MODEL = 'glm-4.5-air';

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

const SYSTEM_PROMPT = `Eres Wanda, la asistente virtual de Wanda Estates, inmobiliaria de lujo en Marbella.
- Estilo: Amable, profesional y directa. NO empalagosa.
- Objetivo: Ayudar a encontrar propiedades y dar información sobre la zona.
- Idioma: Responde siempre en el idioma del usuario (principalmente español).`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    let livePropertiesContext = "";
    try {
      const liveData = await fetchProperties({ p_PageSize: '10' });
      if (liveData && liveData.data && liveData.data.Property) {
        const props = Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property];
        const catalog = props.slice(0, 10).map((p: any) =>
          `- Ref: ${p.Reference} | ${p.TypeName || 'Propiedad'} en ${p.Location} | Precio: ${p.Price}€`
        ).join("\n");
        livePropertiesContext = `\n\n### CATALOGO ACTUAL:\n${catalog}`;
      }
    } catch (e) {
      console.log("[CHATBOT] No se pudo cargar el contexto de propiedades (límite de IP o API)");
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT + livePropertiesContext },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Intentar varios modelos y endpoints según la documentación de Z.ai
    const endpoints = [
      'https://api.z.ai/api/coding/paas/v4',
      'https://api.z.ai/api/paas/v4',
      'https://open.bigmodel.cn/api/paas/v4'
    ];
    // Probamos tanto el nombre sugerido por el usuario como el que sale en el código de ejemplo de Z.ai
    const modelOptions = ['glm-4.5-air', 'glm-4.5', 'glm-4-air', 'glm-4'];

    let lastError = 'No se pudo conectar con el servicio de IA de Wanda';

    for (const url of endpoints) {
      for (const modelName of modelOptions) {
        try {
          console.log(`[CHATBOT] Probando modelo ${modelName} en ${url}...`);
          const response = await fetch(`${url}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TIGLM_API_KEY.trim()}`,
              'Accept-Language': 'en-US,en'
            },
            body: JSON.stringify({
              model: modelName,
              messages: messages,
              temperature: 0.7
            })
          });

          if (response.ok) {
            const data: ChatResponse = await response.json();
            const assistantMessage = data.choices[0]?.message?.content;
            if (assistantMessage) {
              console.log(`[CHATBOT] ¡ÉXITO! Conectado con ${modelName} en ${url}`);
              return res.json({
                response: assistantMessage,
                conversationHistory: [
                  ...conversationHistory,
                  { role: 'user', content: message },
                  { role: 'assistant', content: assistantMessage }
                ]
              });
            }
          } else {
            const errBody = await response.text();
            console.log(`[CHATBOT] Reclamo de ${modelName}: ${errBody.substring(0, 100)}`);
          }
        } catch (innerError) {
          // Error de red, pasamos al siguiente endpoint
        }
      }
    }

    return res.status(500).json({ error: lastError });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Error interno en el asistente de Wanda' });
  }
}

export function setupChatbotRoutes(app: any) {
  app.post('/api/chat', handleChatMessage);
}
