import { getPendingRequestsAction } from '@/actions/userActions'
import { Badge } from '@/components/ui/badge'
import PendingRequestCard from '@/components/user/pendingRequestCard'
import { auth } from '@/lib/auth'
import { Send } from 'lucide-react'
import { headers } from 'next/headers'
import React from 'react'

// Import Shadcn Pagination Components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface CheckoutsProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Checkouts({ searchParams }: CheckoutsProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  const userId = session?.user.id;
  if (!userId) {
    return null;
  }

  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const ITEMS_PER_PAGE = 4; 

  const pendingRequests = await getPendingRequestsAction(userId);
  if (!Array.isArray(pendingRequests)) {
    return null;
  }

  const totalItems = pendingRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRequests = pendingRequests.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 bg-background/90">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
          <Send className="w-5 h-5" />
          Pending Requests
        </div>
        <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/50">
          {totalItems} awaiting review
        </Badge>
      </div>

      {/* Requests List */}
      <div className="flex flex-col gap-4">
        {paginatedRequests.length > 0 ? (
          paginatedRequests.map((request, index) => (
            <PendingRequestCard key={index} request={request} />
          ))
        ) : (
          <div className="text-center py-10 text-sm text-zinc-500 border border-dashed rounded-2xl">
            No pending requests on this page.
          </div>
        )}
      </div>

      {/* --- SHADCN PAGINATION --- */}
      {totalPages > 1 && (
        <Pagination className="">
          <PaginationContent>
            
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious 
                href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"} 
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    href={`?page=${pageNum}`} 
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext 
                href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"} 
                aria-disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}