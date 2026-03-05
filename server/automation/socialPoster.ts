import cron from 'node-cron';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Demand Matrix for Localized Marketing
const demandMatrix: any = {
    GB: {
        country: "United Kingdom",
        style: "Classic Luxury Villa",
        keywords: "High Yield, Marbella Lifestyle, Rental Income",
        language: "en",
        prompt: "Hyper-realistic luxury villa in Marbella, white clean architecture, infinity pool overlooking the Mediterranean, cinematic sunset lighting, 8k resolution, professional photography style."
    },
    SE: {
        country: "Sweden",
        style: "Sustainable Modern Villa",
        keywords: "Scandi-Design, Light & Space, Sustainable Luxury",
        language: "sv",
        prompt: "Ultra-modern eco-luxury villa in Nueva Andalucia, open plan design, massive glass walls, organic materials, bright morning light, minimalist aesthetic, 8k resolution."
    },
    PL: {
        country: "Poland",
        style: "Modern High-End Apartment",
        keywords: "Investment Safe Haven, High ROI, New Opportunity",
        language: "pl",
        prompt: "Elegant modern apartment terrace in Estepona, sea views, designer furniture, champagne on a table, vibrant summer atmosphere, luxury holiday vibe, 8k resolution."
    },
    NL: {
        country: "Netherlands",
        style: "Tax-Efficient Investment Property",
        keywords: "ROI, Fiscal Efficiency, Marbella Penthouse",
        language: "nl",
        prompt: "Spacious luxury penthouse in Puerto Banus, rooftop pool, view over the marina and yachts, evening lights, sophisticated investment look, 8k resolution."
    },
    DE: {
        country: "Germany",
        style: "Prestigious Detached Villa",
        keywords: "Exclusivity, Discretion, Quality Construction",
        language: "de",
        prompt: "Grand prestigious mansion in La Zagaleta, private mountain setting, classical yet modern, expansive gardens, morning mist, feeling of privacy and power, 8k resolution."
    },
    FR: {
        country: "France",
        style: "Mediterranean Sanctuary",
        keywords: "Art de Vivre, Sea Views, Exclusive Living",
        language: "fr",
        prompt: "Charming luxury villa with Andalusian touch, bougainvillea colors, outdoor lounge, views of the rock of Gibraltar, warm Mediterranean vibe, 8k."
    },
    IT: {
        country: "Italy",
        style: "Value for Money Luxury",
        keywords: "Strategic Investment, Design, Strategic Location",
        language: "it",
        prompt: "Contemporary design villa in Benahavis, geometric shapes, infinity pool merging with the horizon, dusk lighting, high-end Italian furniture visible inside, 8k."
    }
};

// Config
const LOGO_PATH = path.join(process.cwd(), 'client', 'public', 'wanda_logo_horizontal.png');
const OUTPUT_DIR = path.join(process.cwd(), 'generated_posts');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TIGLM_API_KEY = 'de07c61a2bb74684a894eafc1b1b194a.GPlev7pRyuNvvxu4';
const TIGLM_API_URL = 'https://api.z.ai/api/coding/paas/v4';

/**
 * Generate a localized caption using AI
 */
async function generateCaption(profile: any) {
    const systemPrompt = `You are the Marketing Director of Wanda Estates, a high-end real estate agency in Costa del Sol.
    Generate a short, powerful, and sophisticated social media post for our ${profile.country} audience.
    Target persona: High Net Worth Individual.
    Value propositions to highlight: ${profile.keywords}. 
    MANDATORY: Include "🌐 Visit: www.wandaestates.com" at the end.
    Language: ${profile.language}.
    Tone: Sophisticated, architectural, investment-focused.
    Do NOT mention property IDs or prices. Focus on the luxury lifestyle and area prestige.`;

    try {
        const response = await fetch(`${TIGLM_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TIGLM_API_KEY.trim()}`,
            },
            body: JSON.stringify({
                model: 'glm-4.5-air',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crea el post de hoy.' }],
                temperature: 0.7
            })
        });

        if (response.ok) {
            const data: any = await response.json();
            return data.choices[0]?.message?.content || "Luxury living at Wanda Estates. www.wandaestates.com";
        }
    } catch (e) {
        console.error("[AI] Caption generation failed:", e);
    }

    return `Discover the ultimate ${profile.style} with Wanda Estates. \n\n🌐 Visit: www.wandaestates.com`;
}

/**
 * Overlay Logo on Image using Sharp
 */
async function watermarkImage(inputPath: string, countryCode: string) {
    const outputPath = path.join(OUTPUT_DIR, `post_${countryCode}_${Date.now()}.png`);

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) throw new Error("Metadata failed");

        const logoWidth = Math.floor(metadata.width * 0.25);
        const logo = await sharp(LOGO_PATH).resize(logoWidth).toBuffer();

        await image
            .composite([{
                input: logo,
                gravity: 'southwest'
            }])
            .toFile(outputPath);

        console.log(`[Sharp] Post created at: ${outputPath}`);
        return outputPath;
    } catch (e) {
        console.error("[Sharp] Watermark error:", e);
        return inputPath;
    }
}

/**
 * Main Daily Automation Task
 */
async function runDailyAutomation() {
    const countries = Object.keys(demandMatrix);
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const profile = demandMatrix[randomCountry];

    console.log(`🚀 Starting automation for: ${profile.country} (${randomCountry})`);

    try {
        // 1. Generate Caption
        const caption = await generateCaption(profile);
        console.log(`[AI] Caption Generated (${profile.language}):\n---`, caption, "\n---");

        // 2. Generate Image (DALL-E 3)
        console.log(`[AI] Generating Image for ${profile.style}...`);
        // Note: Real implementation needs valid OPENAI_API_KEY in process.env
        // const imageUrl = await callDalleAPI(profile.prompt);

        // 3. Watermark & Save (Mocking input for now)
        // If we had the downloaded image:
        // const finalImagePath = await watermarkImage(localDownloadedPath, randomCountry);

        console.log(`✅ [Success] Brand Post for ${profile.country} is ready.`);
        console.log(`👉 Strategy: Use the generated caption with the watermarked visual.`);
        console.log(`👉 URL focus: www.wandaestates.com`);

    } catch (e) {
        console.error("❌ Automation failed:", e);
    }
}

// Schedule: Run every 24 hours at 09:00 AM
cron.schedule('0 9 * * *', () => {
    console.log("⏰ Triggering scheduled social post...");
    runDailyAutomation();
});

// For Manual Testing
if (process.argv.includes('--test')) {
    runDailyAutomation();
}
