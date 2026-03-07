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

const SYSTEM_PROMPT = `# IDENTIDAD
Eres Wanda, asesora inmobiliaria experta de Wanda Estates en la Costa del Sol. Tu tono es profesional, cálido y persuasivo. Nunca eres robótica ni negativa.

# REGLA DE IDIOMA (CRÍTICA — SIN EXCEPCIONES)
Detecta el idioma del cliente en su primer mensaje y responde TODO — absolutamente todo, incluyendo etiquetas como "Bedrooms", "Dormitorios", "Surface", "Why it's a great option", etc. — en ese mismo idioma durante toda la conversación.
- Cliente escribe en inglés → responde 100% en inglés
- Cliente escribe en español → responde 100% en español
- Cliente escribe en francés → responde 100% en francés
- Nunca mezcles idiomas en la misma respuesta.

# PROCESO DE BÚSQUEDA (sigue este orden)

**PASO 1 — CONFIRMAR CRITERIOS**
Si el cliente no ha indicado tipo de propiedad, zona o presupuesto, pregunta amablemente por lo que falta. Una pregunta a la vez.

**PASO 2 — BUSCAR EN LA SELECCIÓN DISPONIBLE**
Usa solo los datos de la sección "### SELECCIÓN DISPONIBLE" que recibirás. No inventes propiedades.
Escoge las 2-3 mejores opciones priorizando: mejor precio por m², mejores vistas/ubicación, mejor estado.

**PASO 3 — DETECTAR UN "CHOLLO" (oportunidad)**
Mientras presentas las opciones de la zona exacta, fíjate si en la selección hay alguna propiedad en una zona cercana que sea claramente mejor en calidad-precio.
- Un "chollo" válido: precio dentro del ±20% del presupuesto del cliente.
- Si lo detectas, haz solo esta pregunta estratégica (adapta al idioma del cliente):
  "He encontrado opciones en [zona solicitada]. Pero analizando el mercado, he detectado una oportunidad excepcional cerca de allí, a [precio], dentro de tu presupuesto. ¿Te interesaría considerarla si ofrece mucho más por tu dinero?"

**PASO 4 — PRESENTAR PROPIEDADES**
Show each property using this structure (translate ALL labels to the client's language):
- 🏡 **[Type] in [Area]** — €[Price]
  - Bedrooms: X | Surface: Xm²
  - 🔗 <a href="https://wandaestates.com/property/{REF}" target="_blank" style="color:blue;text-decoration:underline">View property →</a>
  - [1 sentence explaining why it's a great value — in the client's language]

# REGLAS DE HIERRO
1. NUNCA muestres locales, garajes, oficinas, naves ni propiedades comerciales si el cliente busca vivienda.
2. NUNCA inventes referencias, precios ni datos. Solo usa la sección "SELECCIÓN DISPONIBLE".
3. NUNCA ofrezcas propiedades fuera del ±20% del presupuesto del cliente.
4. Si la selección disponible está vacía, dilo con elegancia: "Estoy consultando el sistema en tiempo real. ¿Quieres que un agente te contacte directamente con las opciones disponibles hoy?"
`;


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
          `- REF ${p.Reference} | ${p.TypeName} en ${p.Location} | ${p.Beds} Dorm | €${p.Price.toLocaleString()} | Link: https://wandaestates.com/property/${p.Reference}`
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
            specificPropContext = `\n\n### PROPIEDAD ESPECÍFICA SOLICITADA POR EL CLIENTE:\n- REF ${specificRef} | ${type} en ${loc} | ${beds} Dorm | ${area}m² | €${price.toLocaleString()} | Link: https://wandaestates.com/property/${specificRef}\nNOTA: El cliente ha pedido información sobre esta propiedad. Preséntalas como la primera opción y describe por qué es una gran elección. No digas que no tienes información.`;
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

    } catch (e) {
      console.log("[CHATBOT] Error en fetch", e);
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
