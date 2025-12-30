import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { STANDARD_TEMPLATE } from './constants';
import { SubSection, ReportData, SelectionState, ReferenceData, ReferenceFile, SectionRefs, ReferenceGroup, ReferenceType, Project, ProjectVersion, Chapter, User } from './types';
import { generateSectionContent, refineSectionContent } from './services/geminiService';
import { getCurrentUser, logoutUser } from './services/authService';
import { projectApi, libraryApi } from './services/apiClient';
import LoginView from './components/LoginView';

// --- Icons Component ---
const Icons = {
    Logo: () => <span className="text-2xl">📊</span>,
    File: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    Library: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10"></path></svg>,
    Link: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>,
    Image: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    Settings: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    Magic: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    Send: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
    Export: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>,
    Requirement: () => <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>,
    Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
    Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>,
    Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>,
    Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
    Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
    Format: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>,
    ChevronDown: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>,
    ChevronRight: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>,
    History: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Restore: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>,
    Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
    Folder: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>,
    FolderMove: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9m-9-4h7m-7-4h5M3 7v10a2 2 0 002 2h6l2-2H5a2 2 0 00-2 2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    Play: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Doc: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
    Pdf: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    Lock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
    Unlock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2z"></path></svg>,
    Globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>,
    Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>,
};

// --- Helper Functions ---
const getWordCount = (html: string) => (html || "").replace(/<[^>]*>/g, '').trim().length;

const safeDecode = (base64: string) => {
    try {
        return decodeURIComponent(escape(window.atob(base64)));
    } catch (e) {
        try {
            return window.atob(base64);
        } catch (e2) {
            return "Unable to decode file content.";
        }
    }
};

// --- Sub-components ---
const MenuButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, rightIcon?: React.ReactNode }> = ({ icon, label, onClick, rightIcon }) => (
    <button onClick={onClick} className="h-full px-4 flex items-center gap-2 hover:bg-slate-100/80 rounded-xl transition-all text-sm font-medium text-slate-600 hover:text-slate-900 mx-1">
        {icon}
        <span>{label}</span>
        {rightIcon}
    </button>
);

const FormatStatusButton: React.FC<{ files?: ReferenceFile[], onUpload: () => void, onClearAll: () => void }> = ({ files = [], onUpload, onClearAll }) => (
    <div className="flex items-center gap-1">
        {files.length > 0 ? (
            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 text-[10px] shadow-sm">
                <Icons.Format />
                <span className="font-bold">{files.length}</span>
                <button onClick={(e) => { e.stopPropagation(); onClearAll(); }} className="hover:text-red-500 ml-1"><Icons.Close /></button>
            </div>
        ) : (
            <button onClick={(e) => { e.stopPropagation(); onUpload(); }} className="text-gray-300 hover:text-blue-500 p-1 hover:bg-gray-100 rounded-lg transition"><Icons.Format /></button>
        )}
    </div>
);

