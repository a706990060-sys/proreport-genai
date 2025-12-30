
import { GoogleGenAI } from "@google/genai";
import { ReferenceFile } from "../types";

const SYSTEM_INSTRUCTION = `
**Role**: You are a world-class Engineering Consulting Expert and Lead Technical Writer. You are tasked with generating or refining sections of a professional Feasibility Study Report (FSR).

**Strategic Writing Rules**:
1. **Structural Analysis (Format Reference)**: When a "Format Reference" is provided, you must perform a structural audit. Identify:
   - Heading hierarchy (e.g., how H2, H3, H4 are nested).
   - Paragraph styles and indentation logic.
   - List formats (bulleted, numbered, sub-lists).
   - Usage of tables (frequency and layout).
   - The specific linguistic "template" of opening and closing statements.
   **CRITICAL**: Replicate this structure and style EXACTLY, but DO NOT use any factual content or text from these files.
2. **Rule Adherence (Specification Reference)**: Treat "Specification References" as mandatory legal and technical constraints. You MUST:
   - Use the exact terminology defined within.
   - Comply with all listed limits, parameters, and standards.
   - Ensure the generated content violates no rules set by these documents.
3. **Factual Grounding (Content Reference)**: Use "Content References" as the primary source of truth for project facts, descriptions, and data.
4. **Tone**: Professional, objective, third-person engineering consultant tone.
5. **Content Depth & Length**: **CRITICAL**: The content MUST be detailed, comprehensive, and exhaustive. 
   - **AVOID summaries**. Do not write high-level overviews. 
   - **EXPAND** on every point with technical details, reasoning, justifications, calculation processes, and analysis.
   - Each section must be substantial in length and depth, suitable for a formal government or bank submission. 
   - If data is missing, make reasonable professional assumptions based on industry standards to ensure the text flow is complete (while marking distinct assumptions).
6. **Output Format**: Strictly valid HTML body content (do not include <html>, <head> or <body> tags). Do not use Markdown code blocks.
   - **Heading Hierarchy (Strict Official Document Standard)**:
     The content you generate sits within a "Section" (节). You must structure the internal content using the following specific numbering and tag mapping:
     - **Tier 1 (use <h3>)**: Chinese Number + Pause Mark (e.g., <h3>一、项目建设背景</h3>)
     - **Tier 2 (use <h4>)**: Parenthesized Chinese Number (e.g., <h4>（一）政策环境分析</h4>)
     - **Tier 3 (use <h5>)**: Arabic Number + Pause Mark (e.g., <h5>1、国家政策支持</h5>)
     - **Tier 4 (use <h6>)**: Parenthesized Arabic Number (e.g., <h6>（1）十四五规划</h6>)
     - **Paragraphs (<p>)**: Standard text.
   - Do not skip levels in the hierarchy.
   - Ensure all lists are properly formatted using semantic HTML.
7. **Language**: Simplified Chinese (zh-CN).
`;

const formatSources = (response: any): string => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks || chunks.length === 0) return "";
  let html = `<div class="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 source-section"><p class="font-bold mb-2">参考来源 (Sources):</p><ul class="list-disc pl-4 space-y-1">`;
  let hasValidSource = false;
  chunks.forEach((c: any) => {
    if (c.web?.uri) {
      hasValidSource = true;
      html += `<li><a href="${c.web.uri}" target="_blank" class="text-blue-600 hover:underline">${c.web.title || c.web.uri}</a></li>`;
    }
  });
  html += `</ul></div>`;
  return hasValidSource ? html : "";
};

