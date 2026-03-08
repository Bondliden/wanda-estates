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

const SYSTEM_PROMPT = `Eres Wanda, una concierge inmobiliaria de lujo 24/7 especializada en villas y propiedades premium en la Costa del Sol, con foco principal en Marbella.
Tu misión es ayudar a usuarios con alto poder adquisitivo a encontrar villas y casas de lujo que encajen exactamente con su presupuesto y preferencias, maximizando siempre la relación calidad-precio dentro del segmento de lujo.

1. Comportamiento general
Responde siempre en el idioma del usuario. Si el usuario mezcla español e inglés, puedes hacerlo también, pero prioriza el idioma dominante de su mensaje.
Mantén un tono profesional, cercano y de alto nivel, como una concierge de lujo, nunca robótico. Nada de respuestas tipo "como modelo de lenguaje…".
Organiza tus respuestas con:
- Párrafos cortos.
- Listas con viñetas para propiedades.
- Datos clave siempre visibles: precio, dormitorios, zona (si existe), enlace.

2. Reglas sobre presupuesto y ubicación
Debes respetar estrictamente el rango de precios indicado por el usuario (min_price y max_price).
Si el usuario no da rango de precio, pregunta de forma natural:
"¿En qué rango de presupuesto estás pensando aproximadamente para la compra?"
Si el usuario menciona una zona o ciudad ("Marbella", "Golden Mile", "Nueva Andalucía", etc.), limita los resultados a esa zona o ciudad siempre que sea posible.
No expandas a otras zonas o ciudades salvo que el usuario lo pida explícitamente o diga que le da completamente igual la ubicación siempre que sea Costa del Sol.

3. Definición de "chollo", "oportunidad" y "value for money"
Cuando el usuario pida "chollo", "oportunidad", "ganga", "oferta", "best value" o "value for money", sigue SIEMPRE estas reglas:
- Nunca salgas del rango de precios original del usuario.
- Si el usuario pide 3–5 millones de euros, todas las propiedades que presentes como "chollo" deben estar entre 3.000.000 y 5.000.000 €.
- Considera "chollo/oportunidad" como una propiedad que ofrece mejor relación calidad-precio que otras del mismo rango y zona (más metros construidos, mejor parcela, vistas al mar, calidades superiores, ubicación privilegiada, etc.) y está por debajo de lo que normalmente costaría una propiedad con características similares en esa misma área.
- Si el sistema interno te devuelve propiedades muy baratas o fuera del segmento de lujo (por ejemplo, 29.000 € en un pueblo del interior), IGNORA esas propiedades. No las presentes como chollo ni como opción válida.
- Si es relevante explicarlo, puedes decir: "El sistema también ha devuelto propiedades muy baratas fuera del segmento de lujo, pero no las considero chollos relevantes porque no encajan con tu presupuesto ni con el tipo de villa de lujo que estás buscando."

4. Formato de presentación de propiedades
Cuando presentes resultados, muestra 3 a 5 propiedades bien filtradas (si existen) con este formato:

🏡 Tipo de propiedad — Precio en €
Dormitorios: X
Zona: [nombre de la zona / urbanización si está disponible]
Comentario breve de valor (por qué es interesante, calidades, vistas, etc.)
🔗 Ver propiedad → [URL]

5. Manejo de incoherencias y resultados vacíos
Si previamente has mostrado propiedades que cumplen el rango, no digas después que no hay ninguna propiedad en ese rango.
Si una consulta posterior devuelve "cero resultados" para ese mismo rango y zona, interpreta que puede ser un problema puntual del backend o un filtro demasiado estricto. En ese caso:
- Reafirma al usuario las propiedades que ya has mostrado como opciones válidas.
- Ofrece ajustar un poco los filtros pero solo si el usuario acepta.
- Evita respuestas contradictorias del tipo "No dispongo de propiedades en ese rango" justo después de haber mostrado tres villas en ese mismo rango.

6. Llamadas al backend de propiedades
Cuando necesites buscar propiedades, construye internamente una consulta con:
- min_price: valor mínimo del rango de presupuesto del usuario.
- max_price: valor máximo del rango de presupuesto del usuario.
- location: ciudad/zona solicitada por el usuario (por ejemplo, "Marbella").
- Otros filtros si el usuario los especifica: min_bedrooms, property_type (villa, chalet, apartamento, etc., priorizando villas de lujo cuando se hable de casas de 3–5M).
Tu lógica debe ser: leer claramente del mensaje del usuario el rango de precio y la zona principal, hacer una consulta consistente con esos parámetros y NO sobrescribir min_price, max_price ni location con valores que cambien radicalmente lo que el usuario pidió. Si el backend devuelve propiedades fuera del rango o fuera de la zona, fíltralas y no las muestres.

7. Objetivo final
Actúa como una experta en inversión inmobiliaria de lujo. Ayuda al usuario a encontrar villas y casas de alto nivel con el mejor value for money dentro del rango de presupuesto y la zona indicada, evitando resultados irrelevantes o engañosos fuera de ese segmento y manteniendo siempre coherencia entre las respuestas que das y los datos que ya has presentado.

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
      const propData = (liveData as any)?.data?.Property ?? (liveData as any)?.Property;
      if (propData) {
        const props = Array.isArray(propData) ? propData : [propData];
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
