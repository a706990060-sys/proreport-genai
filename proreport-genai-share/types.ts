
export interface SubSection {
    id: string;
    title: string;
    req: string;
    children?: SubSection[];
}

export interface Chapter {
    title: string;
    subsections: SubSection[];
}

export interface ReportData {
    [key: string]: string;
}

export interface ReferenceGroup {
    id: string;
    name: string;
    type: 'builtin' | 'custom';
    parentId?: string; // ID of the parent built-in group (e.g., 'lib-content')
}

export interface ReferenceFile {
    id: string;
    name: string;
    data: string; // Base64 encoded data (raw, without prefix)
    mimeType: string;
    groupId: string;
    lastModified: number;
}

export interface SectionRefs {
    content?: ReferenceFile[];
    format?: ReferenceFile[];
    specification?: ReferenceFile[];
    knowledge?: ReferenceFile[];
}

export interface ReferenceData {
    [key: string]: SectionRefs;
}

export type ReferenceType = 'content' | 'format' | 'specification' | 'knowledge';

export type GenerationMode = 'create' | 'modify';

export interface SelectionState {
    text: string;
    range: Range | null;
}

export interface ProjectVersion {
    id: string;
    timestamp: number;
    reason: string;
    reportData: ReportData;
    description: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    outline: Chapter[]; // Added: Support for custom outlines per project
    reportData: ReportData;
    referenceData: ReferenceData;
    isLocked: boolean;
    lastModified: number;
    history: ProjectVersion[];
}
