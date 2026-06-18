import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface TerminalSession {
  id: string;
  name: string;
  isActive: boolean;
  shellType: 'bash' | 'zsh' | 'powershell' | 'cmd';
  workingDirectory: string;
  output: TerminalOutput[];
}

export interface TerminalOutput {
  id: string;
  type: 'output' | 'error' | 'input' | 'command';
  content: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  private sessionsSubject = new BehaviorSubject<TerminalSession[]>([]);
  private activeSessionSubject = new BehaviorSubject<TerminalSession | null>(null);
  private outputSubject = new Subject<TerminalOutput>();

  public sessions$ = this.sessionsSubject.asObservable();
  public activeSession$ = this.activeSessionSubject.asObservable();
  public output$ = this.outputSubject.asObservable();

  private sessions: Map<string, TerminalSession> = new Map();
  private sessionIds: string[] = [];

  constructor() {
    this.initializeDefaultSession();
  }

  /**
   * Initialize default terminal session
   */
  private initializeDefaultSession(): void {
    const defaultSession: TerminalSession = {
      id: this.generateSessionId(),
      name: 'bash',
      isActive: true,
      shellType: 'bash',
      workingDirectory: '/home/user',
      output: []
    };

    this.sessions.set(defaultSession.id, defaultSession);
    this.sessionIds.push(defaultSession.id);
    this.activeSessionSubject.next(defaultSession);
    this.updateSessions();
  }

  /**
   * Create new terminal session
   */
  createSession(shellType: 'bash' | 'zsh' | 'powershell' | 'cmd' = 'bash'): TerminalSession {
    const session: TerminalSession = {
      id: this.generateSessionId(),
      name: `${shellType} - ${this.sessionIds.length}`,
      isActive: false,
      shellType,
      workingDirectory: '/home/user',
      output: []
    };

    this.sessions.set(session.id, session);
    this.sessionIds.push(session.id);
    this.updateSessions();

    return session;
  }

  /**
   * Close terminal session
   */
  closeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    this.sessionIds = this.sessionIds.filter(id => id !== sessionId);

    if (this.activeSessionSubject.value?.id === sessionId) {
      if (this.sessionIds.length > 0) {
        this.setActiveSession(this.sessionIds[0]);
      } else {
        this.activeSessionSubject.next(null);
      }
    }

    this.updateSessions();
  }

  /**
   * Set active session
   */
  setActiveSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Mark all sessions as inactive
    this.sessions.forEach(s => s.isActive = false);
    session.isActive = true;

    this.activeSessionSubject.next(session);
    this.updateSessions();
  }

  /**
   * Execute command in active session
   */
  executeCommand(command: string): void {
    const session = this.activeSessionSubject.value;
    if (!session) return;

    // Add input to output
    const input: TerminalOutput = {
      id: this.generateOutputId(),
      type: 'input',
      content: command,
      timestamp: Date.now()
    };
    session.output.push(input);
    this.outputSubject.next(input);

    // Execute command via WebSocket
    this.sendCommand(session.id, command);
  }

  /**
   * Send command to terminal
   */
  private sendCommand(sessionId: string, command: string): void {
    // This would be connected to a WebSocket or HTTP endpoint
    // For now, simulate output
    setTimeout(() => {
      const session = this.sessions.get(sessionId);
      if (!session) return;

      const output: TerminalOutput = {
        id: this.generateOutputId(),
        type: 'output',
        content: `Command executed: ${command}\n`,
        timestamp: Date.now()
      };
      session.output.push(output);
      this.outputSubject.next(output);
    }, 100);
  }

  /**
   * Clear terminal output
   */
  clearOutput(sessionId?: string): void {
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.output = [];
      }
    } else {
      const session = this.activeSessionSubject.value;
      if (session) {
        session.output = [];
      }
    }
    this.updateSessions();
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions
   */
  getSessions(): TerminalSession[] {
    return this.sessionIds.map(id => this.sessions.get(id)!).filter(Boolean);
  }

  /**
   * Get active session
   */
  getActiveSession(): TerminalSession | null {
    return this.activeSessionSubject.value;
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateOutputId(): string {
    return `output-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateSessions(): void {
    const sessionsList = this.getSessions();
    this.sessionsSubject.next(sessionsList);
  }
}
