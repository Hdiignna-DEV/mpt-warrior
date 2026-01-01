// Logging utility untuk MPT Warrior

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = process.env.NODE_ENV === "development";

  log(level: LogLevel, message: string, data?: unknown, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const logFn = console[level] || console.log;
      logFn(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, data || "");
      if (error) console.error(error);
    }

    return entry;
  }

  debug(message: string, data?: unknown) {
    return this.log("debug", message, data);
  }

  info(message: string, data?: unknown) {
    return this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    return this.log("warn", message, data);
  }

  error(message: string, data?: unknown, error?: Error) {
    return this.log("error", message, data, error);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return this.logs;
    return this.logs.filter((log) => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
