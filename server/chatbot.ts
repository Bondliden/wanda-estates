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

const SYSTEM_PROMPT = `Eres Wanda, la asistente virtual de Wanda Estates, una inmobiliaria boutique de ultra-lujo en la Costa del Sol.
- Estilo: Muy amable, sofisticada, profesional y servicial. Haz que el cliente se sienta en buenas manos.
- Objetivo: Ayudar a encontrar las mejores oportunidades inmobiliarias ("Value for Money").
- Prioridad: Sugiere SIEMPRE propiedades dentro del municipio que el usuario mencione o pregunte.
- Idioma: Responde siempre en el idioma del usuario.`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // Intentar detectar municipio en el mensaje del usuario
    const locations = ["Marbella", "Benahavís", "Estepona", "Sotogrande", "Casares", "Mijas", "Fuengirola", "Benalmádena"];
    const detectedLocation = locations.find(loc => message.toLowerCase().includes(loc.toLowerCase()));

    let livePropertiesContext = "";
    try {
      // Configurar búsqueda inteligente
      const searchParams: any = {
        p_PageSize: '40',
        p_PropertyTypes: 'Villa,Apartment,Penthouse,Townhouse',
      };

      if (detectedLocation) {
        searchParams.p_location = detectedLocation;
      }

      const liveData = await fetchProperties(searchParams);

      if (liveData && liveData.data && liveData.data.Property) {
        let props = Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property];

        // Filtrar no-viviendas
        props = props.filter((p: any) => {
          const type = (p.TypeName || "").toLowerCase();
          return !type.includes("parking") && !type.includes("garaje") && !type.includes("trastero") && !type.includes("parcela") && !type.includes("plot");
        });

        // Lógica "Value for Money": Ordenar por precio/m2 (menor es mejor valor)
        const valueSorted = [...props].sort((a: any, b: any) => {
          const ratioA = (a.Price || 0) / (a.BuiltArea || 1);
          const ratioB = (b.Price || 0) / (b.BuiltArea || 1);
          return ratioA - ratioB;
        });

        const catalog = valueSorted.slice(0, 8).map((p: any) =>
          `- Ref: ${p.Reference} | ${p.TypeName || 'Propiedad'} en ${p.Location} | ${p.Beds} dorm | ${p.BuiltArea}m2 | Precio: ${p.Price.toLocaleString()}€ (Excelente relación calidad-precio)`
        ).join("\n");

        livePropertiesContext = `\n\n### MEJORES OPORTUNIDADES ACTUALES${detectedLocation ? ` EN ${detectedLocation.toUpperCase()}` : ''}:\n${catalog}\n\nREGLA: Si el usuario pidió un sitio concreto (${detectedLocation || 'la zona'}), céntrate en estos resultados. Presenta las opciones con entusiasmo resaltando por qué son "Value for Money".`;
      }
    } catch (e) {
      console.log("[CHATBOT] No se pudo cargar el contexto dinámico");
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
    // Probamos modelos disponibles
    const modelOptions = ['glm-4.5-air', 'glm-4-air', 'glm-4'];

    let lastError = 'No se pudo conectar con el servicio de IA de Wanda';

    for (const url of endpoints) {
      for (const modelName of modelOptions) {
        try {
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
              temperature: 0.5
            })
          });

          if (response.ok) {
            const data: ChatResponse = await response.json();
            const assistantMessage = data.choices[0]?.message?.content;
            if (assistantMessage) {
              return res.json({
                response: assistantMessage,
                conversationHistory: [
                  ...conversationHistory,
                  { role: 'user', content: message },
                  { role: 'assistant', content: assistantMessage }
                ]
              });
            }
          }
        } catch (innerError) {
          // Seguir intentando
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
