import { fetchPropertyDetails, fetchProperties } from './resales';

// ZhipuAI / GLM 4.5 Air configuration
const API_KEY = process.env.TIGLM_API_KEY || 'de07c61a2bb74684a894eafc1b1b194a.GPlev7pRyuNvvxu4';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

const SYSTEM_PROMPT = `
# ROLE
You are "EstateRanker-AI", the Chief Strategy Officer for a Costa del Sol luxury agency (Wanda Estates).

# OBJECTIVE
Analyze the property and assign it to **ONLY ONE** target country (GB, ES, NL, SE, PL, FR, or DE) where it has the highest statistical probability of selling in 2026.

# MARKET MATCHING RULES (STRICT ASSIGNMENT)
You must choose ONE market based on these specific triggers. Do not choose multiple.

1. **GB (United Kingdom):**
   - TRIGGERS: Frontline Golf, "Lock-up-and-leave", Gated Community, Mijas/Duquesa areas.
   - BUYER PERSONA: The Retiree or Golfer.

2. **SE (Sweden):**
   - TRIGGERS: Penthouse, Open plan kitchen, South/West orientation (Sun is key), Nueva Andalucia, Fuengirola.
   - BUYER PERSONA: The Sun Seeker.

3. **NL/BE (Netherlands/Belgium):**
   - TRIGGERS: Modern/Contemporary style, High-tech, Benahavis, Villas with large glass windows.
   - BUYER PERSONA: The Modernist Family.

4. **PL (Poland - Emerging 2026):**
   - TRIGGERS: Investment focus, High ROI potential, Price range €300k-€800k, New Developments (Off-plan) in Manilva/Estepona.
   - BUYER PERSONA: The Investor (Security & Growth).

5. **DE (Germany):**
   - TRIGGERS: Fincas, High build quality (Bauqualität), Rural/Quiet, East Marbella/Ojen, Energy Certificate A/B.
   - BUYER PERSONA: The Quality/Nature Lover.

6. **FR (France):**
   - TRIGGERS: Authentic Andalusian style, Historical center proximity, Golden Mile.
   - BUYER PERSONA: The Culture/Luxury Buyer.

7. **ES (Spain):**
   - TRIGGERS: Primary residence features (Near schools/transport), Competitive price/m2, Malaga Capital.
   - BUYER PERSONA: The Local Resident.

# TASK
1. Analyze the input property data.
2. DISCARD all markets except the **single best fit**.
3. Generate the SEO content **only** for that selected market language.

# OUTPUT FORMAT (STRICT JSON ONLY)
{
  "property_id": "REF-XXXX",
  "selected_market": "PL",
  "reasoning": "Selected Poland because property is a new development in Manilva under €500k, matching the 2026 Polish investment trend.",
  "seo_data": {
    "language_code": "pl",
    "focus_keyword": "inwestycja deweloperska costa del sol manilva",
    "title_tag": "Nowe Apartamenty w Manilva | Inwestycja z Widokiem na Morze | Wanda Estates",
    "meta_description": "Szukasz bezpiecznej inwestycji w Hiszpanii? Odkryj ten nowoczesny apartament w Manilva. Idealny kapitał na przyszłość.",
    "value_score": 8.5
  }
}
`;

export interface RankResult {
    property_id: string;
    selected_market: string;
    reasoning: string;
    seo_data: {
        language_code: string;
        focus_keyword: string;
        title_tag: string;
        meta_description: string;
        value_score: number;
    };
}

export async function rankProperty(propertyData: any): Promise<RankResult | null> {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "glm-4-air",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Assign and optimize this property: ${JSON.stringify(propertyData)}` }
                ],
                temperature: 0.2,
                top_p: 0.7
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Ranker API error:", err);
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) return null;

        // Extract JSON if AI wrapped it in markdown
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : content;

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error in rankProperty:", error);
        return null;
    }
}
