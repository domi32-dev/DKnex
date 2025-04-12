'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

type PageItem = {
  id: string;
  header: string;
  type: string;
  status: string; // 0, 1, 2
  target: string; // publish start
  reviewer: string; // created by
  modified?: string;
};

export function AnalyticsList() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [filteredPages, setFilteredPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | '0' | '1' | '2'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch('/api/sppages');
        const data = await res.json();

        if (Array.isArray(data.pages)) {
          setPages(data.pages);
          setFilteredPages(data.pages);
        } else {
          console.error('Invalid API response:', data);
          setPages([]);
          setFilteredPages([]);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setPages([]);
        setFilteredPages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  useEffect(() => {
    let result = [...pages];

    if (filter !== 'All') {
      result = result.filter((p) => p.status === filter);
    }

    if (search.trim()) {
      result = result.filter(
        (p) =>
          p.header.toLowerCase().includes(search.toLowerCase()) ||
          p.reviewer.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredPages(result);
  }, [filter, search, pages]);

  const getPromotedLabel = (status: string) => {
    switch (status) {
      case '1':
        return 'Draft';
      case '2':
        return 'Published';
      default:
        return 'Page';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading analytics...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-4">SharePoint Pages</CardTitle>
        <Tabs defaultValue="All" className="w-full">
          <TabsList>
            <TabsTrigger value="All" onClick={() => setFilter('All')}>
              All
            </TabsTrigger>
            <TabsTrigger value="0" onClick={() => setFilter('0')}>
              Pages
            </TabsTrigger>
            <TabsTrigger value="1" onClick={() => setFilter('1')}>
              Drafts
            </TabsTrigger>
            <TabsTrigger value="2" onClick={() => setFilter('2')}>
              News
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0">
        <ScrollArea>
          <table className="min-w-full table-auto">
            <thead className="border-b text-muted-foreground text-sm">
              <tr className="text-left">
                <th className="px-6 py-2">Title</th>
                <th className="px-6 py-2">Created By</th>
                <th className="px-6 py-2">Modified</th>
                <th className="px-6 py-2">Publish Start</th>
                <th className="px-6 py-2">Promoted</th>
                <th className="px-6 py-2">Type</th>
                <th className="px-6 py-2">ID</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredPages) && filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b hover:bg-muted transition-colors text-sm"
                  >
                    <td className="px-6 py-2 font-medium">{page.header}</td>
                    <td className="px-6 py-2">{page.reviewer}</td>
                    <td className="px-6 py-2">
                      {page.modified
                        ? new Date(page.modified).toLocaleDateString()
                        : '–'}
                    </td>
                    <td className="px-6 py-2">
                      {page.target
                        ? new Date(page.target).toLocaleDateString()
                        : '–'}
                    </td>
                    <td className="px-6 py-2">
                      <Badge
                        variant={
                          page.status === '2'
                            ? 'default'
                            : page.status === '1'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {getPromotedLabel(page.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-2">{page.type}</td>
                    <td className="px-6 py-2">{page.id.slice(0, 8)}...</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground">
                    No matching results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}