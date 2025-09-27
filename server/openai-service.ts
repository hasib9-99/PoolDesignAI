import OpenAI from "openai";
import type { PoolSpecs, CostEstimate, ConstructionPlan } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PoolDesignRequest {
  poolShape: string;
  poolSize: string;
  style: string;
  features: string[];
}

export interface PoolDesignResult {
  imageUrl: string;
  estimatedCost: number;
  timeline: string;
}

export async function generatePoolSpecsFromVoice(transcript: string): Promise<PoolSpecs> {
  try {
    const prompt = `Extract pool design specifications from this voice transcript and return the data in the exact JSON schema format specified.

Transcript: "${transcript}"

Analyze the transcript and return a JSON object with:
- style: pool style (lagoon, modern, natural, luxury, etc.)
- features: array of features mentioned (waterfall, spa, fire-feature, swim-up-bar, tanning-ledge, lighting, heating, etc.)
- approxLengthFt: approximate pool length in feet (estimate if not specified, default 30)
- childFriendly: boolean if child safety features are mentioned
- raw: the original transcript

Schema:
{
  "style": "string",
  "features": ["string"],
  "approxLengthFt": number,
  "childFriendly": boolean,
  "raw": "string"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsed = JSON.parse(content);
      // Ensure all required fields are present with defaults
      return {
        style: parsed.style || "custom",
        features: Array.isArray(parsed.features) ? parsed.features : [],
        approxLengthFt: typeof parsed.approxLengthFt === 'number' ? parsed.approxLengthFt : 30,
        childFriendly: Boolean(parsed.childFriendly),
        raw: transcript
      };
    } catch (parseError) {
      console.error('JSON parse error in generatePoolSpecsFromVoice:', parseError);
      // Fallback if JSON parsing fails
      return {
        style: "custom",
        features: [],
        approxLengthFt: 30,
        childFriendly: false,
        raw: transcript
      };
    }
  } catch (error) {
    console.error('Error processing voice transcript:', error);
    throw new Error(`Failed to process voice input: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateCostEstimateFromSpecs(poolSpecs: PoolSpecs): Promise<CostEstimate> {
  try {
    const prompt = `Generate a detailed cost estimate for this pool design and return the data in the exact JSON schema format specified.

Pool Specifications:
- Style: ${poolSpecs.style}
- Features: ${poolSpecs.features.join(', ')}
- Approximate Length: ${poolSpecs.approxLengthFt}ft
- Child-Friendly: ${poolSpecs.childFriendly}

Provide a realistic cost breakdown. Base costs should start around $45,000 for basic pools.

Schema:
{
  "lineItems": {
    "base": number,
    "featuresCost": number,
    "sizeFactor": number,
    "design": number,
    "permits": number,
    "contingency": number
  },
  "totalLow": number,
  "totalHigh": number,
  "timelineWeeks": number
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsed = JSON.parse(content);
      // Validate and ensure all required fields are present
      const baseSize = Math.max(30, poolSpecs.approxLengthFt);
      const sizeFactor = Math.floor((baseSize - 30) * 1000);
      const featuresCost = poolSpecs.features.length * 3500;
      const base = 45000;
      const design = 2500;
      const permits = 1200;
      const contingency = Math.floor((base + sizeFactor + featuresCost) * 0.15);
      const fallbackTotalLow = base + sizeFactor + featuresCost + design + permits + contingency;
      
      return {
        lineItems: {
          base: parsed.lineItems?.base || base,
          featuresCost: parsed.lineItems?.featuresCost || featuresCost,
          sizeFactor: parsed.lineItems?.sizeFactor || sizeFactor,
          design: parsed.lineItems?.design || design,
          permits: parsed.lineItems?.permits || permits,
          contingency: parsed.lineItems?.contingency || contingency
        },
        totalLow: parsed.totalLow || fallbackTotalLow,
        totalHigh: parsed.totalHigh || Math.floor(fallbackTotalLow * 1.25),
        timelineWeeks: parsed.timelineWeeks || (8 + Math.floor(poolSpecs.features.length / 2))
      };
    } catch (parseError) {
      console.error('JSON parse error in generateCostEstimateFromSpecs:', parseError);
      // Fallback calculation
      const baseSize = Math.max(30, poolSpecs.approxLengthFt);
      const sizeFactor = Math.floor((baseSize - 30) * 1000);
      const featuresCost = poolSpecs.features.length * 3500;
      const base = 45000;
      const design = 2500;
      const permits = 1200;
      const contingency = Math.floor((base + sizeFactor + featuresCost) * 0.15);
      
      const totalLow = base + sizeFactor + featuresCost + design + permits + contingency;
      const totalHigh = Math.floor(totalLow * 1.25);
      
      return {
        lineItems: {
          base,
          featuresCost,
          sizeFactor,
          design,
          permits,
          contingency
        },
        totalLow,
        totalHigh,
        timelineWeeks: 8 + Math.floor(poolSpecs.features.length / 2)
      };
    }
  } catch (error) {
    console.error('Error generating cost estimate:', error);
    throw new Error(`Failed to generate cost estimate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateConstructionPlan(poolSpecs: PoolSpecs): Promise<ConstructionPlan> {
  try {
    const prompt = `Generate a detailed construction plan for this pool design and return the data in the exact JSON schema format specified.

Pool Specifications:
- Style: ${poolSpecs.style}
- Features: ${poolSpecs.features.join(', ')}
- Approximate Length: ${poolSpecs.approxLengthFt}ft
- Child-Friendly: ${poolSpecs.childFriendly}

Schema:
{
  "phases": [
    {
      "phase": "string",
      "duration": "string",
      "tasks": ["string"],
      "requirements": ["string"]
    }
  ],
  "materials": [
    {
      "category": "string",
      "items": ["string"],
      "estimated_cost": "string"
    }
  ],
  "permits": ["string"],
  "timeline": "string"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsed = JSON.parse(content);
      const fallbackPlan = {
        phases: [
          {
            phase: "Site Preparation",
            duration: "1-2 weeks",
            tasks: ["Excavation", "Utility marking", "Site access preparation"],
            requirements: ["Permits approved", "Utility clearance", "Equipment access"]
          },
          {
            phase: "Pool Shell Construction",
            duration: "2-3 weeks",
            tasks: ["Rebar placement", "Plumbing installation", "Concrete pour", "Shell curing"],
            requirements: ["Weather conditions", "Concrete delivery", "Plumbing materials"]
          },
          {
            phase: "Features & Finishes",
            duration: "2-4 weeks",
            tasks: poolSpecs.features.map(f => `Install ${f}`),
            requirements: ["Specialty materials", "Feature equipment", "Electrical work"]
          },
          {
            phase: "Final Details",
            duration: "1-2 weeks",
            tasks: ["Pool startup", "Water balancing", "Final inspection", "Owner training"],
            requirements: ["Final inspections", "Chemical supplies", "Equipment testing"]
          }
        ],
        materials: [
          {
            category: "Concrete & Structure",
            items: ["Reinforced concrete", "Rebar", "Waterproofing"],
            estimated_cost: "$15,000-$25,000"
          },
          {
            category: "Plumbing & Equipment",
            items: ["Pool pump", "Filter system", "Piping", "Skimmers"],
            estimated_cost: "$8,000-$15,000"
          },
          {
            category: "Finishes",
            items: ["Pool plaster", "Tile", "Coping", "Decking"],
            estimated_cost: "$10,000-$20,000"
          }
        ],
        permits: ["Building permit", "Electrical permit", "Pool construction permit"],
        timeline: `${8 + Math.floor(poolSpecs.features.length / 2)}-${12 + poolSpecs.features.length} weeks`
      };
      
      // Validate and use parsed data with fallbacks
      return {
        phases: Array.isArray(parsed.phases) ? parsed.phases : fallbackPlan.phases,
        materials: Array.isArray(parsed.materials) ? parsed.materials : fallbackPlan.materials,
        permits: Array.isArray(parsed.permits) ? parsed.permits : fallbackPlan.permits,
        timeline: parsed.timeline || fallbackPlan.timeline
      };
    } catch (parseError) {
      console.error('JSON parse error in generateConstructionPlan:', parseError);
      // Fallback construction plan
      return {
        phases: [
          {
            phase: "Site Preparation",
            duration: "1-2 weeks",
            tasks: ["Excavation", "Utility marking", "Site access preparation"],
            requirements: ["Permits approved", "Utility clearance", "Equipment access"]
          },
          {
            phase: "Pool Shell Construction",
            duration: "2-3 weeks",
            tasks: ["Rebar placement", "Plumbing installation", "Concrete pour", "Shell curing"],
            requirements: ["Weather conditions", "Concrete delivery", "Plumbing materials"]
          },
          {
            phase: "Features & Finishes",
            duration: "2-4 weeks",
            tasks: poolSpecs.features.map(f => `Install ${f}`),
            requirements: ["Specialty materials", "Feature equipment", "Electrical work"]
          },
          {
            phase: "Final Details",
            duration: "1-2 weeks",
            tasks: ["Pool startup", "Water balancing", "Final inspection", "Owner training"],
            requirements: ["Final inspections", "Chemical supplies", "Equipment testing"]
          }
        ],
        materials: [
          {
            category: "Concrete & Structure",
            items: ["Reinforced concrete", "Rebar", "Waterproofing"],
            estimated_cost: "$15,000-$25,000"
          },
          {
            category: "Plumbing & Equipment",
            items: ["Pool pump", "Filter system", "Piping", "Skimmers"],
            estimated_cost: "$8,000-$15,000"
          },
          {
            category: "Finishes",
            items: ["Pool plaster", "Tile", "Coping", "Decking"],
            estimated_cost: "$10,000-$20,000"
          }
        ],
        permits: ["Building permit", "Electrical permit", "Pool construction permit"],
        timeline: `${8 + Math.floor(poolSpecs.features.length / 2)}-${12 + poolSpecs.features.length} weeks`
      };
    }
  } catch (error) {
    console.error('Error generating construction plan:', error);
    throw new Error(`Failed to generate construction plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateTileImage(tileSpec: {
  type: string;
  color: string; 
  finish: string;
  material: string;
}): Promise<string> {
  try {
    const { type, color, finish, material } = tileSpec;
    
    // Professional pool tile photography prompts
    const prompt = `Professional product photography of ${color} ${material} ${type} tiles with ${finish} finish. High-quality pool tile close-up showing texture and surface detail. Commercial photography lighting, white background, sharp focus, realistic tile surface texture, professional pool industry catalog quality. Multiple tiles arranged in a grid pattern showing the tile pattern and grout lines. Studio lighting, macro detail, suitable for pool design catalog.`;

    console.log('Generating tile image with prompt:', prompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data?.[0]?.url) {
      throw new Error('No image URL returned from OpenAI');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating tile image:', error);
    throw new Error(`Failed to generate tile image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generatePoolDesign(request: PoolDesignRequest): Promise<PoolDesignResult> {
  try {
    // Create detailed prompt for pool design with specific feature descriptions
    const featureDescriptions = {
      'waterfall': 'one natural stone waterfall feature',
      'spa': 'one integrated circular spa attached to the pool',
      'lighting': 'LED pool lighting system',
      'heating': 'heated pool system',
      'tanning-ledge': 'one shallow tanning ledge area',
      'swim-up-bar': 'one swim-up bar counter area'
    };
    
    const featuresText = request.features.length > 0 
      ? ` featuring ${request.features.map(f => featureDescriptions[f as keyof typeof featureDescriptions] || f).join(', ')}` 
      : '';
    
    // Create style-specific material guidance
    const styleGuidance = {
      'modern': 'clean concrete coping, geometric lines, minimal landscaping with contemporary plants',
      'tropical': 'natural stone decking, organic curves, palm plants and tropical vegetation', 
      'natural': 'natural stone coping, organic materials, boulder accents, native landscaping',
      'luxury': 'premium travertine or natural stone, elegant proportions, sophisticated landscaping',
      'mediterranean': 'terracotta or natural stone, curved edges, Mediterranean plants',
      'contemporary': 'sleek concrete, angular design, modern outdoor furniture'
    };

    const materialGuidance = styleGuidance[request.style as keyof typeof styleGuidance] || 'natural materials, balanced proportions, practical landscaping';

    const prompt = `Realistic architectural pool design rendering of a ${request.poolShape} swimming pool, ${request.poolSize} size${featuresText}. Construction-ready visualization with ${materialGuidance}, accurate proportions, clear blue water, natural shadows, and buildable design. Aerial view at 45-degree angle showing actual constructible pool with realistic materials, proper scale, no fantasy elements. Professional pool contractor reference quality, achievable residential design.`;

    console.log('Generating pool design with prompt:', prompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data?.[0]?.url) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Calculate estimated cost based on features and size
    const baseCosts = {
      'small': 45000,
      'medium': 65000, 
      'large': 85000,
      'xl': 110000,
      'custom': 75000
    };

    const featureCosts = {
      'waterfall': 2500,
      'spa': 8000,
      'lighting': 800,
      'heating': 3500,
      'tanning-ledge': 2200,
      'swim-up-bar': 5000
    };

    const baseCost = baseCosts[request.poolSize as keyof typeof baseCosts] || 65000;
    console.log('Base cost for', request.poolSize, ':', baseCost);
    console.log('Features received:', request.features);
    
    const featureCost = request.features.reduce((total, feature) => {
      const cost = featureCosts[feature as keyof typeof featureCosts] || 0;
      console.log('Feature:', feature, 'Cost:', cost);
      return total + cost;
    }, 0);

    console.log('Total feature cost:', featureCost);
    const estimatedCost = baseCost + featureCost;
    console.log('Final estimated cost:', estimatedCost);

    // Calculate timeline based on complexity
    const baseWeeks = 8;
    const featureWeeks = Math.floor(request.features.length / 2);
    const totalWeeks = baseWeeks + featureWeeks;
    const timeline = `${totalWeeks}-${totalWeeks + 4} weeks`;

    return {
      imageUrl: response.data[0]!.url!,
      estimatedCost,
      timeline
    };
  } catch (error) {
    console.error('Error generating pool design:', error);
    throw new Error(`Failed to generate pool design: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}