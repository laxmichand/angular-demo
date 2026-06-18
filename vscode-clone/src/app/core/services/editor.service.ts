import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileSystemService, FileContent } from './file-system.service';

export interface EditorState {
  content: string;
  isDirty: boolean;
  language: string;
  fontSize: number;
  fontFamily: string;
  theme: string;
  wordWrap: boolean;
  minimap: boolean;
}

export interface TabModel {
  id: string;
  path: string;
  name: string;
  isDirty: boolean;
  isActive: boolean;
  state?: EditorState;
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private activeTabSubject = new BehaviorSubject<TabModel | null>(null);
  private tabsSubject = new BehaviorSubject<TabModel[]>([]);
  private editorStateSubject = new BehaviorSubject<EditorState>(this.getDefaultState());

  public activeTab$ = this.activeTabSubject.asObservable();
  public tabs$ = this.tabsSubject.asObservable();
  public editorState$ = this.editorStateSubject.asObservable();

  private tabs: Map<string, TabModel> = new Map();
  private tabOrder: string[] = [];

  constructor(private fileSystemService: FileSystemService) {}

  /**
   * Open file in editor
   */
  async openFile(path: string): Promise<void> {
    try {
      const fileId = this.generateFileId(path);
      
      // Check if already open
      if (this.tabs.has(fileId)) {
        this.setActiveTab(fileId);
        return;
      }

      // Read file content
      const fileContent = await this.fileSystemService.readFile(path);
      
      // Create tab
      const tab: TabModel = {
        id: fileId,
        path,
        name: this.getFileName(path),
        isDirty: false,
        isActive: true,
        state: {
          content: fileContent.content,
          isDirty: false,
          language: fileContent.language,
          fontSize: 14,
          fontFamily: 'Fira Code',
          theme: 'dark',
          wordWrap: false,
          minimap: true
        }
      };

      this.tabs.set(fileId, tab);
      this.tabOrder.push(fileId);
      this.updateActiveTab(tab);
    } catch (error) {
      console.error('Failed to open file:', error);
      throw error;
    }
  }

  /**
   * Close file tab
   */
  closeFile(fileId: string): void {
    const tab = this.tabs.get(fileId);
    
    if (tab?.isDirty) {
      // Prompt save confirmation
      if (!confirm(`Save changes to ${tab.name}?`)) {
        return;
      }
      this.saveFile(fileId);
    }

    this.tabs.delete(fileId);
    this.tabOrder = this.tabOrder.filter(id => id !== fileId);

    // Set next active tab
    if (tab?.isActive && this.tabOrder.length > 0) {
      this.setActiveTab(this.tabOrder[this.tabOrder.length - 1]);
    }

    this.updateTabsList();
  }

  /**
   * Close all files
   */
  closeAll(): void {
    this.tabs.clear();
    this.tabOrder = [];
    this.activeTabSubject.next(null);
    this.updateTabsList();
  }

  /**
   * Save current file
   */
  async saveFile(fileId: string): Promise<void> {
    const tab = this.tabs.get(fileId);
    if (!tab || !tab.state) return;

    try {
      await this.fileSystemService.writeFile(tab.path, tab.state.content);
      tab.isDirty = false;
      tab.state.isDirty = false;
      this.updateTabsList();
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  /**
   * Save all files
   */
  async saveAll(): Promise<void> {
    const savePromises = Array.from(this.tabs.keys())
      .filter(id => this.tabs.get(id)?.isDirty)
      .map(id => this.saveFile(id));

    await Promise.all(savePromises);
  }

  /**
   * Update file content
   */
  updateFileContent(fileId: string, content: string): void {
    const tab = this.tabs.get(fileId);
    if (!tab || !tab.state) return;

    tab.state.content = content;
    tab.isDirty = true;
    tab.state.isDirty = true;
    this.updateTabsList();
  }

  /**
   * Set active tab
   */
  setActiveTab(fileId: string): void {
    const tab = this.tabs.get(fileId);
    if (!tab) return;

    // Mark all tabs as inactive
    this.tabs.forEach(t => t.isActive = false);
    tab.isActive = true;

    this.updateActiveTab(tab);
  }

  /**
   * Get active tab
   */
  getActiveTab(): TabModel | null {
    return this.activeTabSubject.value;
  }

  /**
   * Get all tabs
   */
  getTabs(): TabModel[] {
    return this.tabOrder.map(id => this.tabs.get(id)!).filter(Boolean);
  }

  /**
   * Get tab by ID
   */
  getTab(fileId: string): TabModel | undefined {
    return this.tabs.get(fileId);
  }

  /**
   * Update editor settings
   */
  updateSettings(settings: Partial<EditorState>): void {
    const currentState = this.editorStateSubject.value;
    this.editorStateSubject.next({ ...currentState, ...settings });
  }

  /**
   * Get default editor state
   */
  private getDefaultState(): EditorState {
    return {
      content: '',
      isDirty: false,
      language: 'text',
      fontSize: 14,
      fontFamily: 'Fira Code',
      theme: 'dark',
      wordWrap: false,
      minimap: true
    };
  }

  private updateActiveTab(tab: TabModel): void {
    this.activeTabSubject.next(tab);
    if (tab.state) {
      this.editorStateSubject.next(tab.state);
    }
  }

  private updateTabsList(): void {
    const tabsList = this.getTabs();
    this.tabsSubject.next(tabsList);
  }

  private generateFileId(path: string): string {
    return btoa(path); // Base64 encode path as ID
  }

  private getFileName(path: string): string {
    return path.split('/').pop() || 'untitled';
  }
}
