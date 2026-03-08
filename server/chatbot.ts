import { Request, Response } from 'express';
import { fetchProperties, fetchPropertyDetails } from './resales';
import fs from 'fs';
import path from 'path';

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

const FLAGSHIP_PROPERTIES = [
  { Reference: 'R5321632', Price: 4250000, Location: 'Casares Costa', TypeName: 'Villa', Beds: 6, BuiltArea: 800, Description: 'An architectural masterpiece overlooking the Mediterranean, offering ultimate privacy and luxury.' },
  { Reference: 'R4432156', Price: 3200000, Location: 'Marbella Golden Mile', TypeName: 'Villa', Beds: 5, BuiltArea: 850, Description: 'Stunning beachfront villa in Marbella most exclusive residential area.' },
  { Reference: 'R5112344', Price: 2500000, Location: 'Benahavís', TypeName: 'Villa', Beds: 4, BuiltArea: 450, Description: 'Contemporary residence in a gated luxury community with breathtaking mountain views.' }
];

const ALLOWED_RESIDENTIAL_TYPES = ['Villa', 'Apartment', 'Penthouse', 'Townhouse', 'House', 'Piso', 'Atico', 'Finca'];

const SYSTEM_PROMPT = `# ROL Y MISIÓN
Eres Wanda, una exclusiva Concierge Inmobiliaria de Lujo 24/7 especializada en villas y propiedades premium en la Costa del Sol, con foco principal en Marbella. 
Tu misión es asistir a clientes con alto poder adquisitivo a encontrar propiedades que encajen exactamente con su presupuesto y preferencias. 

# 1. COMPORTAMIENTO Y TONO
- **Idioma de respuesta:** Responde en el idioma del sitio web (indicado en la variable de idioma). Si el sitio está en inglés, responde en INGLÉS. Si está en español, responde en ESPAÑOL.
- Mantén un tono profesional, elegante, cercano y resolutivo. Eres una experta humana de alto nivel.
- PROHIBIDO usar frases como "Como modelo de lenguaje", "Soy una IA" o "En mi base de datos".
- Organiza tus respuestas con párrafos cortos y viñetas para facilitar la lectura.

# 2. REGLAS ESTRICTAS DE PRESUPUESTO Y UBICACIÓN
- **Presupuesto inquebrantable:** Respeta estrictamente los límites indicados por el usuario (min_price y max_price). Si el cliente no da rango de precio, pregúntale con elegancia: "¿En qué rango de inversión estás pensando aproximadamente para poder presentarte la selección más adecuada?"
- **Ubicación exacta:** Si el usuario menciona "Marbella" (o cualquier otra zona), limita los resultados EXACTAMENTE a esa ciudad/zona. No ofrezcas propiedades en otros pueblos a menos que el cliente te dé permiso.

# 3. PROTOCOLO PARA "CHOLLOS", "GANGAS" Y "OPORTUNIDADES" (CRÍTICO)
Cuando un cliente pregunte por un "chollo", "mejor valor", "value for money" o "ganga":
- **REGLA DE ORO:** Un chollo en el sector de lujo sigue siendo de lujo. MANTÉN EXACTAMENTE EL MISMO RANGO DE PRECIOS indicado por el usuario (Ej: Si buscaba de 3 a 5 millones, el chollo debe costar entre 3 y 5 millones).
- **Filtro de basura (PROHIBIDO propiedades barato):** Si el sistema interno te devuelve por error propiedades muy barato (ej. 29.000 € en un pueblo del interior), IGNÓRALAS POR COMPLETO. No las menciones, no te disculpes por ellas y no las presentes como opción válida.
- **Definición de oportunidad:** Considera "chollo" a la propiedad dentro del presupuesto del cliente que ofrezca más dormitorios, mejor parcela, vistas al mar o calidades superiores respecto a la media de su rango.

# 4. MEMORIA Y COHERENCIA (CERO CONTRADICCIONES)
- **Prohibido contradecirse:** Si en un mensaje anterior mostraste 3 propiedades de entre 3 y 5 millones, NUNCA puedes decir en el siguiente mensaje "no dispongo de propiedades en ese rango".
- Si al pedir un "chollo" el sistema interno falla y devuelve "cero resultados", ASUME que es un fallo del filtro. En ese caso, REUTILIZA las propiedades que ya mostraste en tu mensaje anterior y dile al cliente cuál de ellas consideras que es la mejor oportunidad de inversión (el "chollo").

# 5. FORMATO DE PRESENTACIÓN (CRÍTICO PARA FUNCIONAMIENTO)
Cuando presentes resultados, muestra entre 3 y 5 propiedades bien filtradas usando SIEMPRE este formato exacto:

🏡 **[Tipo de Propiedad] en [Zona/Urbanización]** — [Precio en € formateado, ej: 4.995.000 €]
- **Dormitorios:** [X] | **Superficie:** [X si existe]
- **Por qué es interesante:** [Comentario breve destacando calidades, vistas o valor]
- **Referencia:** [CÓDIGO_DE_REFERENCIA]

**IMPORTANTE:** NO pongas ningún enlace ni URL. Solo muestra la referencia de la propiedad.

# 6. LÓGICA DE LLAMADAS AL BACKEND (API INTERNA)
Cuando necesites buscar propiedades, construye mentalmente tu consulta manteniendo estos valores sin alterarlos radicalmente:
- min_price y max_price: Los que diga el usuario.
- location: La que diga el usuario (por defecto Marbella).
- property_type: Prioriza villas/chalets para presupuestos altos.
- Haz una única consulta lógica y filtra mentalmente lo que no encaje antes de responder.

# 7. CIERRE DE CONVERSACIÓN
Termina SIEMPRE tus mensajes con una pregunta abierta para mantener la conversación activa y guiar al usuario hacia el siguiente paso (Ej: "¿Te gustaría que nos centremos en una zona más concreta como Sierra Blanca, o prefieres que organice una visita virtual de alguna de estas opciones?").`;


