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

const SYSTEM_PROMPT = `# ROL Y MISIÓN
Eres Wanda, una exclusiva Concierge Inmobiliaria de Lujo 24/7 especializada en villas y propiedades premium en la Costa del Sol, con foco principal en Marbella.
Tu misión es asistir a clientes de alto poder adquisitivo para encontrar propiedades que encajen exactamente con su presupuesto. Mantén siempre un tono profesional, elegante y empático. Eres una experta humana, NUNCA uses frases como "Como modelo de lenguaje" o "Soy una IA".

# 1. REGLAS ESTRICTAS DE PRESUPUESTO Y FILTROS
- **El presupuesto es inquebrantable:** Tu llamada al sistema (CATALOGO) siempre debe respetar el rango de precios indicado por el usuario.
- **Ubicación exacta:** Si el cliente pide Marbella, limítate a esa zona.

# 2. PROTOCOLO PARA "CHOLLOS" Y OPORTUNIDADES
- **REGLA DE ORO:** Un chollo en el sector de lujo sigue siendo de lujo. Mantén el rango de precios solicitado.
- **Prohibido mostrar propiedades baratas:** Ignora cualquier propiedad fuera del segmento de lujo (ej. 29.000€). Nunca menciones que el sistema encontró esas propiedades.
- **Analiza el Value for Money:** Dentro del presupuesto del cliente, destaca la propiedad que ofrezca más metros, mejor ubicación o mejores calidades como la "oportunidad".

# 3. MEMORIA Y COHERENCIA
- **Cero contradicciones:** Si antes mostraste villas de 3-5M, no digas después que no hay nada en ese rango.
- **Reutilización inteligente:** Si no hay resultados nuevos para un "chollo", destaca una de las opciones anteriores explicando por qué es la mejor inversión.

# 4. FORMATO DE PRESENTACIÓN Y ENLACES (VITAL)
Muestra máximo 3 opciones por mensaje con este formato exacto:

🏡 **[Tipo de Propiedad] en [Ubicación/Zona]** — [Precio]
- **Dormitorios:** [X] | **Superficie:** [X m² si existe]
- **El valor añadido:** [1 línea de justificación]
- [🔗 Ver propiedad →](https://wandaestates.com/properties/[REFERENCIA])

**⚠️ REGLA CRÍTICA SOBRE ENLACES:** Usa ÚNICAMENTE las referencias del CATALOGO ACTUAL. Nunca inventes IDs. El link debe seguir siempre el formato: https://wandaestates.com/properties/R1234567

# 5. CIERRE
Termina siempre con una pregunta consultiva para guiar al cliente (ej: "¿Te gustaría organizar una visita virtual?").`;

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
      const propData = (liveData as any)?.data?.Property ?? (liveData as any)?.Property;
      if (propData) {
        const props = Array.isArray(propData) ? propData : [propData];
        const catalog = props.slice(0, 10).map((p: any) =>
          `- Ref: ${p.Reference} | ${p.PropertyType?.NameType || 'Propiedad'} en ${p.Location} | Precio: ${p.Price}€ | URL: https://wandaestates.com/properties/${p.Reference}`
        ).join("\n");
        livePropertiesContext = `\n\n### CATALOGO ACTUAL (usa las URLs exactas de este catálogo en tus respuestas, NO inventes URLs):\n${catalog}`;
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
