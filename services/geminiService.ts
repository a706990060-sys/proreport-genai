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
        console.log('generateSectionContent: 开始调用API', {
            sectionTitle,
            requirementLength: requirement?.length || 0,
            userInputsLength: userInputs?.length || 0,
            contentRefsCount: contentRefs?.length || 0,
            formatRefsCount: formatRefs?.length || 0,
            specRefsCount: specRefs?.length || 0,
            knowledgeRefsCount: knowledgeRefs?.length || 0,
            useSearch
        });
        
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
        
        const result = await generateApi.generateSection(request);
        console.log('generateSectionContent: API调用成功，返回内容长度:', result?.length || 0);
        return result;
    } catch (error: any) {
        console.error("generateSectionContent: API调用失败", error);
        // 抛出错误，让上层处理
        const errorMessage = error?.message || error?.error || error?.toString() || "未知API错误";
        throw new Error(`生成失败: ${errorMessage}`);
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
        console.log('refineSectionContent: 开始调用API', {
            sectionTitle,
            selectedTextLength: selectedText?.length || 0,
            fullCurrentHtmlLength: fullCurrentHtml?.length || 0,
            userInstructionLength: userInstruction?.length || 0,
            contentRefsCount: contentRefs?.length || 0,
            formatRefsCount: formatRefs?.length || 0,
            specRefsCount: specRefs?.length || 0,
            knowledgeRefsCount: knowledgeRefs?.length || 0,
            useSearch
        });
        
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
        
        const result = await generateApi.refineSection(request);
        console.log('refineSectionContent: API调用成功，返回内容长度:', result?.length || 0);
        return result;
    } catch (error: any) {
        console.error("refineSectionContent: API调用失败", error);
        // 抛出错误，让上层处理
        const errorMessage = error?.message || error?.error || error?.toString() || "未知API错误";
        throw new Error(`修改失败: ${errorMessage}`);
    }
};
