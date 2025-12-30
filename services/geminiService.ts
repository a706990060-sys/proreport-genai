// 更新后的Gemini服务，调用后端API
import { ReferenceFile, GenerateContentRequest, RefineContentRequest } from '../types';
import { generateApi } from './apiClient';

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
    try {
        const request: GenerateContentRequest = {
            sectionTitle,
            requirement,
            userInputs,
            contentRefs,
            formatRefs,
            specRefs,
            knowledgeRefs,
            useSearch
        };
        return await generateApi.generateSection(request);
    } catch (error: any) {
        console.error("Generation Failed:", error);
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
    try {
        const request: RefineContentRequest = {
            sectionTitle,
            selectedText,
            fullCurrentHtml,
            userInstruction,
            contentRefs,
            formatRefs,
            specRefs,
            knowledgeRefs,
            useSearch
        };
        return await generateApi.refineSection(request);
    } catch (error: any) {
        console.error("Refinement Failed:", error);
        return fullCurrentHtml;
    }
};
