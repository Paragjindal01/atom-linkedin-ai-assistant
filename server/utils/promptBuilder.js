/**
 * Builds a prompt for the AI based on the provided inputs and business profile.
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

  // Use input tone if provided, otherwise fallback to brand tone
  const effectiveTone = tone || brand_tone || 'professional';
  
  let prompt = `You are an expert AI marketing copywriter. Create a ${content_type} for ${platform}.\n\n`;
  
  prompt += `### Business Context:\n`;
  prompt += `- Business Name: ${business_name}\n`;
  prompt += `- Industry: ${industry || 'N/A'}\n`;
  prompt += `- Product/Service: ${product_service_description || 'N/A'}\n`;
  prompt += `- Target Audience: ${target_audience || 'N/A'}\n`;
  prompt += `- Marketing Goal: ${marketing_goal || 'N/A'}\n\n`;

  prompt += `### Content Requirements:\n`;
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
