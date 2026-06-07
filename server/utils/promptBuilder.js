/**
 * Builds a mode-specific prompt based on content_type and business profile.
 */
exports.buildMarketingPrompt = (profile, inputParams) => {
  const {
    content_type,
    platform,
    tone,
    topic,
    keywords,
    word_count
  } = inputParams;

  const {
    business_name,
    industry,
    product_service_description,
    target_audience,
    brand_tone,
    marketing_goal
  } = profile;

  const effectiveTone = tone || brand_tone || 'professional';

  const companyContext =
    `### Company Context:\n` +
    `- Company: ${business_name}\n` +
    `- Industry: ${industry || 'N/A'}\n` +
    `- Product/Service: ${product_service_description || 'N/A'}\n` +
    `- Target Audience: ${target_audience || 'N/A'}\n` +
    `- Marketing Goal: ${marketing_goal || 'N/A'}\n`;

  if (content_type === 'Sales Reply') {
    let prompt = `You are a professional sales assistant for ${business_name}.\n\n`;
    prompt += companyContext;
    prompt += `\n### Task:\n`;
    prompt += `Write a professional sales response to the following:\n`;
    prompt += `"${topic}"\n\n`;
    prompt += `- Tone: ${effectiveTone}\n`;
    prompt += `- Be helpful, direct, and focused on value.\n`;
    prompt += `- Reference the company's products or services when relevant.\n`;
    prompt += `- Do not be pushy or overly salesy.\n`;
    if (keywords) {
      prompt += `- Incorporate these keywords naturally: ${keywords}\n`;
    }
    if (word_count) {
      prompt += `- Approximate word count: ${word_count} words\n`;
    }
    prompt += `\nReturn only the final sales response. No extra explanation.`;
    return prompt;
  }

  if (content_type === 'Internal Knowledge Query') {
    let prompt = `You are an internal knowledge assistant for ${business_name}.\n\n`;
    prompt += companyContext;
    prompt += `\n### Task:\n`;
    prompt += `Answer the following internal question using the company context above:\n`;
    prompt += `"${topic}"\n\n`;
    prompt += `- Be clear, accurate, and helpful.\n`;
    prompt += `- Use the company context to ground your answer.\n`;
    prompt += `- If the question is outside the provided context, say so honestly.\n`;
    if (keywords) {
      prompt += `- Reference these topics if relevant: ${keywords}\n`;
    }
    prompt += `\nReturn only the answer. No extra explanation.`;
    return prompt;
  }

  if (content_type === 'LinkedIn Comment Reply') {
    let prompt = `You are a LinkedIn engagement specialist for ${business_name}.\n\n`;
    prompt += companyContext;
    prompt += `\n### Task:\n`;
    prompt += `Write a professional LinkedIn reply to the following comment or post:\n`;
    prompt += `"${topic}"\n\n`;
    prompt += `- Tone: ${effectiveTone}\n`;
    prompt += `- Keep the reply between 30-70 words.\n`;
    prompt += `- Be professional, human, and concise.\n`;
    prompt += `- Do not include hashtags or emojis.\n`;
    prompt += `- Mention ${business_name} only if it fits naturally.\n`;
    prompt += `\nReturn only the reply. No extra explanation.`;
    return prompt;
  }

  // Default: LinkedIn Post and other marketing content types
  let prompt = `You are an expert AI marketing copywriter. Create a ${content_type} for ${platform}.\n\n`;
  prompt += companyContext;
  prompt += `\n### Content Requirements:\n`;
  prompt += `- Topic: ${topic}\n`;
  prompt += `- Tone of Voice: ${effectiveTone}\n`;
  if (keywords) {
    prompt += `- Keywords to include: ${keywords}\n`;
  }
  if (word_count) {
    prompt += `- Approximate word count: ${word_count} words\n`;
  }
  prompt += `\nProvide only the finalized content ready for publishing. Do not include extra conversational text.`;

  return prompt;
};