// Helper to map and sanitize
function mapProperty(p: any) {
  return {
    Reference: p.Reference || p.Id || p.p_Reference || 'R000',
    Price: Number(p.Price || p.p_Price || 0),
    Location: p.Location || p.Municipality || p.Area || 'Costa del Sol',
    TypeName: p.TypeName || p.PropertyType?.NameType || 'Propiedad',
    Beds: p.Beds || p.Bedrooms || p.p_Bedrooms || 0,
    BuiltArea: p.BuiltArea || p.Built || p.p_BuiltArea || 0
  };
}

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationHistory = [], language = 'es' }: ChatRequest = req.body;
    const lowerMsg = message.toLowerCase();

    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedMsg = normalize(message);

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // 1. Extracción de Criterios (RESIDENTIAL ONLY)
    const locations = [
      "Marbella", "Benahavís", "Benahavis", "Estepona", "Sotogrande", "Casares",
      "Mijas", "Fuengirola", "Benalmádena", "Nueva Andalucía", "Golden Mile",
      "Milla de Oro", "Puerto Banús", "La Zagaleta", "El Madroñal", "Sierra Blanca",
      "Los Flamingos", "Los Arqueros", "La Quinta", "Cancelada", "San Pedro",
      "Guadalmina", "Aloha", "Las Brisas"
    ];
    const detectedLocation = locations.find(loc => normalizedMsg.includes(normalize(loc)));

    const propertyTypesMap: any = {
      'villa': 'Villa', 'casa': 'Villa', 'house': 'Villa', 'home': 'Villa',
      'apartment': 'Apartment', 'apartamento': 'Apartment', 'piso': 'Apartment',
      'penthouse': 'Penthouse', 'atico': 'Penthouse', 'áticado': 'Penthouse',
      'townhouse': 'Townhouse', 'adosado': 'Townhouse', 'pareado': 'Townhouse'
    };
    const detectedTypeKey = Object.keys(propertyTypesMap).find(key => lowerMsg.includes(key));
    let detectedType = detectedTypeKey ? propertyTypesMap[detectedTypeKey] : 'Villa,Apartment,Penthouse,Townhouse';

    let detectedBeds = "";
    const bedRegex = /(\d+)\+?\s*(?:dormitorio|habitacion|habitación|hab|beds|bedroom|bed)/i;
    const bedMatch = lowerMsg.match(bedRegex);
    if (bedMatch) detectedBeds = bedMatch[1];
    // 2. Detección de referencia específica (e.g. R4914826 o ref R4914826)
    const refMatch = message.match(/\bR\d{5,}\b/i);
    const specificRef = refMatch ? refMatch[0].toUpperCase() : null;

    // 3. Lógica de Precio Inteligente (Luxury Targeting)
    let targetPrice: number | null = null;
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    const isAround = lowerMsg.includes('around') || lowerMsg.includes('alrededor') || lowerMsg.includes('cerca') || lowerMsg.includes('approx') || lowerMsg.includes('alredeodr');
    const singleMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*(millón|millon|millones|million|millions|m|k|mio)/i);

    if (singleMatch) {
      const unit = singleMatch[2].toLowerCase();
      let multi = 1;
      if (unit.startsWith('m') || unit === 'million' || unit === 'millions' || unit === 'mio') {
        multi = 1000000;
      } else if (unit === 'k') {
        multi = 1000;
      }
      targetPrice = Math.floor(parseFloat(singleMatch[1].replace(',', '.')) * multi);

      if (isAround) {
        minPrice = targetPrice * 0.7; // Tighter range for luxury
        maxPrice = targetPrice * 1.3;
      } else {
        maxPrice = targetPrice * 1.1;
        if (targetPrice > 1000000) minPrice = targetPrice * 0.6;
        else minPrice = targetPrice * 0.5;
      }
    }

    let livePropertiesContext = "";
    try {
      let props: any[] = [];
      const baseParams: any = { p_PageSize: '60', p_PropertyTypes: detectedType, p_Agency_FilterId: '1', p_MustHavePictures: '1' };

      // Multi-Tier Search
      const searchTiers = [
        { loc: true, pr: true, bd: true },
        { loc: true, pr: true, bd: false },
        { loc: true, pr: false, bd: false },
        { loc: false, pr: true, bd: false },
      ];

      for (const tier of searchTiers) {
        if (props.length >= 10) break;

        const params = { ...baseParams };
        if (tier.loc && detectedLocation) params.p_location = detectedLocation;

        // HARD PRICE GATE IN API CALL
        if (tier.pr && minPrice) params.p_min = String(minPrice);
        if (tier.pr && maxPrice) params.p_max = String(maxPrice);
        if (tier.bd && detectedBeds) params.p_min_beds = detectedBeds;

        let liveData = await fetchProperties(params);
        let tierProps = (liveData?.data?.Property) ? (Array.isArray(liveData.data.Property) ? liveData.data.Property : [liveData.data.Property]) : [];

        const existingRefs = new Set(props.map(p => p.Reference));
        for (const p of tierProps) {
          const mapped = mapProperty(p);

          // ESCUDO RESIDENCIAL ABSOLUTO
          const forbiddenKeywords = ['commercial', 'local', 'industrial', 'warehouse', 'restaurant', 'office', 'negocio', 'traspaso', 'garage', 'parking', 'estacionamiento', 'trastero', 'plot', 'terreno', 'parcela', 'premises'];
          const typeLower = (mapped.TypeName || '').toLowerCase();
          const isBlacklisted = forbiddenKeywords.some(kw => typeLower.includes(kw));

          const allowedTypes = ['villa', 'apartment', 'penthouse', 'townhouse', 'house', 'piso', 'atico', 'áticado', 'apartamento', 'adosado', 'pareado', 'finca', 'chalet'];
          const isWhitelisted = allowedTypes.some(t => typeLower.includes(t)) || typeLower === 'propiedad';

          // RECHAZO TOTAL DE BARATIJAS SI SE BUSCA LUJO
          const minAcceptablePrice = (targetPrice || 0) > 1000000 ? (targetPrice || 0) * 0.5 : 0;
          const hasValidPrice = mapped.Price >= minAcceptablePrice;

          if (!existingRefs.has(mapped.Reference) && isWhitelisted && !isBlacklisted && hasValidPrice) {
            props.push(mapped);
          }
        }
      }

      // Ordenación y Limpieza
      const finalPrice = targetPrice || 0;
      if (finalPrice > 0) {
        props.sort((a, b) => Math.abs(a.Price - finalPrice) - Math.abs(b.Price - finalPrice));
      }

      const topMatches = props.slice(0, 3);
      let catalog = "";
      if (topMatches.length > 0) {
        catalog = topMatches.map((p: any) =>
          `- REF ${p.Reference} | ${p.TypeName} en ${p.Location} | ${p.Beds} Dorm | €${p.Price.toLocaleString()} | Link: https://wandaestates.com/properties/${p.Reference}`
        ).join("\n");
      }

      // Buscar propiedad específica por referencia si el cliente la mencionó
      let specificPropContext = "";
      if (specificRef) {
        try {
          const details = await fetchPropertyDetails(specificRef);
          if (details) {
            const p = details;
            const price = Number(p.Price || p.p_Price || 0);
            const beds = p.Beds || p.Bedrooms || p.p_Bedrooms || 0;
            const area = p.BuiltArea || p.Built || 0;
            const loc = p.Location || p.Municipality || 'Costa del Sol';
            const type = p.TypeName || p.PropertyType?.NameType || 'Propiedad';
            specificPropContext = `\n\n### PROPIEDAD ESPECÍFICA SOLICITADA POR EL CLIENTE:\n- REF ${specificRef} | ${type} en ${loc} | ${beds} Dorm | ${area}m² | €${price.toLocaleString()} | Link: https://wandaestates.com/properties/${specificRef}\nNOTA: El cliente ha pedido información sobre esta propiedad. Preséntalas como la primera opción y describe por qué es una gran elección. No digas que no tienes información.`;
          } else {
            specificPropContext = `\n\n### REFERENCIA SOLICITADA: ${specificRef}\nNOTA: Esta referencia existe en el sistema de ResalesOnline pero los detalles no están disponibles en este momento. Dile al cliente que puedes conectarle con un agente para obtener información completa y no digas que no existe.`;
          }
        } catch {
          specificPropContext = `\n\n### REFERENCIA SOLICITADA: ${specificRef}\nNOTA: Esta propiedad está en nuestra red MLS. Informa al cliente que un agente puede darle todos los detalles y ofrécele que te deje sus datos de contacto.`;
        }
      }

      // Construir contexto final
      if (specificPropContext) {
        livePropertiesContext = specificPropContext;
        if (catalog) livePropertiesContext += `\n\n### OTRAS OPCIONES DISPONIBLES:\n${catalog}`;
      } else if (topMatches.length > 0) {
        livePropertiesContext = `\n\n### SELECCIÓN DISPONIBLE PARA EL CLIENTE:\n${catalog}`;
      } else {
        livePropertiesContext = `\n\n### NOTA INTERNA: No se encontraron propiedades para estos criterios exactos en este momento. Informa al cliente de que el inventario se actualiza diariamente y ofrécele ser contactado directamente por un agente para propiedades exclusivas que aún no están en el portal.`;
      }

    } catch (e: any) {
      console.log("[CHATBOT] Error en fetch de propiedades:", e?.message || e);
      livePropertiesContext = "\n\n### NOTA: El sistema de búsqueda tuvo un problema técnico. Presenta las propiedades que conozcas de memoria o pregunta al cliente si desea afinar su búsqueda.";
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

    let lastError: string = '';
    
    for (const url of endpoints) {
      for (const modelName of modelOptions) {
        try {
          console.log(`[CHATBOT] Intentando API: ${url} con modelo: ${modelName}`);
          
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
          } else {
            const errorText = await response.text();
            lastError = `HTTP ${response.status}: ${errorText}`;
            console.log(`[CHATBOT] Error API ${url}: ${lastError}`);
          }
        } catch (innerError: any) {
          lastError = innerError?.message || String(innerError);
          console.log(`[CHATBOT] Excepción API ${url}: ${lastError}`);
        }
      }
    }

    console.log('[CHATBOT] Todas las APIs fallaron. Último error:', lastError);
    return res.status(500).json({ error: 'No se pudo conectar con el servicio de IA de Wanda. Por favor, intenta de nuevo en unos momentos.' });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Error interno en el asistente de Wanda' });
  }
}

export function setupChatbotRoutes(app: any) {
  app.post('/api/chat', handleChatMessage);
}
