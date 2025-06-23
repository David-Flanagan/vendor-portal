import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Download, Trash2 } from 'lucide-react';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface MediaGalleryProps {
  items: MediaItem[];
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  className?: string;
  view?: 'grid' | 'carousel';
  columns?: number;
  aspectRatio?: number;
  showControls?: boolean;
}

export function MediaGallery({
  items,
  onDelete,
  onDownload,
  className,
  view = 'grid',
  columns = 3,
  aspectRatio = 16 / 9,
  showControls = true,
}: MediaGalleryProps) {
  const [activeView, setActiveView] = React.useState(view);

  const renderMedia = (item: MediaItem) =>
    item.type === 'video' ? (
      <video
        src={item.url}
        poster={item.thumbnail}
        controls
        className="w-full h-full object-cover"
      />
    ) : (
      <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" />
    );

  const renderControls = (item: MediaItem) => (
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onDownload?.(item.id);
        }}
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(item.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderGrid = () => (
    <div className={cn('grid gap-4', `grid-cols-${columns}`)}>
      {items.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <div
              className={cn(
                'group relative cursor-pointer overflow-hidden rounded-lg border',
                'hover:border-primary/50 transition-colors'
              )}
              style={{ aspectRatio }}
            >
              {renderMedia(item)}
              {showControls && renderControls(item)}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative" style={{ aspectRatio }}>
              {renderMedia(item)}
            </div>
            {(item.title || item.description) && (
              <div className="mt-4 space-y-2">
                {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <Carousel className="w-full">
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio }}>
              {renderMedia(item)}
              {showControls && renderControls(item)}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

  return (
    <div className={cn('space-y-4', className)}>
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'grid' | 'carousel')}>
        <TabsList>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="carousel" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Carousel
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="grid" className="mt-0">
        {renderGrid()}
      </TabsContent>

      <TabsContent value="carousel" className="mt-0">
        {renderCarousel()}
      </TabsContent>
    </div>
  );
}
