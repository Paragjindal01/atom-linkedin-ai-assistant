const { OpenAI } = require('openai');

exports.generateContent = async (prompt, contentType) => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is missing. Add it to server/.env to generate AI content.");
    error.code = 'OPENAI_KEY_MISSING';
    throw error;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemMessage = buildSystemMessage(contentType);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    throw new Error("Failed to generate content from AI service.");
  }
};

function buildSystemMessage(contentType) {
  const baseContext =
    `You are Atom, AltaAI's internal AI assistant for sales, marketing, LinkedIn engagement, and company knowledge.\n\n` +
    `AltaAI company context:\n` +
    `AltaAI is an AI company focused on infrastructure orchestration, GPU clusters, fibre fabric, data centres, telecom, deployment clarity, and execution. We help teams reduce delays, improve clarity, and move from design to real-world execution faster.\n\n` +
    `Output requirements:\n` +
    `- Make content sound human, technical, and executive-level.\n` +
    `- STRICTLY AVOID generic phrases like "fast-paced digital landscape", "innovative approach", "unlock new possibilities".\n` +
    `- STRICTLY AVOID the word "skyrocketing".\n` +
    `- Avoid sounding robotic.\n` +
    `- Return only the final response or content. No extra explanation or conversational text.\n`;

  if (contentType === 'Sales Reply') {
    return baseContext +
      `\nYou are acting as AltaAI's sales assistant.\n` +
      `- Write professional, value-driven sales responses.\n` +
      `- Be direct and helpful without being pushy.\n` +
      `- Reference AltaAI's capabilities in infrastructure orchestration, AI compute, data centres, and telecom when relevant.\n` +
      `- Keep responses concise and actionable.\n`;
  }

  if (contentType === 'Internal Knowledge Query') {
    return baseContext +
      `\nYou are acting as AltaAI's internal knowledge assistant.\n` +
      `- Answer questions using the provided company context.\n` +
      `- Be accurate, clear, and helpful.\n` +
      `- If a question falls outside the provided context, state that honestly.\n` +
      `- Do not fabricate information.\n`;
  }

  if (contentType === 'LinkedIn Comment Reply') {
    return baseContext +
      `\nYou are generating a LinkedIn comment reply for AltaAI.\n` +
      `- Keep reply between 30-70 words.\n` +
      `- Be professional, human, and concise.\n` +
      `- DO NOT include hashtags or emojis.\n` +
      `- Avoid salesy phrases like "Let's explore".\n` +
      `- Mention AltaAI only if it fits naturally.\n` +
      `- Reference infrastructure, orchestration, AI compute, telecom, data centres, or deployment ONLY when relevant.\n`;
  }

  // LinkedIn Post and other marketing content
  return baseContext +
    `\nYou are generating LinkedIn and marketing content for AltaAI.\n` +
    `- Focus on: infrastructure orchestration, GPU clusters, fibre fabric, data centres, telecom, deployment clarity, and execution.\n` +
    `- Use short paragraphs optimized for LinkedIn.\n` +
    `- Start with a sharp hook.\n` +
    `- End with a thoughtful CTA or closing insight.\n` +
    `- Hashtags MUST use clean capitalization: #AIInfrastructure #DataCentres #Telecom #GPUClusters #InfrastructureOrchestration #AltaAI\n` +
    `- Maximum 1 emoji per post, or none at all.\n` +
    `- Keep tone aligned with selected tone.\n` +
    `- Respect word_count as closely as possible.\n`;
}