const cleanResponse = (text: string | undefined): string => {
    if (!text) return "";
    // Remove Markdown code block syntax if the model includes it, capturing the content inside
    // This handles ```html ... ```, ``` ... ```, or just the text
    let cleaned = text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '');
    // Remove trailing code block syntax
    cleaned = cleaned.replace(/```\s*$/, '');
    return cleaned.trim();
};

/**
 * Prepares the multi-modal parts and the specific prompt instructions for different reference types.
 */
const prepareReferenceContext = (
  contentRefs: ReferenceFile[],
  formatRefs: ReferenceFile[],
  specRefs: ReferenceFile[],
  knowledgeRefs: ReferenceFile[],
  parts: any[]
): string => {
  let instructions = "";

  // 1. Format References - The "Skeleton"
  if (formatRefs.length > 0) {
    instructions += "\n\n### 【格式参考：结构化解析指令】";
    formatRefs.forEach(ref => {
      parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
      instructions += `
- 目标文件: "${ref.name}"
- 解析重点：提取 Markdown/HTML 标题层级(H1/H2/H3)、段落缩进、列表样式、表格样式、以及引言和结论的叙述风格。
- **严禁事项：严禁参考该文件内的具体数据、事实或业务内容。仅将其作为排版和结构模板。**`;
    });
  }

  // 2. Specification References - The "Law"
  if (specRefs.length > 0) {
    instructions += "\n\n### 【规范参考：强制执行指令】";
    specRefs.forEach(ref => {
      parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
      instructions += `
- 目标规范: "${ref.name}"
- 任务：深度分析此文件中的规定、术语和限制条件。编写内容必须严格符合其中的所有技术标准、强制性要求和专用术语定义。这是编写的红线约束。`;
    });
  }

  // 3. Content References - The "Facts"
  if (contentRefs.length > 0) {
    instructions += "\n\n### 【内容参考：事实挖掘指令】";
    contentRefs.forEach(ref => {
      if (ref.mimeType === 'text/url') {
        instructions += `\n- 网页链接: ${ref.data}。从中提取核心项目描述、现状数据及事实背景。`;
      } else {
        parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
        instructions += `\n- 数据文件: "${ref.name}"。将其中的文字、图表信息作为报告的血肉，提供具体的项目支撑。`;
      }
    });
  }

  // 4. Knowledge/Context
  if (knowledgeRefs.length > 0) {
    instructions += "\n\n### 【额外知识库】";
    knowledgeRefs.forEach(ref => {
      if (ref.mimeType !== 'text/url') parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
      instructions += `\n- 知识点: "${ref.name}"。作为通用行业背景支持。`;
    });
  }

  return instructions;
};

export const generateSectionContent = async (
  sectionTitle: string, 
  requirement: string, 
  userInputs: string,
  contentRefs: ReferenceFile[] = [],
  formatRefs: ReferenceFile[] = [],
  specRefs: ReferenceFile[] = [],
  knowledgeRefs: ReferenceFile[] = [],
  useSearch: boolean = false
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [];
  
  const refPrompt = prepareReferenceContext(contentRefs, formatRefs, specRefs, knowledgeRefs, parts);

  const finalPrompt = `
[报告编写任务]
章节： "${sectionTitle}"

[大纲要求]
${requirement}

[项目概况与核心指示]
${userInputs}

${refPrompt}

[最终产出准则]
- **深度要求：内容必须极为详尽，严禁生成空洞的摘要。每一个论点都需要有充分的论据、数据或逻辑支撑。请尽可能多地生成相关细节。**
- **篇幅要求：请充分展开论述，不要吝啬字数。对于每一个子话题，都要深入挖掘。**
- **标题格式强制要求**：
  - 内容层级必须遵循公文标准：
  - 第一级标题使用 "一、" (用 <h3> 标签)
  - 第二级标题使用 "（一）" (用 <h4> 标签)
  - 第三级标题使用 "1、" (用 <h5> 标签)
  - 第四级标题使用 "（1）" (用 <h6> 标签)
- 输出必须为纯 HTML 格式。
- 不要使用 Markdown 代码块符号。
- 逻辑需符合专业工程咨询标准。
- 如果存在“格式参考”，其标题分级和排版逻辑必须被复刻。
- 如果存在“规范参考”，其术语和限制条件必须被无条件遵守。
- 数据内容必须源自“内容参考”和“项目概况”。
`;

  parts.push({ text: finalPrompt });

  try {
    const config: any = { 
      systemInstruction: SYSTEM_INSTRUCTION, 
      temperature: 0.3, // Slightly increased to encourage longer, more elaborated responses
      topK: 30,
      topP: 0.95
    };
    if (useSearch) config.tools = [{ googleSearch: {} }];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: parts },
      config: config
    });

    const rawText = response.text || "";
    return cleanResponse(rawText) + (useSearch ? formatSources(response) : "");
  } catch (error: any) {
    console.error("Gemini Generation Failed:", error);
    return `<div class="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg"><strong>生成中断:</strong> ${error.message || "未知API错误"}</div>`;
  }
};

export const refineSectionContent = async (
  sectionTitle: string,
  selectedText: string,
  fullCurrentHtml: string,
  userInstruction: string,
  contentRefs: ReferenceFile[] = [],
  formatRefs: ReferenceFile[] = [],
  specRefs: ReferenceFile[] = [],
  knowledgeRefs: ReferenceFile[] = [],
  useSearch: boolean = false
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [];
  
  const refPrompt = prepareReferenceContext(contentRefs, formatRefs, specRefs, knowledgeRefs, parts);

  const finalPrompt = `
[内容修补/扩写任务]
目标章节： "${sectionTitle}"

[当前全篇内容]
"""
${fullCurrentHtml}
"""

[待修改/优化片段]
"${selectedText}"

[修改指示]
"${userInstruction}"

${refPrompt}

[任务说明]
请基于以上指示和最新的参考资料，重写或扩写选中的片段。输出必须包含该章节完整的、更新后的 HTML 代码。
**特别强调：如果指示中包含“扩写”、“详细”等词汇，请大幅增加内容的深度和广度，补充专业细节。**
**格式要求**：严格遵守公文标题层级（<h3>一、...</h3>, <h4>（一）...</h4>, <h5>1、...</h5>, <h6>（1）...</h6>）。
只输出 HTML，不要输出 Markdown 标记。
`;

  parts.push({ text: finalPrompt });

  try {
    const config: any = { 
      systemInstruction: SYSTEM_INSTRUCTION, 
      temperature: 0.3 
    };
    if (useSearch) config.tools = [{ googleSearch: {} }];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: parts },
      config: config
    });

    return cleanResponse(response.text) || fullCurrentHtml;
  } catch (error: any) {
    console.error("Gemini Refinement Failed:", error);
    return fullCurrentHtml; 
  }
};
