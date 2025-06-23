import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Copy,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Bug,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';
export type LogSource = string;

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: LogSource;
  message: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

export interface LogFilter {
  levels: LogLevel[];
  sources: LogSource[];
  searchQuery: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface LogViewerProps {
  logs: LogEntry[];
  sources?: LogSource[];
  onLoadMore?: () => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  onExport?: (logs: LogEntry[]) => void;
  autoScroll?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  className?: string;
}

const logLevelConfig: Record<
  LogLevel,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  debug: { icon: Bug, color: 'text-gray-500', bgColor: 'bg-gray-100' },
  info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  error: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100' },
  critical: { icon: AlertCircle, color: 'text-purple-500', bgColor: 'bg-purple-100' },
};

function LogLevelBadge({ level }: { level: LogLevel }) {
  const config = logLevelConfig[level];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('gap-1', config.bgColor, config.color, 'border-0')}>
      <Icon className="h-3 w-3" />
      {level.toUpperCase()}
    </Badge>
  );
}

function LogEntryComponent({ entry, onCopy }: { entry: LogEntry; onCopy: (text: string) => void }) {
  const [expanded, setExpanded] = React.useState(false);
  const hasMetadata = entry.metadata && Object.keys(entry.metadata).length > 0;

  return (
    <div
      className={cn(
        'px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors',
        'font-mono text-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'mt-0.5 transition-transform',
            !hasMetadata && !entry.stackTrace && 'invisible'
          )}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {entry.timestamp.toLocaleString()}
            </span>
            <LogLevelBadge level={entry.level} />
            <Badge variant="secondary" className="text-xs">
              {entry.source}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 ml-auto"
              onClick={() => onCopy(JSON.stringify(entry, null, 2))}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-foreground break-all">{entry.message}</div>

          {expanded && (
            <div className="mt-3 space-y-3">
              {hasMetadata && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs font-semibold mb-2">Metadata</div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(entry.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {entry.stackTrace && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs font-semibold mb-2">Stack Trace</div>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {entry.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LogViewer({
  logs,
  sources = [],
  onLoadMore,
  onRefresh,
  onExport,
  autoScroll = false,
  loading = false,
  hasMore = false,
  className,
}: LogViewerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [filter, setFilter] = React.useState<LogFilter>({
    levels: [],
    sources: [],
    searchQuery: '',
  });

  // Auto-scroll effect
  React.useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      // Level filter
      if (filter.levels.length > 0 && !filter.levels.includes(log.level)) {
        return false;
      }

      // Source filter
      if (filter.sources.length > 0 && !filter.sources.includes(log.source)) {
        return false;
      }

      // Search filter
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        return (
          log.message.toLowerCase().includes(query) ||
          log.source.toLowerCase().includes(query) ||
          (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [logs, filter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const threshold = 100;

    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight - threshold &&
      hasMore &&
      !loading &&
      onLoadMore
    ) {
      onLoadMore();
    }
  };

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle>Logs</CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </Button>
            )}
            {onExport && (
              <Button variant="ghost" size="sm" onClick={() => onExport(filteredLogs)}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={filter.searchQuery}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="pl-8"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filter.levels.length > 0 || filter.sources.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {filter.levels.length + filter.sources.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2">Log Levels</Label>
                  <div className="space-y-2">
                    {(['debug', 'info', 'warning', 'error', 'critical'] as LogLevel[]).map(
                      (level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={filter.levels.includes(level)}
                            onCheckedChange={(checked) => {
                              setFilter((prev) => ({
                                ...prev,
                                levels: checked
                                  ? [...prev.levels, level]
                                  : prev.levels.filter((l) => l !== level),
                              }));
                            }}
                          />
                          <label htmlFor={level} className="flex items-center gap-2 cursor-pointer">
                            <LogLevelBadge level={level} />
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {sources.length > 0 && (
                  <div>
                    <Label className="mb-2">Sources</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {sources.map((source) => (
                        <div key={source} className="flex items-center space-x-2">
                          <Checkbox
                            id={source}
                            checked={filter.sources.includes(source)}
                            onCheckedChange={(checked) => {
                              setFilter((prev) => ({
                                ...prev,
                                sources: checked
                                  ? [...prev.sources, source]
                                  : prev.sources.filter((s) => s !== source),
                              }));
                            }}
                          />
                          <label htmlFor={source} className="text-sm cursor-pointer">
                            {source}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setFilter({ levels: [], sources: [], searchQuery: '' })}
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef} onScroll={handleScroll}>
          <div className="min-h-0">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-4" />
                <p>No logs found</p>
              </div>
            ) : (
              <>
                {filteredLogs.map((log) => (
                  <LogEntryComponent key={log.id} entry={log} onCopy={handleCopy} />
                ))}
                {loading && (
                  <div className="text-center py-4">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
