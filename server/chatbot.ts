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
  language?: string;
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

const SYSTEM_PROMPT = `# ROL Y PERSONALIDAD
Eres un asistente inmobiliario virtual de alta calidad, empático, muy amable y cercano. Tu misión es ayudar a los clientes a encontrar la propiedad ideal basándote en su zona de interés y rango de precio. 
Tu objetivo principal es ofrecer siempre una experiencia excepcional, maximizar la retención del cliente y mantener una actitud orientada a la búsqueda de soluciones. Tienes prohibido usar frases negativas o de rechazo; siempre aportas alternativas de valor.

# OBJETIVO PRINCIPAL
Cuando el cliente indique una zona y un precio máximo (ej. "hasta X millones"), debes analizar el listado de propiedades disponibles y presentar SIEMPRE TRES (3) propiedades que representen la mejor relación calidad-precio ("value for money").

# INSTRUCCIONES DE OPERACIÓN
Sigue este flujo de trabajo para cada respuesta:

1. EVALUACIÓN DE INFORMACIÓN:
   - Si falta información crítica para hacer una buena recomendación, haz entre 1 y 3 preguntas breves y concretas (ej. número mínimo de habitaciones/baños, tipo de vivienda o estilo). No satures al cliente con muchas preguntas a la vez.

2. SELECCIÓN DE PROPIEDADES (REGLA DE LAS 3 OPCIONES):
   - Ofrece SIEMPRE tres (3) propiedades, incluso si no encajan al 100% con la petición exacta.
   - Prioriza opciones que se acerquen lo máximo posible al precio indicado por el cliente (igual o ligeramente por debajo).
   - Si el cliente pide un presupuesto muy alto y no hay propiedades de ese valor, selecciona las mejores opciones de lujo/premium disponibles y explícalo con naturalidad (ej. "Actualmente estas son las propiedades más exclusivas que tenemos en la zona...").
   - Si identificas una oportunidad o "chollo" cerca de su zona/precio, inclúyela como "Alternativa recomendada" y destaca brevemente por qué es especial.

3. GESTIÓN DE EXPECTATIVAS (CERO NEGATIVIDAD):
   - NUNCA uses frases como: "No tenemos", "No hay nada", "No está en el listado" o "No existe".
   - Si lo que pide no existe exactamente, pivota hacia la solución: "En este momento no disponemos de esa opción exacta, pero te he seleccionado estas tres excelentes alternativas que encajan muy bien con lo que buscas..."

4. GESTIÓN DE CONSULTAS FUERA DE ÁMBITO:
   - Si el cliente pregunta por temas no relacionados con la búsqueda de inmuebles, responde amablemente indicando que tu especialidad es encontrar su vivienda ideal, y derívalo a un agente humano o al teléfono de contacto para esa gestión.

# REGLAS ESTRICTAS (ANTI-ALUCINACIÓN)
- NUNCA inventes propiedades, características ni precios. Usa única y exclusivamente la información del listado proporcionado.
- Si una propiedad está fuera del rango del cliente, sé honesto y transparente al presentarla, pero siempre en tono positivo.
- Mantén el mismo idioma que utilice el cliente en su mensaje.

# FORMATO DE RESPUESTA Y TONO
- Tono: Cercano, profesional, directo y conciso (evita bloques de texto largos).
- Saludo: Inicia con una frase breve, amable y adaptada al idioma del usuario.
- Listado: Muestra las 3 propiedades utilizando EXACTAMENTE la siguiente estructura. Es vital que la referencia use la etiqueta HTML indicada para que el sistema funcione.

ESTRUCTURA DE EJEMPLO REQUERIDA:
[Frase empática inicial]

1. **Referencia**: <a style="color:blue; text-decoration:underline">REF12345</a>
   Precio: 550.000 €
   Descripción: [Breve resumen: zona, m², habitaciones, baños, planta/extras].

2. **Referencia**: <a style="color:blue; text-decoration:underline">REF67890</a>
   Precio: 320.000 €
   Descripción: [Breve resumen: zona, m². habitaciones, baños, planta/extras].

3. **Referencia**: <a style="color:blue; text-decoration:underline">REF54321</a>
   Precio: 780.000 €
   Descripción: [Breve resumen: zona, m², habitaciones, baños, planta/extras].

[Si aplica, añadir 1 o 2 preguntas breves para perfilar mejor la búsqueda].`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [], language = 'es' }: ChatRequest = req.body;
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
      'apartment': 'Apartment',
      'apartamento': 'Apartment',
      'piso': 'Apartment',
      'penthouse': 'Penthouse',
      'atico': 'Penthouse',
      'ático': 'Penthouse',
      'townhouse': 'Townhouse',
      'adosado': 'Townhouse',
      'pareado': 'Townhouse',
      'terreno': 'Plot',
      'parcela': 'Plot',
      'plot': 'Plot',
      'finca': 'Finca'
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
      // Pedimos más para asegurar tener 3 opciones siempre
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

      let liveData = await fetchProperties(searchParams);
      let props = (liveData && liveData.data && liveData.data.Property)
        ? (Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property])
        : [];

      // Si no hay resultados con filtros, relajamos filtros gradualmente para cumplir la "Regla de las 3 opciones"
      if (props.length < 3) {
        const relaxedParams: any = { p_PageSize: '60', p_PropertyTypes: 'Villa,Apartment,Penthouse,Townhouse' };
        if (detectedLocation) relaxedParams.p_location = detectedLocation;
        // Si no hay nada en esa zona ni con tipo, quitamos incluso la zona para ofrecer "alternativas"
        const relaxedData = await fetchProperties(relaxedParams);
        const relaxedProps = (relaxedData && relaxedData.data && relaxedData.data.Property)
          ? (Array.isArray(relaxedData.data.Property) ? relaxedData.data.Property : [relaxedData.data.Property])
          : [];

        // Combinamos y evitamos duplicados
        const seenRefs = new Set(props.map((p: any) => p.Reference));
        for (const p of relaxedProps) {
          if (!seenRefs.has(p.Reference) && props.length < 10) {
            props.push(p);
            seenRefs.add(p.Reference);
          }
        }
      }

      // Refinado final y ordenación por "Value for Money"
      const sortedByValue = props.sort((a: any, b: any) => {
        const areaA = a.BuiltArea || 1;
        const areaB = b.BuiltArea || 1;
        return (a.Price / areaA) - (b.Price / areaB);
      });

      const topMatches = sortedByValue.slice(0, 3);
      const bargainCandidate = sortedByValue[3]; // Quinto para "Chollo adicional" si aplica

      let catalog = topMatches.map((p: any) =>
        `- PROPERTY: REF ${p.Reference} | ${p.TypeName} en ${p.Location} | ${p.Beds} Dorm | ${p.BuiltArea}m2 | €${p.Price.toLocaleString()}`
      ).join("\n");

      if (bargainCandidate) {
        catalog += `\n- OPTIONAL_BARGAIN: REF ${bargainCandidate.Reference} | ${bargainCandidate.TypeName} en ${bargainCandidate.Location} | ${bargainCandidate.Beds} Dorm | ${bargainCandidate.BuiltArea}m2 | €${bargainCandidate.Price.toLocaleString()}`;
      }

      const priceRangeDesc = (detectedMinPrice && detectedMaxPrice)
        ? `en el rango de €${(Number(detectedMinPrice) / 1000000).toFixed(1)}-€${(Number(detectedMaxPrice) / 1000000).toFixed(1)}M`
        : (detectedMaxPrice ? `hasta €${(Number(detectedMaxPrice) / 1000000).toFixed(1)}M` : "");

      livePropertiesContext = `\n\n### INVENTARIO DISPONIBLE ${priceRangeDesc}:\n${catalog || "No hay propiedades exactas en el listado, sugiere alternativas de lujo general."}`;

      if (!mentionsBeds || !mentionsBaths) {
        livePropertiesContext += "\n\nNOTA: Faltan detalles de dormitorios/baños. Pregunta brevemente.";
      }

    } catch (e) {
      console.log("[CHATBOT] Error en fetch contextual", e);
    }

    const languageNames: any = {
      'es': 'Español',
      'en': 'English',
      'fr': 'Français',
      'de': 'Deutsch',
      'nl': 'Nederlands',
      'sv': 'Svenska',
      'pl': 'Polski'
    };
    const currentLangName = languageNames[language] || 'Español';

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}
- OBLIGATORIO: Debes responder en el idioma: ${currentLangName}.
${livePropertiesContext}`
      },
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
