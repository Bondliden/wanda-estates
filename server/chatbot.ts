import { Request, Response } from 'express';
import { fetchProperties } from './resales';

// GLM 4.5 Air API configuration
const TIGLM_API_KEY = process.env.TIGLM_API_KEY || 'de07c61a2bb74684a894eafc1b1b194a.GPlev7pRyuNvvxu4';
const TIGLM_API_URL = process.env.TIGLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4';

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

// System prompt for the Wanda Estates chatbot
const SYSTEM_PROMPT = `Eres Wanda, el asistente virtual experto de Wanda Estates, una selecta agencia inmobiliaria de lujo en Marbella, España.

Tu estilo de comunicación:
- Eres muy amable, servicial y profesional, pero NO empalagoso, ni tampoco usas excesivos formalismos aburridos.
- Tienes un tono seguro, moderno y directo. Ofreces respuestas concisas.
- Muestras siempre un enfoque orientado a presentar opciones exclusivas al cliente y ayudar en su búsqueda.
- Responde principalmente en español, pero cambia a inglés si el usuario lo hace.

Reglas operativas:
- Si el usuario muestra interés en comprar, utiliza las opciones de propiedades disponibles en tu contexto para presentar de 1 a 3 alternativas atractivas e invita a conocerlas mejor.
- Nunca inventes propiedades que no estén en tu lista. Incluye siempre la Referencia (ej. R123) y el Precio en euros.

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

    if (!TIGLM_API_KEY) {
      console.error('TIGLM_API_KEY no está configurada');
      return res.status(500).json({
        error: 'Error de configuración del servidor'
      });
    }

    // Fetch some recent properties to provide context to GLM 4.5
    let livePropertiesContext = "";
    try {
      const liveData = await fetchProperties({ p_PageSize: '15' }); // Get 15 recent properties
      if (liveData && liveData.Property) {
        const props = liveData.Property.slice(0, 15);
        const catalog = props.map((p: any) =>
          `- Ref: ${p.Reference} | ${p.PropertyType?.NameType || 'Propiedad'} en ${p.Location} | Precio: ${new Intl.NumberFormat('de-DE').format(p.Price)}€ | ${p.Beds} hab, ${p.Baths} baños | ${p.BuiltArea}m2`
        ).join("\n");
        livePropertiesContext = `\n\n### CATÁLOGO ACTUAL DE PROPIEDADES EN VENTA:\nAquí tienes algunas propiedades disponibles ahora mismo:\n${catalog}\n[Fin del catálogo] Usa esto para recomendar opciones reales si te preguntan.`;
      }
    } catch (e) {
      console.error("No se pudo obtener el contexto en vivo para el chatbot", e);
    }

    // Build message history
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT + livePropertiesContext },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call tiGLM 4.5 API
    const response = await fetch(`${TIGLM_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TIGLM_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-4-air',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('tiGLM API error:', errorData);
      return res.status(response.status).json({
        error: 'Error al procesar la solicitud'
      });
    }

    const data: ChatResponse = await response.json();

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
