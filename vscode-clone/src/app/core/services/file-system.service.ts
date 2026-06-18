import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface FileInfo {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: number;
  children?: FileInfo[];
}

export interface FileContent {
  path: string;
  content: string;
  language: string;
  encoding: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private fileTreeSubject = new BehaviorSubject<FileInfo[]>([]);
  public fileTree$ = this.fileTreeSubject.asObservable();

  private fileCache = new Map<string, FileContent>();
  private readonly MAX_CACHE_SIZE = 50;

  constructor(private http: HttpClient) {}

  /**
   * Read file content
   */
  readFile(path: string): Promise<FileContent> {
    // Check cache first
    if (this.fileCache.has(path)) {
      return Promise.resolve(this.fileCache.get(path)!);
    }

    return this.http.get<FileContent>(`/api/files/read?path=${encodeURIComponent(path)}`)
      .toPromise()
      .then(content => {
        if (content) {
          this.setCacheFile(path, content);
        }
        return content || { path, content: '', language: 'text', encoding: 'utf-8' };
      });
  }

  /**
   * Write file content
   */
  writeFile(path: string, content: string): Promise<void> {
    return this.http.post<void>('/api/files/write', { path, content })
      .toPromise()
      .then(() => {
        this.fileCache.delete(path); // Invalidate cache
      });
  }

  /**
   * List files in directory
   */
  listFiles(path: string): Promise<FileInfo[]> {
    return this.http.get<FileInfo[]>(`/api/files/list?path=${encodeURIComponent(path)}`)
      .toPromise()
      .then(files => files || []);
  }

  /**
   * Create new file
   */
  createFile(path: string, content: string = ''): Promise<FileInfo> {
    return this.http.post<FileInfo>('/api/files/create', { path, content })
      .toPromise()
      .then(file => file || { id: '', name: '', path, isDirectory: false, size: 0, modifiedTime: 0 });
  }

  /**
   * Create new directory
   */
  createDirectory(path: string): Promise<FileInfo> {
    return this.http.post<FileInfo>('/api/files/mkdir', { path })
      .toPromise()
      .then(dir => dir || { id: '', name: '', path, isDirectory: true, size: 0, modifiedTime: 0 });
  }

  /**
   * Delete file or directory
   */
  deleteFile(path: string): Promise<void> {
    this.fileCache.delete(path);
    return this.http.delete<void>(`/api/files/delete?path=${encodeURIComponent(path)}`)
      .toPromise()
      .then(() => undefined);
  }

  /**
   * Rename file or directory
   */
  renameFile(oldPath: string, newPath: string): Promise<FileInfo> {
    this.fileCache.delete(oldPath);
    return this.http.post<FileInfo>('/api/files/rename', { oldPath, newPath })
      .toPromise()
      .then(file => file || { id: '', name: '', path: newPath, isDirectory: false, size: 0, modifiedTime: 0 });
  }

  /**
   * Load project root file tree
   */
  loadFileTree(rootPath: string): Promise<FileInfo[]> {
    return this.http.get<FileInfo[]>(`/api/files/tree?path=${encodeURIComponent(rootPath)}`)
      .toPromise()
      .then(tree => {
        tree = tree || [];
        this.fileTreeSubject.next(tree);
        return tree;
      });
  }

  /**
   * Watch for file changes
   */
  watchFile(path: string): Observable<FileContent> {
    return new Observable(observer => {
      // WebSocket connection for real-time file changes
      const ws = new WebSocket(`ws://localhost:4200/api/files/watch?path=${encodeURIComponent(path)}`);
      
      ws.onmessage = (event) => {
        try {
          const content = JSON.parse(event.data);
          observer.next(content);
        } catch (e) {
          observer.error(e);
        }
      };

      ws.onerror = (error) => observer.error(error);
      ws.onclose = () => observer.complete();

      return () => ws.close();
    });
  }

  /**
   * Get file language based on extension
   */
  getLanguageFromFile(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() || '';
    const languageMap: { [key: string]: string } = {
      'ts': 'typescript',
      'js': 'javascript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'cs': 'csharp',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'md': 'markdown',
      'sql': 'sql',
      'xml': 'xml',
      'yaml': 'yaml',
      'sh': 'shell'
    };
    return languageMap[ext] || 'text';
  }

  /**
   * Search files by name/content
   */
  searchFiles(query: string, rootPath: string): Promise<FileInfo[]> {
    return this.http.get<FileInfo[]>(`/api/files/search?q=${encodeURIComponent(query)}&path=${encodeURIComponent(rootPath)}`)
      .toPromise()
      .then(results => results || []);
  }

  /**
   * Get file stats
   */
  getFileStats(path: string): Promise<FileInfo> {
    return this.http.get<FileInfo>(`/api/files/stat?path=${encodeURIComponent(path)}`)
      .toPromise()
      .then(stat => stat || { id: '', name: '', path, isDirectory: false, size: 0, modifiedTime: 0 });
  }

  private setCacheFile(path: string, content: FileContent): void {
    if (this.fileCache.size >= this.MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = this.fileCache.keys().next().value;
      this.fileCache.delete(firstKey);
    }
    this.fileCache.set(path, content);
  }

  clearCache(): void {
    this.fileCache.clear();
  }
}
