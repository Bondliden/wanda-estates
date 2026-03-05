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
- TONO: Conciso y directo.
- REGLA DE RESULTADOS: 
    1. Ofrece máximo 3 propiedades que coincidan estrictamente con la ubicación pedida.
    2. Si hay un "CHOLLO" (una propiedad con valor excepcional) muy cerca de donde busca, añade la frase exacta: "¿Considerarías algo mejor por el mismo precio muy cerca de donde buscas?" y descríbelo.
- REGLA DE DATOS FALTANTES: Si el usuario no ha especificado número de dormitorios o baños, pregúntale educadamente al final de tu respuesta para refinar la búsqueda.
- REGLA CRÍTICA: Ofrece ÚNICAMENTE el tipo de propiedad solicitado (ej. si piden Villa, NO ofrezcas apartamentos).
- OBJETIVO: Presentar las mejores oportunidades "Value for Money" (mejor relación precio/m2).
- IDIOMA: Responde siempre en el idioma del usuario.`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;
    const lowerMsg = message.toLowerCase();

    // Normalización para búsqueda de localizaciones (ignorando acentos)
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedMsg = normalize(message);

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // 1. Extracción de Criterios (Inteligencia Simple)
    const locations = ["Marbella", "Benahavís", "Estepona", "Sotogrande", "Casares", "Mijas", "Fuengirola", "Benalmádena", "Nueva Andalucía", "Golden Mile", "Milla de Oro", "Puerto Banús"];
    const detectedLocation = locations.find(loc => normalizedMsg.includes(normalize(loc)));

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

    // Chequeo de datos faltantes
    const mentionsBeds = lowerMsg.includes('dormitorio') || lowerMsg.includes('habitacion') || lowerMsg.includes('habitación') || lowerMsg.includes('beds') || /\d+\s*dorm/.test(lowerMsg);
    const mentionsBaths = lowerMsg.includes('baño') || lowerMsg.includes('baths') || lowerMsg.includes('aseo') || /\d+\s*baño/.test(lowerMsg);

    // Detección de necesidad de reforma
    const isRenovationRequest = lowerMsg.includes('reformar') || lowerMsg.includes('reforma') || lowerMsg.includes('renovar') || lowerMsg.includes('restaurar');

    // Detección de precio (Soporta rango e individual)
    let detectedMaxPrice = "";
    let detectedMinPrice = "";

    // Regex para rango: "entre 1.5 y 2 millones", "1.5-2m"
    const rangeRegex = /(\d+(?:\.\d+)?)\s*(?:y|a|e|hasta|-)\s*(\d+(?:\.\d+)?)\s*(millón|millon|millones|m|k)/i;
    const rangeMatch = lowerMsg.match(rangeRegex);

    if (rangeMatch) {
      let minVal = parseFloat(rangeMatch[1].replace(',', '.'));
      let maxVal = parseFloat(rangeMatch[2].replace(',', '.'));
      const unit = rangeMatch[3].toLowerCase();
      let multi = 1;
      if (unit.startsWith('m')) multi = 1000000;
      else if (unit === 'k') multi = 1000;

      detectedMinPrice = String(Math.floor(minVal * multi));
      detectedMaxPrice = String(Math.floor(maxVal * multi));
    } else {
      // Caso único: "hasta 2 millones", "por 500k"
      const singleMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*(millón|millon|millones|m|k)/i);
      if (singleMatch) {
        let val = parseFloat(singleMatch[1].replace(',', '.'));
        const unit = singleMatch[2].toLowerCase();
        let multi = 1;
        if (unit.startsWith('m')) multi = 1000000;
        else if (unit === 'k') multi = 1000;
        detectedMaxPrice = String(Math.floor(val * multi));
      }
    }

    let livePropertiesContext = "";
    try {
      // Pedimos más para poder filtrar chollos cercanos
      const searchParams: any = {
        p_PageSize: '60',
        p_PropertyTypes: detectedType,
      };

      if (isRenovationRequest) {
        searchParams.p_MustHaveFeatures = "Restoration Required";
      }

      if (detectedLocation) searchParams.p_location = detectedLocation;
      if (detectedMinPrice) searchParams.p_min = detectedMinPrice;
      if (detectedMaxPrice) searchParams.p_max = detectedMaxPrice;

      const liveData = await fetchProperties(searchParams);

      if (liveData && liveData.data && liveData.data.Property) {
        let props = Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property];

        // Refinado por tipo
        props = props.filter((p: any) => {
          const type = (p.TypeName || "").toLowerCase();
          const isDwelling = type.includes("villa") || type.includes("apartment") || type.includes("penthouse") || type.includes("townhouse") || type.includes("casa") || type.includes("apartamento") || type.includes("ático");
          if (detectedTypeKey) {
            return type.includes(detectedTypeKey) || (detectedTypeKey === 'villa' && type.includes('casa'));
          }
          return isDwelling;
        });

        const sortedByValue = [...props].sort((a: any, b: any) => {
          const areaA = a.BuiltArea || 1;
          const areaB = b.BuiltArea || 1;
          return (a.Price / areaA) - (b.Price / areaB);
        });

        // Tomamos los 3 primeros como "match directo"
        const topMatches = sortedByValue.slice(0, 3);

        // Buscamos 1 "Chollo adicional" que no esté en el top 3 pero sea excepcional
        const bargainCandidate = sortedByValue[3];

        let catalog = topMatches.map((p: any) =>
          `- MATCH: REF ${p.Reference} | ${p.TypeName} en ${p.Location} | ${p.Beds} Dorm | ${p.BuiltArea}m2 | €${p.Price.toLocaleString()}`
        ).join("\n");

        if (bargainCandidate) {
          catalog += `\n- CHOLLO CERCANO: REF ${bargainCandidate.Reference} | ${bargainCandidate.TypeName} en ${bargainCandidate.Location} | ${bargainCandidate.Beds} Dorm | ${bargainCandidate.BuiltArea}m2 | €${bargainCandidate.Price.toLocaleString()} (Valor excepcional)`;
        }

        const priceRangeDesc = (detectedMinPrice && detectedMaxPrice)
          ? `en el rango de €${(Number(detectedMinPrice) / 1000000).toFixed(1)}-€${(Number(detectedMaxPrice) / 1000000).toFixed(1)}M`
          : (detectedMaxPrice ? `hasta €${(Number(detectedMaxPrice) / 1000000).toFixed(1)}M` : "");

        const missingInfoPrompt = (!mentionsBeds || !mentionsBaths) ? "\n\nNOTA: El cliente no ha especificado dormitorios/baños. Pregúntale." : "";

        if (catalog) {
          livePropertiesContext = `\n\n### INVENTARIO SELECCIONADO ${priceRangeDesc}:\n${catalog}${missingInfoPrompt}\n\nRECUERDA: Máximo 3 matches + 1 chollo cercano si aplica. Usa la frase de "Considerarías algo mejor..." si presentas el chollo.`;
        } else {
          livePropertiesContext = `\n\nAVISO: No hemos encontrado propiedades que coincidan exactamente con el rango €${(Number(detectedMinPrice) / 1000000).toFixed(1)}-€${(Number(detectedMaxPrice) / 1000000).toFixed(1)}M en nuestro catálogo online ahora mismo. Pero tenemos opciones off-market.${missingInfoPrompt}`;
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
