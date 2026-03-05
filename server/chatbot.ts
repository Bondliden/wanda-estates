import { Request, Response } from 'express';
import { fetchProperties } from './resales';

// GLM 4.5 Air API configuration (Z.ai - Official)
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

const SYSTEM_PROMPT = `Eres Wanda, la asistente virtual de Wanda Estates, inmobiliaria de ultra-lujo en la Costa del Sol.
- PERSONALIDAD: Profesional, eficiente y sofisticada. Tu tiempo y el del cliente son valiosos.
- TONO: Conciso y directo. Evita párrafos largos de cortesía innecesaria. 
- REGLA CRÍTICA: Ofrece ÚNICAMENTE propiedades que coincidan con el TIPO solicitado (ej. si piden Villa, NO ofrezcas apartamentos o locales).
- OBJETIVO: Presentar las mejores oportunidades "Value for Money" (mejor relación precio/m2).
- IDIOMA: Responde siempre en el idioma del usuario.`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;
    const lowerMsg = message.toLowerCase();

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // 1. Extracción de Criterios (Inteligencia Simple)
    const locations = ["Marbella", "Benahavís", "Estepona", "Sotogrande", "Casares", "Mijas", "Fuengirola", "Benalmádena", "Nueva Andalucía", "Golden Mile", "Milla de Oro", "Puerto Banús"];
    const detectedLocation = locations.find(loc => lowerMsg.includes(loc.toLowerCase()));

    const propertyTypesMap: any = {
      'villa': 'Villa',
      'casa': 'Villa',
      'finca': 'Villa',
      'apartment': 'Apartment',
      'apartamento': 'Apartment',
      'piso': 'Apartment',
      'penthouse': 'Penthouse',
      'atico': 'Penthouse',
      'ático': 'Penthouse',
      'townhouse': 'Townhouse',
      'adosado': 'Townhouse',
      'pareado': 'Townhouse'
    };
    const detectedTypeKey = Object.keys(propertyTypesMap).find(key => lowerMsg.includes(key));
    const detectedType = detectedTypeKey ? propertyTypesMap[detectedTypeKey] : 'Villa,Apartment,Penthouse,Townhouse';

    // Detección básica de precio máximo
    let detectedMaxPrice = "";
    const priceMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*(millón|millon|millones|m|k)/);
    if (priceMatch) {
      let val = parseFloat(priceMatch[1].replace(',', '.'));
      const unit = priceMatch[2];
      if (unit.startsWith('m')) val *= 1000000;
      else if (unit === 'k') val *= 1000;
      detectedMaxPrice = String(Math.floor(val));
    }

    let livePropertiesContext = "";
    try {
      const searchParams: any = {
        p_PageSize: '40',
        p_PropertyTypes: detectedType,
      };

      if (detectedLocation) searchParams.p_location = detectedLocation;
      if (detectedMaxPrice) searchParams.p_max = detectedMaxPrice;

      const liveData = await fetchProperties(searchParams);

      if (liveData && liveData.data && liveData.data.Property) {
        let props = Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property];

        // Refinado de seguridad (evitar locales comerciales o parkings si se pidió vivienda)
        props = props.filter((p: any) => {
          const type = (p.TypeName || "").toLowerCase();
          const isDwelling = type.includes("villa") || type.includes("apartment") || type.includes("penthouse") || type.includes("townhouse") || type.includes("casa") || type.includes("apartamento") || type.includes("ático");

          if (detectedTypeKey) {
            // Si el usuario pidió algo específico, ser estrictos
            return type.includes(detectedTypeKey) || (detectedTypeKey === 'villa' && type.includes('casa'));
          }
          return isDwelling;
        });

        // Lógica "Value for Money": Mejor precio por metro construido
        const valueSorted = [...props].sort((a: any, b: any) => {
          const areaA = a.BuiltArea || 1;
          const areaB = b.BuiltArea || 1;
          const priceA = a.Price || 0;
          const priceB = b.Price || 0;
          return (priceA / areaA) - (priceB / areaB);
        });

        const catalog = valueSorted.slice(0, 5).map((p: any) =>
          `- REF: ${p.Reference} | ${p.TypeName} en ${p.Location} | ${p.Beds} Dorm | ${p.BuiltArea}m2 | €${p.Price.toLocaleString()} (Excelente relación calidad-precio)`
        ).join("\n");

        if (catalog) {
          livePropertiesContext = `\n\n### INVENTARIO DISPONIBLE:\n${catalog}\n\nREGLA: Presenta estas opciones de forma ejecutiva y concisa. Si no hay una coincidencia exacta, informa profesionalmente y ofrece buscar en nuestro portfolio off-market.`;
        } else {
          livePropertiesContext = `\n\nAVISO: No se han encontrado ${detectedTypeKey || 'propiedades'} que coincidan exactamente con esos criterios en el catálogo activo ahora mismo.`;
        }
      }
    } catch (e) {
      console.log("[CHATBOT] Error en fetch contextual", e);
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT + livePropertiesContext },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const endpoints = [
      'https://api.z.ai/api/coding/paas/v4',
      'https://api.z.ai/api/paas/v4',
      'https://open.bigmodel.cn/api/paas/v4'
    ];
    const modelOptions = ['glm-4.5-air', 'glm-4-air', 'glm-4'];

    for (const url of endpoints) {
      for (const modelName of modelOptions) {
        try {
          const response = await fetch(`${url}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TIGLM_API_KEY.trim()}`,
            },
            body: JSON.stringify({
              model: modelName,
              messages: messages,
              temperature: 0.3
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

    return res.status(500).json({ error: 'No se pudo conectar con el servicio de IA de Wanda' });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Error interno en el asistente de Wanda' });
  }
}

export function setupChatbotRoutes(app: any) {
  app.post('/api/chat', handleChatMessage);
}
