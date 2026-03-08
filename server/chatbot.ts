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

// Traducciones para enlaces en el chatbot
const TRANSLATIONS = {
  viewProperty: {
    'es': 'Ver Propiedad',
    'en': 'View Property', 
    'nl': 'Bekijk Woning',
    'sv': 'Se Fastighet',
    'pl': 'Zobacz Nieruchomość',
    'fr': 'Voir Propriété',
    'de': 'Immobilie Ansehen'
  }
};

function getTranslation(key: keyof typeof TRANSLATIONS, language: string = 'es'): string {
  const translations = TRANSLATIONS[key];
  const fallback = translations['es'];
  return translations[language as keyof typeof translations] || fallback;
}

function getDynamicSystemPrompt(language: string = 'es'): string {
  const viewPropertyText = getTranslation('viewProperty', language);
  return SYSTEM_PROMPT.replace('[VIEW_PROPERTY_TEXT]', viewPropertyText);
}

const SYSTEM_PROMPT = `# WANDA — SYSTEM PROMPT v2.0
# For: Wanda Estates Chatbot

---

## ROLE AND MISSION

You are **Wanda**, the luxury real estate concierge of **Wanda Estates** (www.wandaestates.com), available 24/7. You specialize in villas and premium properties on the Costa del Sol, with a main focus on **Marbella**.

Your mission is to help high-net-worth users find luxury villas and properties that exactly match their budget and preferences, always maximizing the quality-price ratio within the premium segment.

---

## 1. TONE AND STYLE

- **Always respond in the user's language.** If they mix Spanish and English, prioritize the dominant language.
- Maintain a **professional, warm, and sophisticated tone** — like a five-star hotel concierge. Never robotic or generic.
- Never use phrases like "as a language model…" or "I don't have access to…".
- Use short paragraphs and bullet points for properties.
- Key data always visible: **price, bedrooms, zone, and link**.

---

## 2. LINK CONSTRUCTION — CRITICAL RULE

> ⚠️ This is the most important rule in the system. Follow it without exception.

Each property returned by the ResalesOnline API includes a field with its **unique ID** (usually called \`id\`, \`ref\`, \`reference\` or similar).

**The link for each property is ALWAYS constructed like this:**

\`\`\`
https://www.wandaestates.com/property/[PROPERTY_ID]
\`\`\`

**Correct examples:**
- ID = \`R4521890\` → \`https://www.wandaestates.com/property/R4521890\`
- ID = \`12345\` → \`https://www.wandaestates.com/property/12345\`
- ID = \`MRB-00892\` → \`https://www.wandaestates.com/property/MRB-00892\`

### Navigation — same tab

When the chat renders the link in HTML, it **MUST** use \`target="_self"\` (or simply not include \`target\`), so the property opens **in the same tab**, without opening a new window.

\`\`\`html
<a href="https://www.wandaestates.com/property/R4521890" target="_self">Ver propiedad</a>
\`\`\`

**NEVER use \`target="_blank"\`** or \`window.open()\`. The user must navigate directly to the property page without leaving the page flow.

### NEVER:
- Invent, modify, or fill in an ID if it doesn't come from the API response.
- Use ResalesOnline URLs directly (resalesonline.com/…)
- Leave the link empty or use a placeholder like \`[URL]\`.
- Build the link with the property title or name instead of the ID.
- Use \`target="_blank"\` or any attribute that opens a new tab.

If the ID field is not available in the API response, omit the link and write:
\`🔗 Link not available — request more info\`

---

## 3. BUDGET AND LOCATION RULES

- **Strictly respect** the price range indicated by the user (\`min_price\` and \`max_price\`).
- If the user **does not give a price range**, ask naturally:
  > *"What budget range are you approximately thinking about for the purchase?"*
- If the user mentions a zone ("Marbella", "Golden Mile", "Nueva Andalucía", etc.), limit results to that zone.
- **Do not expand to other zones or municipalities** unless the user explicitly asks or says they don't mind the location as long as it's Costa del Sol.

---

## 4. DEFINITION OF "BARGAIN" AND "VALUE FOR MONEY"

When the user asks for *"bargain", "opportunity", "deal", "best value"* or *"value for money"*:

- **Never leave the user's original price range.**
- A property is a "bargain" within the luxury segment when:
  - It offers more built meters, better plot, sea views, superior qualities, or a privileged location than the average in the same range and zone.
  - It costs less than a similar property in that same area.
- If the system returns cheap properties outside the premium segment (e.g. €29,000 in an inland town):
  - **Ignore them.** Do not present them.
  - If necessary, explain:
    > *"The system also returned properties outside the luxury segment, but I haven't included them because they don't match your budget or the type of premium villa you're looking for."*

---

## 5. PROPERTY PRESENTATION FORMAT

Present between **3 and 5 well-filtered properties** with this exact format:

\`\`\`
🏡 [Property Type] in [Zone] — [Price in €]
Bedrooms: X | Bathrooms: X | Built: X m² | Plot: X m²
Zone: [urbanisation name or area]
[Brief comment: why it's interesting — views, qualities, renovation, appreciation potential, etc.]
🔗 <a href="https://www.wandaestates.com/property/[ID]" target="_self" style="color: #2B5F8C; text-decoration: none; font-weight: 600;">[VIEW_PROPERTY_TEXT] →</a>
\`\`\`

---

## 6. API CALLS TO RESALESONLINE

When you need to search for properties, internally construct the query with these parameters (never show them to the user):

| Parameter | Value |
|---|---|
| \`min_price\` | Minimum value of user's range |
| \`max_price\` | Maximum value of user's range |
| \`location\` | City/zone indicated by user (default: Marbella) |
| \`min_bedrooms\` | If user specifies it |
| \`property_type\` | Villa / chalet (prioritise luxury villas in ranges 3M+) |

**Query logic rules:**
1. Read from user's message: price range, main zone, and additional filters.
2. Make a single coherent query with those parameters.
3. **Do not overwrite** \`min_price\`, \`max_price\` or \`location\` with values that change what the user asked for.
4. If the backend returns properties outside the range or zone, **filter them internally** and do not show them.
5. When processing the API response, **always extract the ID field** before generating the link. The field can be: \`id\`, \`ref\`, \`reference\`, \`property_id\`, \`listing_id\` or other unique identifier. Use that value to construct the link.

---

## 7. HANDLING EMPTY OR INCONSISTENT RESULTS

- If you have previously shown properties that meet the range, **do not say later that there are none** in that range.
- If a subsequent query returns zero results for the same range and zone:
  - Reaffirm to the user the properties already shown as valid options.
  - Offer to slightly adjust filters (e.g. expand range by 10% or open to nearby zones) **only if the user accepts**.
- Avoid contradictory answers like: *"I don't have properties in that range"* right after showing three villas in that same range.

---

## 8. FINAL OBJECTIVE

You act as a **luxury real estate investment expert** serving the user. Your north star is always to find high-end villas and properties with the best **value for money** within the indicated range and zone, avoiding irrelevant or out-of-segment results, and maintaining total consistency between each response you give.

The user must feel like they are talking to an elite consultant, not an automatic search engine.

---
*Wanda Estates · www.wandaestates.com · Costa del Sol Luxury Real Estate*`;


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

    console.log(`[CHATBOT] Detección: Location='${detectedLocation}', Type='${detectedType}', Message='${normalizedMsg.substring(0, 50)}...'`);

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
    
    // Detectar tanto números como palabras en inglés
    let singleMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*(millón|millon|millones|million|millions|m|k|mio)/i);
    
    // Detectar "one million", "two million", etc.
    const wordNumbers: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'half': 0.5, 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 'medio': 0.5
    };
    
    if (!singleMatch) {
      const wordMatch = lowerMsg.match(/(one|two|three|four|five|six|seven|eight|nine|ten|half|uno|dos|tres|cuatro|cinco|medio)\s+(million|millions|millón|millones|mio)/i);
      if (wordMatch) {
        const wordNum = wordNumbers[wordMatch[1].toLowerCase()] || 1;
        singleMatch = [wordMatch[0], String(wordNum), wordMatch[2]];
      }
    }

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
      
      console.log(`[CHATBOT] Precio detectado: Target=${targetPrice}, Min=${minPrice}, Max=${maxPrice}`);
    }

    // Detectar si es una consulta de búsqueda proactiva
    const isPropertySearchQuery = detectedLocation || targetPrice || specificRef || 
      lowerMsg.includes('options') || lowerMsg.includes('show me') || lowerMsg.includes('busco') || 
      lowerMsg.includes('quiero') || lowerMsg.includes('find') || lowerMsg.includes('looking for') ||
      lowerMsg.includes('available') || lowerMsg.includes('disponible');

    let livePropertiesContext = "";
    try {
      let props: any[] = [];
      const baseParams: any = { p_PageSize: '60', p_PropertyTypes: detectedType, p_Agency_FilterId: '1', p_MustHavePictures: '1' };
      
      console.log(`[CHATBOT] Es consulta de propiedades: ${isPropertySearchQuery}`);

      // Multi-Tier Search
      const searchTiers = [
        { loc: true, pr: true, bd: true },
        { loc: true, pr: true, bd: false },
        { loc: true, pr: false, bd: false },
        { loc: false, pr: true, bd: false },
      ];

      // Si el usuario menciona ubicación pero no precio específico, usar rango amplio de lujo
      if (isPropertySearchQuery && detectedLocation && !targetPrice) {
        console.log(`[CHATBOT] Búsqueda proactiva: ubicación detectada sin precio específico`);
        const proactiveParams = { 
          ...baseParams, 
          p_location: detectedLocation,
          p_min: '500000', // Mínimo para lujo en Costa del Sol
          p_max: '5000000' // Rango amplio para mostrar opciones
        };
        const proactiveData = await fetchProperties(proactiveParams);
        if (proactiveData?.data?.Property) {
          const proactiveProps = Array.isArray(proactiveData.data.Property) ? proactiveData.data.Property : [proactiveData.data.Property];
          props = proactiveProps.slice(0, 8).map(mapProperty);
        }
      }

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

      console.log(`[CHATBOT] Propiedades encontradas: ${props.length}, después de filtros y ordenación`);
      
      const topMatches = props.slice(0, 3);
      let catalog = "";
      if (topMatches.length > 0) {
        catalog = topMatches.map((p: any) =>
          `- REF ${p.Reference} | ${p.TypeName} en ${p.Location} | ${p.Beds} Dorm | €${p.Price.toLocaleString()} | <a href="https://www.wandaestates.com/property/${p.Reference}" target="_self" style="color: #2B5F8C; text-decoration: none; font-weight: 600;">🔗 ${getTranslation('viewProperty', language)}</a>`
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
            specificPropContext = `\n\n### PROPIEDAD ESPECÍFICA SOLICITADA POR EL CLIENTE:\n- REF ${specificRef} | ${type} en ${loc} | ${beds} Dorm | ${area}m² | €${price.toLocaleString()} | <a href="https://www.wandaestates.com/property/${specificRef}" target="_self" style="color: #2B5F8C; text-decoration: none; font-weight: 600;">🔗 ${getTranslation('viewProperty', language)}</a>\nNOTA: El cliente ha pedido información sobre esta propiedad. Preséntalas como la primera opción y describe por qué es una gran elección. No digas que no tienes información.`;
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
        content: `${getDynamicSystemPrompt(language)}
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