const RefSlot: React.FC<{ 
    type: ReferenceType, 
    label: string, 
    files?: ReferenceFile[], 
    onRemoveFile: (id: string) => void,
    onLibrary: () => void, 
    onUpload: (e: any) => void, 
    onLink: () => void,
    onPreview: (file: ReferenceFile) => void,
    color: string 
}> = ({ label, files = [], onRemoveFile, onLibrary, onUpload, onLink, onPreview, color }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const badgeColor = color === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700';

    return (
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badgeColor}`}>{label}</span>
            </div>
            
            {files.length > 0 && (
                <div className="space-y-2 mb-4">
                    {files.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-3 truncate flex-1 min-w-0 cursor-pointer" onClick={() => onPreview(file)}>
                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                                    {file.mimeType.startsWith('image/') ? <Icons.Image /> : file.mimeType === 'text/url' ? <Icons.Link /> : <Icons.File />}
                                </div>
                                <span className="text-xs truncate font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{file.name}</span>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onPreview(file)} className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-white transition" title="预览"><Icons.Eye /></button>
                                <button onClick={() => onRemoveFile(file.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white ml-1 transition"><Icons.Close /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-3">
                <button onClick={onLibrary} className="flex flex-col items-center justify-center py-3 px-2 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md hover:shadow-blue-500/10 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="mb-1 text-slate-400 group-hover:scale-110 transition-transform"><Icons.Library /></div>
                    <span className="text-[10px] font-bold">资料库</span>
                </button>
                <button onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center py-3 px-2 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md hover:shadow-blue-500/10 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="mb-1 text-slate-400 group-hover:scale-110 transition-transform"><Icons.Upload /></div>
                    <span className="text-[10px] font-bold">上传</span>
                </button>
                <input type="file" ref={inputRef} onChange={onUpload} className="hidden" accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.webp,.csv,.json" />
                <button onClick={onLink} className="flex flex-col items-center justify-center py-3 px-2 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md hover:shadow-blue-500/10 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="mb-1 text-slate-400 group-hover:scale-110 transition-transform"><Icons.Link /></div>
                    <span className="text-[10px] font-bold">链接</span>
                </button>
            </div>
        </div>
    );
};

type AppView = 'cover' | 'login' | 'dashboard' | 'workspace' | 'outline-editor';
type FormatMode = 'default' | 'pro';
type SidebarTab = 'info' | 'outline';

const BUILT_IN_GROUPS: ReferenceGroup[] = [
    { id: 'lib-content', name: '内容参考 (Content)', type: 'builtin' },
    { id: 'lib-spec', name: '规范参考 (Specification)', type: 'builtin' },
    { id: 'lib-format', name: '格式参考 (Format)', type: 'builtin' }
];

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState<AppView>('cover');
    const [activeSection, setActiveSection] = useState<SubSection | null>(null);
    const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('info');
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [isProjectListOpen, setIsProjectListOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [reportData, setReportData] = useState<ReportData>({});
    const [referenceData, setReferenceData] = useState<ReferenceData>({});
    const [projectInfo, setProjectInfo] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectOutline, setProjectOutline] = useState<Chapter[]>(STANDARD_TEMPLATE);
    const [isProjectInfoLocked, setIsProjectInfoLocked] = useState(false);
    const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
    const [formatUploadTargetId, setFormatUploadTargetId] = useState<string | null>(null);
    const [newProjectNameInput, setNewProjectNameInput] = useState("");
    const [newProjectDescInput, setNewProjectDescInput] = useState("");
    const [isOutlineCreatorOpen, setIsOutlineCreatorOpen] = useState(false);
    const [editingOutline, setEditingOutline] = useState<Chapter[]>([]);
    const reportDataRef = useRef(reportData);
    const projectInfoRef = useRef(projectInfo);
    const [libraryFiles, setLibraryFiles] = useState<ReferenceFile[]>([]);
    const [customGroups, setCustomGroups] = useState<ReferenceGroup[]>([]);
    const [activeGroupId, setActiveGroupId] = useState<string>('lib-content');
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [batchProgress, setBatchProgress] = useState<{current: number, total: number, status: string} | null>(null);
    const stopBatchRef = useRef(false);
    const [selectionState, setSelectionState] = useState<SelectionState | null>(null);
    const [isPrintMode, setIsPrintMode] = useState(false);
    const [formatMode, setFormatMode] = useState<FormatMode>('pro'); 
    const [showFormatMenu, setShowFormatMenu] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [libraryTarget, setLibraryTarget] = useState<ReferenceType | null>(null);
    const [librarySearch, setLibrarySearch] = useState("");
    const [movingItem, setMovingItem] = useState<{ type: 'file' | 'group', data: any } | null>(null);
    const [isClearAllConfirming, setIsClearAllConfirming] = useState(false);
    const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set(['lib-content', 'lib-spec', 'lib-format']));
    
    // Preview Modal State
    const [previewFile, setPreviewFile] = useState<ReferenceFile | null>(null);

    // Link Modal State
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkInput, setLinkInput] = useState("");
    const [linkTargetInfo, setLinkTargetInfo] = useState<{ groupId?: string, sectionId?: string } | null>(null);
    const [linkError, setLinkError] = useState("");

    // Create Group Modal State
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [newGroupNameInput, setNewGroupNameInput] = useState("");
    const [groupCreationParentId, setGroupCreationParentId] = useState<string | null>(null);

    // Rename Group Modal State
    const [isRenameGroupModalOpen, setIsRenameGroupModalOpen] = useState(false);
    const [renameGroupInput, setRenameGroupInput] = useState("");
    const [groupToRename, setGroupToRename] = useState<ReferenceGroup | null>(null);

    // Delete Group Confirmation State
    const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<ReferenceGroup | null>(null);

    // --- Computed Values ---
    const currentProject = useMemo(() => projects.find(p => p.id === currentProjectId), [projects, currentProjectId]);
    const currentSectionWordCount = useMemo(() => activeSection ? getWordCount(reportData[activeSection.id] || "") : 0, [activeSection, reportData]);
    const selectionWordCount = useMemo(() => selectionState ? selectionState.text.trim().length : 0, [selectionState]);

    // 检查用户登录状态
    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();
            if (user) {
                setCurrentUser(user);
                setIsAuthenticated(true);
                await loadUserData();
            } else {
                setIsAuthenticated(false);
                // 清除可能存在的无效token
                localStorage.removeItem('auth_token');
            }
        };
        checkAuth();
        
        // 监听认证过期事件
        const handleAuthExpired = (event: Event) => {
            // 检查是否正在登录/注册流程中
            const isInAuthFlow = currentView === 'login' || currentView === 'cover';
            if (isInAuthFlow) {
                // 如果在登录流程中，不显示弹窗
                return;
            }
            
            setIsAuthenticated(false);
            setCurrentUser(null);
            setCurrentView('login');
            // 延迟显示弹窗，避免与注册流程冲突
            setTimeout(() => {
                alert('登录已过期，请重新登录');
            }, 500);
        };
        
        window.addEventListener('auth-expired', handleAuthExpired);
        return () => {
            window.removeEventListener('auth-expired', handleAuthExpired);
        };
    }, []);

    // 加载用户数据
    const loadUserData = async () => {
        try {
            // 检查是否有token
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.warn('没有token，跳过加载数据');
                return;
            }

            // 加载项目
            const projects = await projectApi.getAll();
            setProjects(projects);

            // 加载资料库文件
            const files = await libraryApi.getFiles();
            const migrated = files.map((f: ReferenceFile) => {
                const safeId = (f.id && f.id !== 'undefined') ? f.id : 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                return { ...f, id: safeId, groupId: f.groupId || 'lib-content' };
            });
            setLibraryFiles(migrated);

            // 加载自定义分组
            const groups = await libraryApi.getGroups();
            setCustomGroups(groups);
        } catch (error: any) {
            console.error('加载数据失败:', error);
            // 如果是认证错误，但不显示弹窗（可能是刚注册后的临时问题）
            const errorMsg = error?.message || error?.toString() || '';
            if (errorMsg.includes('无效的认证令牌') || errorMsg.includes('登录已过期')) {
                // 静默处理，不触发auth-expired事件
                console.warn('加载数据时遇到认证错误，可能是token还未生效');
                return;
            }
            // 其他错误可以正常处理
        }
    };

    // 处理登录成功
    const handleLoginSuccess = async (user: User) => {
        console.log('登录成功，用户:', user);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // 验证token是否正确保存
        const token = localStorage.getItem('auth_token');
        console.log('登录后token检查:', token ? `存在(${token.length}字符)` : '不存在');
        
        if (!token) {
            console.error('登录成功但token未保存，可能需要重新登录');
            alert('登录状态异常，请重新登录');
            setCurrentView('login');
            return;
        }
        
        // 延迟一下再加载数据，确保token已完全生效
        setTimeout(async () => {
            try {
                await loadUserData();
            } catch (error) {
                console.error('加载用户数据失败:', error);
                // 如果是认证错误，可能是token还没生效，再试一次
                if (error && typeof error === 'object' && 'message' in error) {
                    const errorMsg = (error as any).message || '';
                    if (errorMsg.includes('无效的认证令牌') || errorMsg.includes('登录已过期')) {
                        // 等待一下再重试
                        setTimeout(async () => {
                            try {
                                await loadUserData();
                            } catch (retryError) {
                                console.error('重试加载数据失败:', retryError);
                            }
                        }, 500);
                        return;
                    }
                }
            }
        }, 100);
        setCurrentView('dashboard');
    };

    // 处理登出
    const handleLogout = () => {
        logoutUser();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setProjects([]);
        setLibraryFiles([]);
        setCustomGroups([]);
        setCurrentProjectId(null);
        setReportData({});
        setReferenceData({});
        setCurrentView('cover');
    };

    useEffect(() => {
        reportDataRef.current = reportData;
        projectInfoRef.current = projectInfo;
    }, [reportData, projectInfo]);

    useEffect(() => {
        if (!currentProjectId || currentView !== 'workspace') return;
        const timer = setInterval(() => { handleSaveVersion('自动保存'); }, 5 * 60 * 1000);
        return () => clearInterval(timer);
    }, [currentProjectId, currentView]);

    useEffect(() => { 
        if (!isAuthenticated) return;
        const saveFiles = async () => {
            try {
                await libraryApi.saveFiles(libraryFiles);
            } catch (e: any) {
                console.error("保存文件失败:", e);
            }
        };
        saveFiles();
    }, [libraryFiles, isAuthenticated]);
    
    useEffect(() => { 
        if (!isAuthenticated) return;
        const saveGroups = async () => {
            try {
                await libraryApi.saveGroups(customGroups);
            } catch (e) {
                console.error("保存分组失败:", e);
            }
        };
        saveGroups();
    }, [customGroups, isAuthenticated]);
    
    useEffect(() => {
        if (!currentProjectId || !isAuthenticated) return;
        const saveProject = async () => {
            const updated = projects.map(p => {
                if (p.id === currentProjectId) {
                    return { ...p, name: projectName, description: projectInfo, outline: projectOutline, reportData: reportData, referenceData: referenceData, isLocked: isProjectInfoLocked, lastModified: Date.now() };
                }
                return p;
            });
            try {
                const currentProject = updated.find(p => p.id === currentProjectId);
                if (currentProject) {
                    await projectApi.update(currentProjectId, currentProject);
                    setProjects(updated);
                }
            } catch (e) {
                console.error("保存项目失败:", e);
            }
        };
        saveProject();
    }, [reportData, referenceData, projectInfo, projectName, projectOutline, isProjectInfoLocked, currentProjectId, isAuthenticated]);

    const loadProject = (project: Project) => {
        setCurrentProjectId(project.id);
        setProjectName(project.name);
        setProjectInfo(project.description);
        const outline = project.outline && project.outline.length > 0 ? project.outline : STANDARD_TEMPLATE;
        setProjectOutline(outline);
        setReportData(project.reportData);
        setReferenceData(project.referenceData);
        setIsProjectInfoLocked(project.isLocked);
        setCurrentView('workspace');
        setIsProjectListOpen(false);
        setActiveSidebarTab(project.description ? 'outline' : 'info');
        if (outline.length > 0 && outline[0].subsections.length > 0) setActiveSection(outline[0].subsections[0]);
        else setActiveSection(null);
    };

    const handleSaveVersion = (reason: string = '手动保存') => {
        if (!currentProjectId) return;
        setProjects(prev => prev.map(p => {
            if (p.id === currentProjectId) {
                const newVersion: ProjectVersion = { id: Date.now().toString(), timestamp: Date.now(), reason, reportData: JSON.parse(JSON.stringify(reportDataRef.current)), description: projectInfoRef.current };
                const history = [newVersion, ...(p.history || [])].slice(0, 20);
                return { ...p, history };
            }
            return p;
        }));
    };

    const handleRestoreVersion = (version: ProjectVersion) => {
        if (!window.confirm(`确定恢复到 ${new Date(version.timestamp).toLocaleString()} 的版本吗？`)) return;
        setReportData(version.reportData);
        setProjectInfo(version.description);
        setIsHistoryOpen(false);
    };

    const startCreateProject = () => {
        if (!isAuthenticated) {
            setCurrentView('login');
            return;
        }
        setNewProjectNameInput(""); 
        setNewProjectDescInput(""); 
        setIsOutlineCreatorOpen(true);
    };
    
    const confirmCreateProject = async (useCustomOutline: boolean) => {
        if (!isAuthenticated) {
            alert('请先登录');
            setCurrentView('login');
            setIsOutlineCreatorOpen(false);
            return;
        }
        
        // 检查是否有token
        const token = localStorage.getItem('auth_token');
        console.log('创建项目 - 检查token:', token ? '存在' : '不存在', token ? token.substring(0, 20) + '...' : '');
        
        if (!token) {
            console.error('没有token，需要重新登录');
            setIsAuthenticated(false);
            setCurrentUser(null);
            setCurrentView('login');
            setIsOutlineCreatorOpen(false);
            alert('登录已过期，请重新登录');
            return;
        }
        
        try {
            const baseProject: Partial<Project> = { 
                name: newProjectNameInput.trim() || '未命名项目 ' + new Date().toLocaleDateString(), 
                description: newProjectDescInput, 
                outline: useCustomOutline ? [] : STANDARD_TEMPLATE, 
                reportData: {}, 
                referenceData: {}, 
                isLocked: false, 
                lastModified: Date.now(), 
                history: [] 
            };
            
            console.log('创建项目请求:', baseProject);
            const created = await projectApi.create(baseProject);
            
            if (created && created.id) {
                console.log('项目创建成功:', created);
                if (useCustomOutline) {
                    setEditingOutline([{ title: "第一章 概述", subsections: [{ id: "1-1", title: "第一节 项目概况", req: "请在此处输入大纲要求..." }] }]);
                    setCurrentProjectId(created.id);
                    setProjectName(created.name);
                    setProjectInfo(created.description || '');
                    setCurrentView('outline-editor');
                } else {
                    setProjects(prev => [created, ...prev]);
                    loadProject(created);
                }
                setIsOutlineCreatorOpen(false);
            } else {
                // 尝试获取更详细的错误信息
                const errorMsg = '创建项目失败，返回数据无效。请检查：\n1. 后端服务是否运行 (http://localhost:3001)\n2. 是否已登录\n3. 浏览器控制台是否有错误信息';
                alert(errorMsg);
                console.error('项目创建失败，返回值为null或无效:', created);
            }
        } catch (error: any) {
            console.error('创建项目错误:', error);
            const errorMsg = error.message || error.toString() || '未知错误';
            
            // 如果是认证错误，清除token并跳转到登录页
            if (errorMsg.includes('无效的认证令牌') || errorMsg.includes('登录已过期') || errorMsg.includes('未提供认证令牌')) {
                console.error('认证错误，清除token并跳转登录页');
                setIsAuthenticated(false);
                setCurrentUser(null);
                localStorage.removeItem('auth_token');
                setCurrentView('login');
                setIsOutlineCreatorOpen(false);
                // 不显示弹窗，因为已经在catch中处理了
                return;
            }
            
            alert(`创建项目失败: ${errorMsg}\n\n请检查：\n1. 后端服务是否运行\n2. 浏览器控制台是否有更多错误信息`);
        }
    };

    const finishOutlineEditing = async () => {
        try {
            const projectData: Partial<Project> = { 
                name: projectName, 
                description: projectInfo, 
                outline: editingOutline, 
                reportData: {}, 
                referenceData: {}, 
                isLocked: false, 
                lastModified: Date.now(), 
                history: [] 
            };
            const updated = await projectApi.update(currentProjectId!, projectData);
            if (updated) {
                setProjects(prev => {
                    const filtered = prev.filter(p => p.id !== currentProjectId);
                    return [updated, ...filtered];
                });
                loadProject(updated);
            }
        } catch (error) {
            alert('保存项目失败');
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm("确定删除此项目吗？")) return;
        try {
            await projectApi.delete(id);
            const remaining = projects.filter(p => p.id !== id);
            setProjects(remaining);
            if (currentProjectId === id) { setCurrentView('dashboard'); setCurrentProjectId(null); }
        } catch (error) {
            alert('删除项目失败');
        }
    };

    const handleBackToDashboard = () => { setCurrentView('dashboard'); setCurrentProjectId(null); };

    const addChapter = () => setEditingOutline(prev => [...prev, { title: "新章节", subsections: [] }]);
    const updateChapterTitle = (idx: number, title: string) => setEditingOutline(prev => { const next = [...prev]; next[idx].title = title; return next; });
    const deleteChapter = (idx: number) => { if(window.confirm("确定删除此章节吗？")) setEditingOutline(prev => prev.filter((_, i) => i !== idx)); };
    const addSubsection = (chapterIdx: number) => setEditingOutline(prev => { const next = [...prev]; const newId = `custom-${Date.now()}`; next[chapterIdx].subsections.push({ id: newId, title: "新小节", req: "请输入本节撰写要求..." }); return next; });
    const updateSubsection = (chapterIdx: number, subIdx: number, field: 'title' | 'req', value: string) => setEditingOutline(prev => { const next = [...prev]; const sub = next[chapterIdx].subsections[subIdx]; if (field === 'title') sub.title = value; else sub.req = value; return next; });
    const deleteSubsection = (chapterIdx: number, subIdx: number) => setEditingOutline(prev => { const next = [...prev]; next[chapterIdx].subsections.splice(subIdx, 1); return next; });

    const handleSectionSelect = (section: SubSection) => { setSelectionState(null); setInputValue(""); setIsClearAllConfirming(false); setActiveSection(section); };
    const toggleSectionExpand = (sectionId: string) => setExpandedSectionIds(prev => { const next = new Set(prev); if (next.has(sectionId)) next.delete(sectionId); else next.add(sectionId); return next; });
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const text = selection.toString();
            const editor = document.getElementById('output-editor');
            if (editor && editor.contains(range.commonAncestorContainer)) { setSelectionState({ text, range }); return; }
        }
    };
    const clearSelection = () => { setSelectionState(null); window.getSelection()?.removeAllRanges(); setInputValue(""); };

    const getSafeMimeType = (fileName: string, originalMime: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'application/pdf';
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        if (ext === 'txt') return 'text/plain';
        if (ext === 'md') return 'text/markdown';
        if (ext === 'csv') return 'text/csv';
        if (ext === 'json') return 'application/json';
        return originalMime || 'text/plain';
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetTypeKey?: string, specificSectionId?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // 1. LIMIT FILE SIZE (e.g., 5MB) to prevent freezing
        if (file.size > 5 * 1024 * 1024) {
            alert("文件过大！为了保证浏览器性能，请上传 5MB 以内的文件。");
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const result = event.target?.result as string;
                if (!result) return;
                
                const base64Data = result.split(',')[1];
                let mimeType = getSafeMimeType(file.name, result.split(';')[0].split(':')[1]);
                
                let gid = activeGroupId;
                if (targetTypeKey === 'lib-content' || targetTypeKey === 'lib-spec' || targetTypeKey === 'lib-format') {
                    gid = targetTypeKey;
                }

                const newFile: ReferenceFile = { id: 'file-' + Date.now(), name: file.name, data: base64Data, mimeType, groupId: gid, lastModified: file.lastModified };
                setLibraryFiles(prev => [...prev, newFile]);
                
                const targetId = specificSectionId || (activeSection ? activeSection.id : null);
                if (targetId && targetTypeKey) {
                     let type: ReferenceType | null = (targetTypeKey === 'lib-content') ? 'content' : (targetTypeKey === 'lib-spec') ? 'specification' : (targetTypeKey === 'lib-format') ? 'format' : 'knowledge';
                     if (type) {
                         setReferenceData(prev => ({
                            ...prev,
                            [targetId]: {
                                ...prev[targetId],
                                [type!]: [...(prev[targetId]?.[type!] || []), newFile]
                            }
                        }));
                     }
                }
            } catch (error) {
                console.error("Error reading file:", error);
                alert("读取文件失败，请重试");
            } finally {
                e.target.value = '';
            }
        };
        reader.onerror = () => {
            alert("读取文件出错");
            e.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    const openLinkModal = (targetGroup?: string, specificSectionId?: string) => {
        setLinkTargetInfo({ groupId: targetGroup, sectionId: specificSectionId });
        setLinkInput("");
        setLinkError("");
        setIsLinkModalOpen(true);
    };

    const confirmAddLink = () => {
        if (!linkInput.trim()) return;
        try { new URL(linkInput.trim()); } catch (e) { setLinkError("无效的 URL 格式"); return; }
        const gid = linkTargetInfo?.groupId || activeGroupId;
        const newRef: ReferenceFile = { id: 'link-' + Date.now(), name: '链接: ' + linkInput.trim(), data: linkInput.trim(), mimeType: 'text/url', groupId: gid, lastModified: Date.now() };
        setLibraryFiles(prev => [...prev, newRef]);
        
        const targetId = linkTargetInfo?.sectionId || (activeSection ? activeSection.id : null);
        if (targetId && linkTargetInfo?.groupId) {
             let type: ReferenceType | null = (linkTargetInfo.groupId === 'lib-content') ? 'content' : (linkTargetInfo.groupId === 'lib-spec') ? 'specification' : (linkTargetInfo.groupId === 'lib-format') ? 'format' : 'knowledge';
             if (type) {
                 setReferenceData(prev => ({
                    ...prev,
                    [targetId!]: {
                        ...prev[targetId!],
                        [type!]: [...(prev[targetId!]?.[type!] || []), newRef]
                    }
                }));
             }
        }
        setIsLinkModalOpen(false); setLinkInput("");
    };

    const handleRemoveReference = (type: ReferenceType, fileId: string) => {
        if (!activeSection) return;
        setReferenceData(prev => {
            const next = { ...prev };
            const sectionRefs = next[activeSection.id];
            if (!sectionRefs || !sectionRefs[type]) return prev;
            
            const updatedList = sectionRefs[type]!.filter(f => f.id !== fileId);
            if (updatedList.length === 0) {
                delete sectionRefs[type];
            } else {
                sectionRefs[type] = updatedList;
            }

            if (Object.keys(sectionRefs).length === 0) {
                delete next[activeSection.id];
            }
            return next;
        });
    };

    const handleClearAllReferences = (type: ReferenceType) => {
        if (!activeSection) return;
        setReferenceData(prev => {
            const next = { ...prev };
            if (next[activeSection.id]) {
                delete next[activeSection.id][type];
                if (Object.keys(next[activeSection.id]).length === 0) {
                    delete next[activeSection.id];
                }
            }
            return next;
        });
    };

    const openLibrary = (target: ReferenceType | null) => {
        setLibraryTarget(target);
        if (target === 'content') setActiveGroupId('lib-content');
        else if (target === 'specification') setActiveGroupId('lib-spec');
        else if (target === 'format') setActiveGroupId('lib-format');
        setIsLibraryOpen(true);
    };

    const handleOpenCreateGroupModal = (e: React.MouseEvent, parentId: string) => {
        e.preventDefault(); e.stopPropagation();
        setNewGroupNameInput("");
        setGroupCreationParentId(parentId);
        setIsCreateGroupModalOpen(true);
    };

    const confirmCreateGroup = () => {
        if (!newGroupNameInput.trim() || !groupCreationParentId) return;
        const newId = 'custom-' + Date.now();
        setCustomGroups(prev => [...prev, { id: newId, name: newGroupNameInput.trim(), type: 'custom', parentId: groupCreationParentId }]);
        setExpandedGroupIds(prev => new Set(prev).add(groupCreationParentId));
        setActiveGroupId(newId);
        setIsCreateGroupModalOpen(false);
    };
    
    const handleOpenRenameGroupModal = (e: React.MouseEvent, group: ReferenceGroup) => {
        e.preventDefault(); e.stopPropagation();
        setGroupToRename(group);
        setRenameGroupInput(group.name);
        setIsRenameGroupModalOpen(true);
    };

    const confirmRenameGroup = () => {
        if (!renameGroupInput.trim() || !groupToRename) return;
        setCustomGroups(prev => prev.map(g => g.id === groupToRename.id ? { ...g, name: renameGroupInput.trim() } : g));
        setIsRenameGroupModalOpen(false);
        setGroupToRename(null);
    };

    const getAffectedItems = (groupId: string) => {
        const getAllChildIds = (pid: string): string[] => {
            const direct = customGroups.filter(g => g.parentId === pid).map(g => g.id);
            return [...direct, ...direct.flatMap(id => getAllChildIds(id))];
        };
        const ids = [groupId, ...getAllChildIds(groupId)];
        const groups = customGroups.filter(g => ids.includes(g.id));
        const files = libraryFiles.filter(f => ids.includes(f.groupId));
        return { groupIds: ids, groups, files };
    };

    const handleDeleteCustomGroup = useCallback((e: React.MouseEvent, groupId: string) => {
        e.preventDefault(); e.stopPropagation();
        const group = customGroups.find(g => g.id === groupId);
        if (group) {
            setGroupToDelete(group);
            setIsDeleteGroupModalOpen(true);
        }
    }, [customGroups]);

    const confirmGroupDeletion = () => {
        if (!groupToDelete) return;
        const { groupIds } = getAffectedItems(groupToDelete.id);
        setLibraryFiles(prev => prev.map(f => groupIds.includes(f.groupId) ? { ...f, groupId: 'lib-content' } : f));
        setCustomGroups(prev => prev.filter(g => !groupIds.includes(g.id)));
        setIsDeleteGroupModalOpen(false);
        setGroupToDelete(null);
        if (groupIds.includes(activeGroupId)) setActiveGroupId('lib-content');
    };

    const handleAttachFromLibrary = (file: ReferenceFile) => {
        const targetId = (libraryTarget === 'format' && formatUploadTargetId) ? formatUploadTargetId : activeSection?.id;
        
        if (!targetId) {
            alert("请先在左侧目录中选择一个章节，再引用此文件。");
            return;
        }
        
        let type: ReferenceType;
        if (libraryTarget) type = libraryTarget;
        else {
            const findRootId = (gid: string): string => {
                const g = [...BUILT_IN_GROUPS, ...customGroups].find(x => x.id === gid);
                if (g && g.parentId) return findRootId(g.parentId);
                return gid;
            };
            const rootId = findRootId(file.groupId);
            type = (rootId === 'lib-spec') ? 'specification' : (rootId === 'lib-format') ? 'format' : 'content';
        }

        setReferenceData(prev => {
            const sectionRefs = prev[targetId] || {};
            const existingFiles = sectionRefs[type] || [];
            if (existingFiles.some(f => f.id === file.id)) return prev; // Avoid duplicates

            return {
                ...prev,
                [targetId]: {
                    ...sectionRefs,
                    [type]: [...existingFiles, file]
                }
            };
        });
        
        setIsLibraryOpen(false); setFormatUploadTargetId(null);
    };

    const handleDeleteFromLibrary = (fileId: string) => {
        setLibraryFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleStartMove = useCallback((type: 'file' | 'group', data: any) => setMovingItem({ type, data }), []);
    const confirmMove = (targetGroupId: string) => {
        if (!movingItem) return;
        if (movingItem.type === 'file') {
            setLibraryFiles(prev => prev.map(f => f.id === movingItem.data.id ? { ...f, groupId: targetGroupId } : f));
        } else {
            setCustomGroups(prev => prev.map(g => g.id === movingItem.data.id ? { ...g, parentId: targetGroupId } : g));
        }
        setMovingItem(null);
    };

    const handleGenerateFullDraft = async () => {
        if (!projectInfo.trim()) { alert("请先填写项目基本信息"); return; }
        const allSections: SubSection[] = [];
        projectOutline.forEach(ch => ch.subsections.forEach(sub => { allSections.push(sub); if (sub.children) sub.children.forEach(child => allSections.push(child)); }));
        setIsLoading(true); setIsProjectInfoLocked(true); stopBatchRef.current = false;
        setBatchProgress({ current: 0, total: allSections.length, status: '准备开始...' });
        try {
            for (let i = 0; i < allSections.length; i++) {
                if (stopBatchRef.current) break;
                const sub = allSections[i];
                setBatchProgress({ current: i + 1, total: allSections.length, status: `正在生成: ${sub.title}` });
                const refs = referenceData[sub.id] || {};
                const content = await generateSectionContent(
                    sub.title, 
                    sub.req, 
                    `PROJECT CONTEXT: ${projectInfo}`, 
                    refs.content, 
                    refs.format, 
                    refs.specification, 
                    refs.knowledge, 
                    false
                );
                setReportData(prev => ({ ...prev, [sub.id]: content }));
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (e) { alert("生成中断"); } finally { setIsLoading(false); setBatchProgress(null); }
    };

    const handleStopBatch = () => { stopBatchRef.current = true; };
    
    const handleSubmit = async () => {
        if (!activeSection) return;
        const refs = referenceData[activeSection.id] || {};
        setIsLoading(true);
        let finalInput = projectInfo ? `PROJECT CONTEXT: ${projectInfo}\n\nUSER INSTRUCTION: ${inputValue}` : inputValue;
        try {
            if (selectionState) {
                const updated = await refineSectionContent(activeSection.title, selectionState.text, reportData[activeSection.id] || "", inputValue, refs.content, refs.format, refs.specification, refs.knowledge, useSearch);
                setReportData(prev => ({ ...prev, [activeSection.id]: updated }));
                clearSelection();
            } else if (reportData[activeSection.id] && inputValue.trim()) {
                 const currentContent = reportData[activeSection.id];
                 const updated = await refineSectionContent(
                    activeSection.title, 
                    currentContent, 
                    currentContent, 
                    inputValue, 
                    refs.content, 
                    refs.format, 
                    refs.specification, 
                    refs.knowledge, 
                    useSearch
                );
                setReportData(prev => ({ ...prev, [activeSection.id]: updated }));
                setInputValue("");
            } else {
                const generated = await generateSectionContent(activeSection.title, activeSection.req, finalInput, refs.content, refs.format, refs.specification, refs.knowledge, useSearch);
                setReportData(prev => ({ ...prev, [activeSection.id]: (prev[activeSection.id] || "") + generated }));
                setInputValue("");
            }
        } catch (err) { alert("API Error"); } finally { setIsLoading(false); }
    };

    const handleClearSectionContent = () => {
        if (!activeSection) return;
        if (!isClearAllConfirming) { setIsClearAllConfirming(true); setTimeout(() => setIsClearAllConfirming(false), 3000); return; }
        setReportData(prev => ({ ...prev, [activeSection.id]: "" }));
        setIsClearAllConfirming(false);
    };

    const handleDeleteSelectedText = async () => {
        if (!activeSection || !selectionState) return;
        setIsLoading(true);
        try {
            const updated = await refineSectionContent(activeSection.title, selectionState.text, reportData[activeSection.id] || "", "请彻底删除选中的这一部分内容。", undefined, undefined, undefined, undefined, false);
            setReportData(prev => ({ ...prev, [activeSection.id]: updated }));
            clearSelection();
        } catch (e) { alert("删除失败"); } finally { setIsLoading(false); }
    };

    const handleExportWord = () => {
        let html = `<html><head><meta charset="utf-8"></head><body><h1>${projectName}</h1>`;
        projectOutline.forEach(ch => {
            html += `<h2>${ch.title}</h2>`;
            ch.subsections.forEach(sub => {
                html += `<h3>${sub.title}</h3><div>${reportData[sub.id] || ""}</div>`;
                if (sub.children) sub.children.forEach(c => { html += `<h4>${c.title}</h4><div>${reportData[c.id] || ""}</div>`; });
            });
        });
        html += `</body></html>`;
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${projectName}.doc`; link.click();
    };

    const handleExportPDF = () => { setIsPrintMode(true); setTimeout(() => { window.print(); setIsPrintMode(false); }, 100); };

    const toggleGroupExpand = (gid: string) => setExpandedGroupIds(prev => {
        const next = new Set(prev);
        if (next.has(gid)) next.delete(gid); else next.add(gid);
        return next;
    });

    const renderGroupTree = (groups: ReferenceGroup[], level = 0): React.ReactNode => {
        return groups.map(group => {
            const isExpanded = expandedGroupIds.has(group.id);
            const children = customGroups.filter(g => g.parentId === group.id);
            const isActive = activeGroupId === group.id;

            return (
                <div key={group.id} className="select-none mb-1">
                    <div 
                        className={`group flex items-center py-2 px-3 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm ring-1 ring-blue-100' : 'hover:bg-slate-100 text-slate-500'}`}
                        style={{ marginLeft: `${level * 12}px` }}
                        onClick={() => setActiveGroupId(group.id)}
                    >
                        <div className="flex items-center gap-2 truncate flex-1">
                            <div onClick={(e) => { e.stopPropagation(); toggleGroupExpand(group.id); }} className={`p-0.5 rounded hover:bg-black/5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                {children.length > 0 ? <Icons.ChevronRight /> : <div className="w-3 h-3 opacity-0" />}
                            </div>
                            <div className="scale-90">{group.type === 'builtin' ? <Icons.Library /> : <Icons.Folder />}</div>
                            <span className="truncate text-sm">{group.name}</span>
                        </div>
                        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                            <button onClick={(e) => handleOpenCreateGroupModal(e, group.id)} className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded" title="新建子文件夹"><Icons.Plus /></button>
                            {group.type === 'custom' && (
                                <>
                                    <button onClick={(e) => handleOpenRenameGroupModal(e, group)} className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded" title="重命名"><Icons.Edit /></button>
                                    <button onClick={(e) => handleDeleteCustomGroup(e, group.id)} className="p-1 hover:text-red-600 hover:bg-red-50 rounded text-slate-400" title="删除"><Icons.Trash /></button>
                                </>
                            )}
                        </div>
                    </div>
                    {isExpanded && children.length > 0 && <div className="mt-1">{renderGroupTree(children, level + 1)}</div>}
                </div>
            );
        });
    };

    const getBreadcrumbs = (gid: string): ReferenceGroup[] => {
        const group = [...BUILT_IN_GROUPS, ...customGroups].find(g => g.id === gid);
        if (!group) return [];
        if (group.parentId) return [...getBreadcrumbs(group.parentId), group];
        return [group];
    };

    const breadcrumbs = useMemo(() => getBreadcrumbs(activeGroupId), [activeGroupId, customGroups]);
    const filteredFiles = libraryFiles.filter(f => f.groupId === activeGroupId && f.name.toLowerCase().includes(librarySearch.toLowerCase()));
    const activeRefs = activeSection ? referenceData[activeSection.id] : undefined;
    const activeGroupObj = [...BUILT_IN_GROUPS, ...customGroups].find(g => g.id === activeGroupId);

    if (currentView === 'cover') {
        return (
            <div className="min-h-screen cover-bg flex flex-col items-center justify-center relative overflow-hidden">
                {/* 3D Grid Plane */}
                <div className="cover-grid-plane"></div>
                
                {/* Main 3D Reactor Animation */}
                <div className="reactor-container mb-12 z-10">
                    <div className="reactor-ring r-1"></div>
                    <div className="reactor-ring r-2"></div>
                    <div className="reactor-ring r-3"></div>
                    <div className="reactor-ring r-4"></div>
                    <div className="reactor-core"></div>
                </div>

                {/* Typography & Actions */}
                <div className="z-20 text-center flex flex-col items-center select-none">
                    <div className="mb-2 relative">
                        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-emerald-300 tracking-tighter drop-shadow-2xl text-glow">
                            ProReport
                        </h1>
                        <span className="absolute -top-4 -right-12 text-sm font-bold text-blue-400 tracking-widest border border-blue-400/30 px-2 py-0.5 rounded-full bg-blue-900/20 backdrop-blur-sm">GenAI v3.0</span>
                    </div>
                    
                    <p className="text-blue-200/50 text-sm tracking-[0.8em] uppercase font-light mb-16 border-t border-b border-blue-500/20 py-3 w-full">
                        Professional Engineering Consulting
                    </p>
                    
                    <button 
                        onClick={() => {
                            if (isAuthenticated) {
                                setCurrentView('dashboard');
                            } else {
                                setCurrentView('login');
                            }
                        }}
                        className="glass-btn px-16 py-5 rounded-2xl text-white font-bold text-xl group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isAuthenticated ? 'INITIALIZE SYSTEM' : 'LOGIN / REGISTER'} <Icons.ChevronRight />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                    
                    <div className="absolute bottom-8 text-[10px] text-slate-600 font-mono">
                        SYSTEM STATUS: OPERATIONAL // SECURE CONNECTION ESTABLISHED
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'dashboard') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="z-10 w-full max-w-4xl">
                     <div className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition w-fit" onClick={() => setCurrentView('cover')}>
                        <div className="text-4xl">📊</div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ProReport <span className="text-blue-600 font-light">GenAI</span></h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* New Project Card */}
                        <div 
                            className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group relative overflow-hidden" 
                            onClick={startCreateProject}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-9xl">📄</span>
                            </div>
                            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <Icons.Plus />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">新建项目</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                开始一个新的可研报告。支持国标模板或完全自定义大纲结构。
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                创建新报告 <Icons.ChevronRight />
                            </div>
                        </div>

                        {/* Recent Projects Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all flex flex-col h-[360px]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600">
                                    <Icons.Folder />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">最近项目</h2>
                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Recent Projects</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {projects.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2 border-2 border-dashed border-gray-50 rounded-2xl">
                                        <Icons.Folder />
                                        <p className="text-xs">暂无历史项目</p>
                                    </div>
                                ) : (
                                    projects.slice(0, 5).map(p => (
                                        <div key={p.id} onClick={() => loadProject(p)} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-100 group">
                                            <div className="truncate pr-4">
                                                <p className="text-slate-700 font-bold text-sm truncate">{p.name}</p>
                                                <p className="text-gray-400 text-[10px] mt-0.5">{new Date(p.lastModified).toLocaleDateString()}</p>
                                            </div>
                                            <button className="text-gray-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition transform translate-x-2 group-hover:translate-x-0">
                                                <Icons.Play />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            {projects.length > 5 && (
                                <button onClick={() => setIsProjectListOpen(true)} className="mt-4 w-full py-2.5 text-blue-500 text-xs font-bold hover:bg-blue-50 rounded-xl transition">
                                    查看全部项目
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Outline Creator Modal */}
                {isOutlineCreatorOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Icons.Plus /> 创建新项目</h2>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">项目名称</label>
                                <input className="w-full p-3.5 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" placeholder="输入项目名称..." value={newProjectNameInput} onChange={e => setNewProjectNameInput(e.target.value)} autoFocus />
                            </div>
                            <div className="mb-8">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">项目描述 (可选)</label>
                                <textarea className="w-full p-3.5 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none h-24 resize-none transition-all text-sm" placeholder="简单描述项目概况..." value={newProjectDescInput} onChange={e => setNewProjectDescInput(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button onClick={() => confirmCreateProject(false)} className="p-4 border border-slate-100 bg-white rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition group shadow-sm hover:shadow-md">
                                    <span className="text-2xl group-hover:scale-110 transition">📄</span>
                                    <span className="font-bold text-sm">使用标准大纲</span>
                                    <span className="text-[10px] text-gray-400">2023 国标通用模板</span>
                                </button>
                                <button onClick={() => confirmCreateProject(true)} className="p-4 border border-slate-100 bg-white rounded-2xl flex flex-col items-center gap-2 hover:border-purple-500 hover:bg-purple-50/50 hover:text-purple-700 transition group shadow-sm hover:shadow-md">
                                    <span className="text-2xl group-hover:scale-110 transition">✏️</span>
                                    <span className="font-bold text-sm">自定义大纲</span>
                                    <span className="text-[10px] text-gray-400">手动创建章节结构</span>
                                </button>
                            </div>
                            <button onClick={() => setIsOutlineCreatorOpen(false)} className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition rounded-xl hover:bg-slate-50">取消</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (currentView === 'outline-editor') {
        return (
            <div className="h-screen flex flex-col bg-slate-50">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBackToDashboard} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><Icons.Close /></button>
                        <h1 className="font-bold text-slate-800 text-lg">自定义大纲编辑器</h1>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">{projectName}</span>
                    </div>
                    <button onClick={finishOutlineEditing} className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-transform active:scale-95">
                        <Icons.Check /> 完成并开始撰写
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                    <div className="space-y-6">
                        {editingOutline.map((ch, cIdx) => (
                            <div key={cIdx} className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 relative group hover:shadow-md transition-all">
                                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition"><button onClick={() => deleteChapter(cIdx)} className="text-slate-300 hover:text-red-500 transition"><Icons.Trash /></button></div>
                                <div className="mb-6"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">章节标题</label><input value={ch.title} onChange={(e) => updateChapterTitle(cIdx, e.target.value)} className="w-full text-xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none py-2 transition-colors" /></div>
                                <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                                    {ch.subsections.map((sub, sIdx) => (<div key={sub.id} className="flex gap-4 items-start relative group/sub"><div className="flex-1"><input value={sub.title} onChange={(e) => updateSubsection(cIdx, sIdx, 'title', e.target.value)} className="w-full text-sm font-bold border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="小节标题" /><input value={sub.req} onChange={(e) => updateSubsection(cIdx, sIdx, 'req', e.target.value)} className="w-full text-xs text-slate-500 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 outline-none mt-1 transition-all bg-transparent focus:bg-white" placeholder="撰写要求..." /></div><button onClick={() => deleteSubsection(cIdx, sIdx)} className="mt-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/sub:opacity-100 transition"><Icons.Close /></button></div>))}
                                    <button onClick={() => addSubsection(cIdx)} className="text-xs text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full flex items-center gap-2 mt-4 font-bold transition-colors"><Icons.Plus /> 添加小节</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addChapter} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-bold"><Icons.Plus /> 添加新章节</button>
                    </div>
                </div>
            </div>
        );
    }

    if (isPrintMode) {
         return (
            <div className={`p-12 bg-white text-black max-w-[210mm] mx-auto format-mode-pro`}>
                <h1 className="text-3xl font-bold text-center mb-12 mt-4">{projectName}</h1>
                {projectOutline.map((ch) => (<div key={ch.title} className="mb-8"><h2 className="text-2xl font-bold mb-6">{ch.title}</h2>{ch.subsections.map((sub) => (<div key={sub.id} className="mb-6"><h3 className="text-xl font-bold mb-3">{sub.title}</h3>{reportData[sub.id] && <div className="prose prose-sm max-w-none text-justify" dangerouslySetInnerHTML={{ __html: reportData[sub.id] }} />}{sub.children && sub.children.map(c => (<div key={c.id} className="mt-4 mb-2"><h4 className="text-lg font-bold mb-2">{c.title}</h4><div dangerouslySetInnerHTML={{ __html: reportData[c.id] || "" }} /></div>))}</div>))}</div>))}
            </div>
        );
    }

    // 如果当前视图是登录页，显示登录界面
    if (currentView === 'login') {
        return <LoginView onLoginSuccess={handleLoginSuccess} onBackToCover={() => setCurrentView('cover')} />;
    }

    // 如果未登录且不在封面页，重定向到封面页
    if (!isAuthenticated && currentView !== 'cover') {
        setCurrentView('cover');
        return null;
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-slate-50 text-slate-600">
            {/* Main Header - White Glassmorphism */}
            <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 shrink-0 z-30 sticky top-0">
                <div className="flex items-center h-full">
                    <div onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 mr-6 font-bold text-lg text-slate-800 cursor-pointer hover:opacity-80 transition group">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">📊</span>
                        <span className="tracking-tight">ProReport <span className="text-blue-600 font-light">GenAI</span></span>
                    </div>
                    <div className="flex h-full items-center">
                        <MenuButton icon={<Icons.Folder />} label="项目" onClick={() => setIsProjectListOpen(true)} />
                        <MenuButton icon={<Icons.History />} label="历史" onClick={() => setIsHistoryOpen(true)} />
                        <div className="relative h-full flex items-center">
                            <MenuButton icon={<Icons.Export />} label="导出" onClick={() => setShowExportMenu(!showExportMenu)} rightIcon={<Icons.ChevronDown />} />
                            {showExportMenu && (
                                <div className="absolute top-10 left-0 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1 z-[100] text-slate-600 animate-in fade-in zoom-in-95 duration-100">
                                    <button onClick={handleExportWord} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm flex items-center gap-3 transition-colors font-medium">
                                        <span className="text-blue-600"><Icons.Doc /></span> <span>Word (.doc)</span>
                                    </button>
                                    <button onClick={handleExportPDF} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm flex items-center gap-3 transition-colors border-t border-slate-50 font-medium">
                                        <span className="text-red-500"><Icons.Pdf /></span> <span>PDF</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        {showExportMenu && <div className="fixed inset-0 z-[90]" onClick={() => setShowExportMenu(false)}></div>}
                        <div className="w-px h-4 bg-slate-200 mx-2"></div>
                        <MenuButton icon={<Icons.Library />} label="资料库" onClick={() => openLibrary(null)} />
                    </div>
                </div>
                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {currentUser?.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{currentUser?.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="登出"
                    >
                        登出
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar - Floating Items */}
                <aside className="w-[260px] bg-slate-50/50 flex flex-col z-20 py-4 pl-2">
                     <div className="flex mx-2 mb-4 bg-slate-200/50 p-1 rounded-xl">
                         <button onClick={() => setActiveSidebarTab('info')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeSidebarTab === 'info' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>项目信息</button>
                         <button onClick={() => setActiveSidebarTab('outline')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeSidebarTab === 'outline' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>目录大纲</button>
                     </div>
                    
                    <div className="flex-1 overflow-hidden flex flex-col relative px-2">
                        {activeSidebarTab === 'info' ? (
                            <div className="absolute inset-0 overflow-y-auto px-2 pb-4 flex flex-col custom-scrollbar">
                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">项目名称</label>
                                    <input className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                                </div>
                                <div className="flex-1 flex flex-col min-h-0 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">核心参数 / 概况</label>
                                        <button onClick={() => setIsProjectInfoLocked(!isProjectInfoLocked)} className={`text-[10px] font-bold flex items-center gap-1 py-1 px-2 rounded-full transition-colors ${isProjectInfoLocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                            {isProjectInfoLocked ? <><Icons.Lock /> 锁定</> : <><Icons.Unlock /> 编辑</>}
                                        </button>
                                    </div>
                                    <textarea className={`flex-1 w-full p-4 border border-slate-100 rounded-2xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed ${isProjectInfoLocked ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-700'}`} value={projectInfo} onChange={(e) => setProjectInfo(e.target.value)} readOnly={isProjectInfoLocked} />
                                </div>
                                <button onClick={isLoading && batchProgress ? handleStopBatch : handleGenerateFullDraft} disabled={isLoading && !batchProgress} className={`py-3.5 rounded-xl text-white font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${isLoading ? 'bg-red-500 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isLoading && batchProgress ? <>停止生成 ({batchProgress.current}/{batchProgress.total})</> : <><Icons.Magic /> 一键生成全文初稿</>}
                                </button>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col">
                                <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar space-y-4 pr-1">
                                    {projectOutline.map((ch, idx) => (
                                        <div key={idx}>
                                            <div className="text-[10px] font-bold text-slate-400 px-3 pb-2 uppercase tracking-widest">{ch.title}</div>
                                            <div className="space-y-1">
                                                {ch.subsections.map(sub => (
                                                    <div key={sub.id}>
                                                        <div onClick={() => handleSectionSelect(sub)} className={`group relative px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${activeSection?.id === sub.id ? 'bg-white shadow-md shadow-blue-500/5 text-blue-600' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}>
                                                            {activeSection?.id === sub.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></div>}
                                                            <div className="flex items-center gap-2.5 truncate flex-1 pl-1">
                                                                {sub.children && (
                                                                    <div onClick={(e) => { e.stopPropagation(); toggleSectionExpand(sub.id); }} className={`p-0.5 rounded-md hover:bg-slate-100 transition-transform ${expandedSectionIds.has(sub.id) ? 'rotate-90' : ''} text-slate-400`}>
                                                                        <Icons.ChevronRight />
                                                                    </div>
                                                                )}
                                                                <span className={`truncate text-xs ${activeSection?.id === sub.id ? 'font-bold' : 'font-medium'}`}>{sub.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <FormatStatusButton files={referenceData[sub.id]?.format} onUpload={() => { setFormatUploadTargetId(sub.id); openLibrary('format'); }} onClearAll={() => handleClearAllReferences('format')} />
                                                                {reportData[sub.id] && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                                                            </div>
                                                        </div>
                                                        {sub.children && expandedSectionIds.has(sub.id) && (
                                                            <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-2">
                                                                {sub.children.map(c => (
                                                                    <div key={c.id} onClick={() => handleSectionSelect(c)} className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${activeSection?.id === c.id ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-500 hover:bg-white hover:text-slate-700'}`}>
                                                                        <span className="truncate text-[11px]">{c.title}</span>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <FormatStatusButton files={referenceData[c.id]?.format} onUpload={() => { setFormatUploadTargetId(c.id); openLibrary('format'); }} onClearAll={() => handleClearAllReferences('format')} />
                                                                            {reportData[c.id] && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-none pt-4 border-t border-slate-200/60 p-2">
                                    <div className="bg-slate-100/50 rounded-xl p-3 border border-slate-100">
                                        <div className="flex items-center gap-2 font-bold text-slate-600 text-xs mb-1.5">
                                            <Icons.Requirement /> 
                                            <span>当前大纲要求</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
                                            {activeSection?.req || "暂无具体要求"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area - The "Paper" */}
                <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                    {/* Floating Toolbar */}
                    <div className="h-16 flex items-center justify-between px-8 bg-transparent shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-lg truncate">{activeSection?.title || "报告预览"}</span>
                            {activeSection && reportData[activeSection.id] && (
                                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-mono shadow-sm">
                                    {currentSectionWordCount} 字
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                            <div className="relative group">
                                <button onClick={() => setShowFormatMenu(!showFormatMenu)} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all select-none">
                                    <span className="text-slate-400 group-hover:text-blue-500"><Icons.Format /></span>
                                    <span>{formatMode === 'pro' ? '公文模式' : '普通模式'}</span>
                                    <Icons.ChevronDown />
                                </button>
                                {showFormatMenu && (
                                    <>
                                        <div className="fixed inset-0 z-[50]" onClick={() => setShowFormatMenu(false)}></div>
                                        <div className="absolute top-10 right-0 w-36 bg-white rounded-xl shadow-xl shadow-slate-200 border border-slate-100 py-1.5 z-[60] text-slate-600 animate-in fade-in zoom-in-95 duration-100">
                                            <button onClick={() => { setFormatMode('default'); setShowFormatMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-xs flex items-center justify-between ${formatMode === 'default' ? 'text-blue-600 font-bold bg-blue-50/50' : ''}`}>
                                                <span>普通模式</span>
                                                {formatMode === 'default' && <Icons.Check />}
                                            </button>
                                            <button onClick={() => { setFormatMode('pro'); setShowFormatMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-xs flex items-center justify-between ${formatMode === 'pro' ? 'text-blue-600 font-bold bg-blue-50/50' : ''}`}>
                                                <span>公文模式</span>
                                                {formatMode === 'pro' && <Icons.Check />}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            {activeSection && reportData[activeSection.id] && (
                                <>
                                    <div className="w-px h-4 bg-slate-200"></div>
                                    <button onClick={handleClearSectionContent} className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-lg transition-all ${isClearAllConfirming ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
                                        {isClearAllConfirming ? '确认清空？' : <><Icons.Trash /> 清空</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* The Editor Sheet */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar" id="output-container">
                        <div id="output-editor" className={`bg-white shadow-sm border border-slate-200/60 rounded-xl min-h-[calc(100vh-10rem)] max-w-4xl mx-auto p-12 outline-none transition-all duration-300 ${formatMode === 'pro' ? 'format-mode-pro' : 'prose prose-slate max-w-none'}`} onMouseUp={handleMouseUp}>
                            {activeSection && reportData[activeSection.id] ? (
                                <div dangerouslySetInnerHTML={{ __html: reportData[activeSection.id] }} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] text-slate-300 select-none">
                                    <div className="text-6xl mb-4 opacity-50">📝</div>
                                    <p className="text-lg font-medium text-slate-400">选择左侧章节并开始生成</p>
                                    <p className="text-sm mt-2">AI 将根据您的指示和参考资料撰写内容</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Tools Panel */}
                <aside className="w-[300px] bg-white border-l border-slate-100 flex flex-col p-6 overflow-y-auto custom-scrollbar z-20 shadow-[-5px_0_20px_-5px_rgba(0,0,0,0.02)]">
                    {isLoading && batchProgress ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600 mb-6"></div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">正在撰写...</h3>
                            <p className="text-slate-400 text-xs px-8 leading-relaxed">AI 正在深度思考并生成专业内容，请稍候</p>
                        </div>
                    ) : !activeSection ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-300 p-4 select-none">
                            <div className="p-4 bg-slate-50 rounded-full mb-4"><Icons.Edit /></div>
                            <p className="font-bold text-sm text-slate-500">工具栏待命</p>
                            <p className="text-xs mt-2 opacity-60">请先选择一个章节</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${selectionState ? "bg-purple-50 text-purple-600 ring-1 ring-purple-100" : "bg-blue-50 text-blue-600 ring-1 ring-blue-100"}`}>
                                    <span className={`w-2 h-2 rounded-full ${selectionState ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                                    {selectionState ? "局部优化模式" : "内容生成模式"}
                                </div>
                                {selectionState && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">已选 {selectionWordCount} 字</span>}
                            </div>

                            <RefSlot type="content" label="内容参考 (Content)" files={activeRefs?.content} onRemoveFile={(fid) => handleRemoveReference('content', fid)} onLibrary={() => openLibrary('content')} onUpload={(e: any) => handleFileUpload(e, 'lib-content')} onLink={() => openLinkModal('lib-content')} onPreview={setPreviewFile} color="blue" />
                            <RefSlot type="specification" label="规范参考 (Specs)" files={activeRefs?.specification} onRemoveFile={(fid) => handleRemoveReference('specification', fid)} onLibrary={() => openLibrary('specification')} onUpload={(e: any) => handleFileUpload(e, 'lib-spec')} onLink={() => openLinkModal('lib-spec')} onPreview={setPreviewFile} color="emerald" />
                            
                            <div onClick={() => setUseSearch(!useSearch)} className={`mb-6 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${useSearch ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <div className={`p-1.5 rounded-lg ${useSearch ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-500'}`}><Icons.Globe /></div>
                                    <span className={useSearch ? 'text-white' : 'text-slate-600'}>联网搜索增强</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative transition-colors ${useSearch ? 'bg-black/20' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${useSearch ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </div>

                            {selectionState && (
                                <div className="mb-6 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                                    <div className="flex items-center justify-between mb-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                        <span>选中片段</span>
                                        <button onClick={clearSelection} className="hover:text-purple-700 underline">取消</button>
                                    </div>
                                    <div className="text-xs text-purple-800 bg-white/50 p-3 rounded-xl border border-purple-100 truncate mb-3 italic">"{selectionState.text}"</div>
                                    <button onClick={handleDeleteSelectedText} disabled={isLoading} className="w-full py-2.5 bg-white text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2 transition-colors shadow-sm">
                                        <Icons.Trash /> 删除选中部分
                                    </button>
                                </div>
                            )}

                            <div className="mt-auto">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">详细指示 / 修改意见</label>
                                <textarea className="w-full h-32 p-4 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-2xl text-sm mb-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-inner" placeholder={selectionState ? "例如：详细扩写这一段，补充更多数据..." : "例如：请详细描述项目背景，字数不少于800字..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                                <button onClick={handleSubmit} disabled={isLoading} className={`w-full py-3.5 rounded-xl text-white font-bold flex justify-center items-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${isLoading ? 'bg-slate-400 shadow-none cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'}`}>
                                    {isLoading ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> 提交中...</> : <><Icons.Send /> {selectionState ? "提交局部修改" : "生成本节内容"}</>}
                                </button>
                            </div>
                        </>
                    )}
                </aside>
            </div>
            {isProjectListOpen && (<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setIsProjectListOpen(false)}><div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white"><h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Icons.Folder /></div> 我的项目</h2><button onClick={() => setIsProjectListOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"><Icons.Close /></button></div><div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-3">{projects.map(proj => (<div key={proj.id} onClick={() => loadProject(proj)} className={`group relative p-5 bg-white border rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${currentProjectId === proj.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100 hover:border-blue-200'}`}><div className="flex justify-between items-start"><div className="flex-1 min-w-0 pr-4"><div className="font-bold text-slate-800 truncate mb-1 text-lg">{proj.name}</div><div className="text-xs text-slate-400 flex items-center gap-2"><span>{new Date(proj.lastModified).toLocaleDateString()}</span> <span className="w-1 h-1 bg-slate-300 rounded-full"></span> <span>{proj.description ? '有描述' : '无描述'}</span></div></div><button onClick={(e) => handleDeleteProject(e, proj.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 hover:bg-red-50 rounded-xl"><Icons.Trash /></button></div></div>))}</div></div></div>)}
            {isHistoryOpen && (<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setIsHistoryOpen(false)}><div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white"><h2 className="text-xl font-bold flex items-center gap-3 text-slate-800"><div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Icons.History /></div> 版本历史</h2><button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"><Icons.Close /></button></div><div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-3">{(currentProject?.history || []).map(ver => (<div key={ver.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all"><div className="flex-1"><div className="flex items-center gap-2 mb-1 font-bold text-slate-700">{ver.reason}<span className="text-xs text-slate-400 font-normal bg-slate-100 px-2 py-0.5 rounded-full">{new Date(ver.timestamp).toLocaleString()}</span></div><div className="text-xs text-slate-400 truncate w-64">{ver.description || "无额外描述"}</div></div><button onClick={() => handleRestoreVersion(ver)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1"><Icons.Restore /> 恢复此版</button></div>))}</div></div></div>)}
            
            {/* Extended Library Modal */}
            {isLibraryOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6" onClick={() => setIsLibraryOpen(false)}>
                    <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="w-72 bg-slate-50 border-r border-slate-100 flex flex-col">
                            <div className="p-8 pb-4 flex flex-col gap-4">
                                <div className="flex items-center justify-between font-black text-slate-800 tracking-tight text-lg">
                                    <div className="flex items-center gap-3"><span className="text-blue-500"><Icons.Folder /></span> 资料层级</div>
                                </div>
                                <button onClick={(e) => handleOpenCreateGroupModal(e, activeGroupId)} className="w-full py-3 bg-slate-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition shadow-lg shadow-slate-500/20 active:scale-95">
                                    <Icons.Plus /> 新建文件夹
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                                {renderGroupTree(BUILT_IN_GROUPS)}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col bg-white relative">
                            {/* Decorative gradient top */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none"></div>
                            
                            <div className="flex items-center justify-between p-8 pb-4 border-b border-slate-50 z-10">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-2 uppercase tracking-widest">
                                        {breadcrumbs.map((b, i) => (
                                            <React.Fragment key={b.id}>
                                                <span onClick={() => setActiveGroupId(b.id)} className="hover:text-blue-600 cursor-pointer transition-colors">{b.name}</span>
                                                {i < breadcrumbs.length - 1 && <span className="mx-1 text-slate-300">/</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                        {activeGroupObj?.name}
                                        <span className="text-sm font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{filteredFiles.length}</span>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><Icons.Search /></div>
                                        <input placeholder="搜索文件..." className="pl-10 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm w-72 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none font-medium" value={librarySearch} onChange={e => setLibrarySearch(e.target.value)} />
                                    </div>
                                    <button onClick={() => setIsLibraryOpen(false)} className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><Icons.Close /></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group" onClick={() => document.getElementById('lib-upload-trigger')?.click()}>
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            <Icons.Upload />
                                        </div>
                                        <div className="text-center"><p className="font-bold text-slate-800 text-lg">上传新文件</p><p className="text-xs text-slate-400 font-medium mt-1">支持 PDF, Word, 图片</p></div>
                                        <input type="file" id="lib-upload-trigger" className="hidden" onChange={handleFileUpload} />
                                    </div>
                                    <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group" onClick={() => openLinkModal()}>
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                            <Icons.Link />
                                        </div>
                                        <div className="text-center"><p className="font-bold text-slate-800 text-lg">添加外部链接</p><p className="text-xs text-slate-400 font-medium mt-1">网页 URL 或 在线文档</p></div>
                                    </div>
                                    {filteredFiles.map(file => (
                                        <div key={file.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group relative">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${file.mimeType.startsWith('image/') ? 'bg-orange-50 text-orange-500' : file.mimeType === 'text/url' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'}`}>
                                                    {file.mimeType.startsWith('image/') ? <Icons.Image /> : file.mimeType === 'text/url' ? <Icons.Link /> : <Icons.File />}
                                                </div>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <p className="font-bold text-slate-800 text-sm truncate pr-2">{file.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{file.mimeType.split('/')[1] || 'URL'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleAttachFromLibrary(file)} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95">选用此文件</button>
                                                <button onClick={() => setPreviewFile(file)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-blue-500 transition" title="预览"><Icons.Eye /></button>
                                                <button onClick={() => handleStartMove('file', file)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition"><Icons.FolderMove /></button>
                                                <button onClick={() => handleDeleteFromLibrary(file.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition"><Icons.Trash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {movingItem && (
                            <div className="absolute inset-0 z-[100] bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-12">
                                <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                                    <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-3"><Icons.FolderMove /> 移动文件</h3>
                                    <p className="text-sm text-slate-500 mb-6">正在移动: <span className="font-bold text-slate-800">"{movingItem.data.name}"</span></p>
                                    <div className="max-h-64 overflow-y-auto mb-6 border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-1">
                                        {[...BUILT_IN_GROUPS, ...customGroups].map(g => (
                                            <button key={g.id} onClick={() => confirmMove(g.id)} className={`w-full text-left p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeGroupId === g.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-white text-slate-600'}`}>
                                                <Icons.Folder /> {g.name}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setMovingItem(null)} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition rounded-xl hover:bg-slate-50">取消操作</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Other modals (Link, Create Group, Delete) remain largely unchanged in logic but structurally consistent with the updated design */}
            
            {isLinkModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Icons.Link /></div> 添加外部资源链接</h3>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">链接地址 (URL)</label>
                            <input className="w-full p-4 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm transition-all font-medium" placeholder="https://..." value={linkInput} onChange={e => setLinkInput(e.target.value)} autoFocus />
                            {linkError && <p className="text-red-500 text-xs mt-2 font-bold ml-1 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {linkError}</p>}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setIsLinkModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 transition rounded-xl hover:bg-slate-50">取消</button>
                            <button onClick={confirmAddLink} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition active:scale-95">确认添加</button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateGroupModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><Icons.Plus /></div> 新建文件夹</h3>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">文件夹名称</label>
                            <input className="w-full p-4 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-slate-800 rounded-2xl focus:ring-4 focus:ring-slate-500/10 outline-none text-sm transition-all font-bold" placeholder="输入名称..." value={newGroupNameInput} onChange={e => setNewGroupNameInput(e.target.value)} autoFocus />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setIsCreateGroupModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 transition rounded-xl hover:bg-slate-50">取消</button>
                            <button onClick={confirmCreateGroup} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-700 transition active:scale-95">创建</button>
                        </div>
                    </div>
                </div>
            )}
            
            {isRenameGroupModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><Icons.Edit /></div> 重命名文件夹</h3>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">新的名称</label>
                            <input className="w-full p-4 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-slate-800 rounded-2xl focus:ring-4 focus:ring-slate-500/10 outline-none text-sm transition-all font-bold" placeholder="输入新名称..." value={renameGroupInput} onChange={e => setRenameGroupInput(e.target.value)} autoFocus />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setIsRenameGroupModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 transition rounded-xl hover:bg-slate-50">取消</button>
                            <button onClick={confirmRenameGroup} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-700 transition active:scale-95">保存</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Group Detailed Confirmation Modal */}
            {isDeleteGroupModalOpen && groupToDelete && (() => {
                const { groups, files } = getAffectedItems(groupToDelete.id);
                return (
                    <div className="fixed inset-0 bg-red-950/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-4 border-red-50">
                            <div className="p-8 bg-red-500 text-white flex items-center gap-5 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 text-red-400 opacity-20 text-9xl rotate-12"><Icons.Trash /></div>
                                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm"><Icons.Trash /></div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">确认删除目录？</h2>
                                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">Permanent Structural Change</p>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="mb-6">
                                    <p className="text-sm text-slate-600 mb-4 font-medium">
                                        您正在尝试删除文件夹 <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">"{groupToDelete.name}"</span>。
                                        此操作将影响以下内容：
                                    </p>
                                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 max-h-64 overflow-y-auto custom-scrollbar shadow-inner">
                                        <div className="mb-5">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Icons.Folder /> 受影响的子目录 ({groups.length})
                                            </h4>
                                            <ul className="space-y-2">
                                                {groups.map(g => (
                                                    <li key={g.id} className="text-xs font-bold text-slate-700 flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-red-400 ml-1" /> {g.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-5 border-t border-slate-200/60">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Icons.File /> 受影响的文件 ({files.length})
                                            </h4>
                                            {files.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {files.map(f => (
                                                        <li key={f.id} className="text-xs font-medium text-slate-600 truncate flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1" /> {f.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-xs italic text-slate-400 bg-white p-2 rounded-lg text-center border border-slate-100 border-dashed">此目录下无文件</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 font-medium flex items-start gap-3 shadow-sm">
                                    <span className="text-lg">💡</span>
                                    <p className="leading-relaxed mt-0.5">提示：目录将被彻底移除，但其中包含的所有文件将自动归类到 <span className="font-bold underline decoration-blue-300 decoration-2">"内容参考"</span> 根目录下，不会被删除。</p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 flex gap-4 justify-end border-t border-slate-100">
                                <button onClick={() => setIsDeleteGroupModalOpen(false)} className="px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-600 transition rounded-xl hover:bg-white">取消</button>
                                <button onClick={confirmGroupDeletion} className="px-8 py-3 bg-red-600 text-white text-sm font-black rounded-2xl hover:bg-red-700 transition shadow-xl shadow-red-900/20 active:scale-95">确认执行</button>
                            </div>
                        </div>
                    </div>
                )
            })()}

            {previewFile && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8" onClick={() => setPreviewFile(null)}>
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    {previewFile.mimeType.startsWith('image/') ? <Icons.Image /> : previewFile.mimeType === 'application/pdf' ? <Icons.Pdf /> : previewFile.mimeType === 'text/url' ? <Icons.Link /> : <Icons.File />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-slate-800 truncate text-lg">{previewFile.name}</span>
                                    <span className="text-xs text-slate-400 font-mono">{previewFile.mimeType}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Download/External Link Button */}
                                {previewFile.mimeType === 'text/url' ? (
                                    <a href={previewFile.data} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="打开链接"><Icons.Link /></a>
                                ) : (
                                    <a href={`data:${previewFile.mimeType};base64,${previewFile.data}`} download={previewFile.name} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="下载"><Icons.Export /></a>
                                )}
                                <button onClick={() => setPreviewFile(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"><Icons.Close /></button>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="flex-1 overflow-hidden bg-slate-100 relative flex items-center justify-center">
                            {/* Renderer Logic */}
                            {(() => {
                                if (previewFile.mimeType.startsWith('image/')) {
                                    return <img src={`data:${previewFile.mimeType};base64,${previewFile.data}`} className="max-w-full max-h-full object-contain p-4 shadow-lg" alt="Preview" />;
                                }
                                if (previewFile.mimeType === 'application/pdf') {
                                    return <iframe src={`data:application/pdf;base64,${previewFile.data}`} className="w-full h-full border-none" title="PDF Preview" />;
                                }
                                if (['text/plain', 'text/markdown', 'application/json', 'text/csv'].includes(previewFile.mimeType)) {
                                    const content = safeDecode(previewFile.data);
                                    return (
                                        <div className="w-full h-full overflow-auto p-8 bg-white">
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">{content}</pre>
                                        </div>
                                    );
                                }
                                if (previewFile.mimeType === 'text/url') {
                                    return (
                                        <div className="text-center p-8">
                                            <div className="text-6xl mb-4">🔗</div>
                                            <h3 className="text-xl font-bold text-slate-700 mb-2">外部链接资源</h3>
                                            <p className="text-slate-500 mb-6 max-w-md mx-auto break-all bg-white p-3 rounded border border-slate-200">{previewFile.data}</p>
                                            <a href={previewFile.data} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">在浏览器中打开</a>
                                        </div>
                                    );
                                }
                                
                                // Fallback
                                return (
                                    <div className="text-center p-8">
                                        <div className="text-6xl mb-4 text-slate-300">📄</div>
                                        <p className="text-slate-500 font-medium">此文件类型暂不支持预览</p>
                                        <p className="text-xs text-slate-400 mt-2">请下载后查看</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;