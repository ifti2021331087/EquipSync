import { getAllEquipmentAction, getTotalEquipmentCountAction } from '@/actions/adminActions'
import { getUserRequestsAction, getUserTotalBookingCount } from '@/actions/userActions'
import AdminEquipmentCard from '@/components/admin/adminEquipmentCard'
import UploadEquipmentForm from '@/components/forms/UploadEquipmentForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import RequestCard from '@/components/user/RequestCard'
import PendingRequestCard from '@/components/user/RequestCard'
import { bookingStatusEnum } from '@/utils/extraForSchema'
import { EquipmentCategories } from '@/utils/extraUtils'
import { Camera, PackageOpen, Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type RequestStatus = "active" | "pending" | "approved" | "returned" | "denied" | "cancelled" | "late";

export default async function Requests({ searchParams }:
    { searchParams: Promise<{ status?: RequestStatus }> }
) {
    const params = await searchParams;
    const status = params.status || undefined;
    const allRequests=await getUserRequestsAction(status);
    const data = await getUserTotalBookingCount();
    const totalRequests = Array.isArray(data) && data.length > 0 ? data[0].totalRequests : 0;
    return (
        <div className="space-y-6">
            <h1 className='text-lg font-semibold'>My Requests</h1>
            <Label>All submitted checkout requests</Label>
            <div className='flex gap-2 flex-wrap'>
                <Link href="/requests">
                    <Button variant={!status ? "default" : "outline"} className="rounded-full h-8 px-4 text-xs">
                        All ({totalRequests})
                    </Button>
                </Link>
                {
                    bookingStatusEnum.enumValues.map((statusValue, index) => (
                        <Link key={index} href={`/requests?status=${statusValue}`}>
                            <Button
                                variant={status=== statusValue ? "default" : "outline"}
                                className="rounded-full h-8 px-4 text-xs"
                            >
                                {statusValue} 
                            </Button>
                        </Link>
                    ))
                }
            </div>

            {/* Render Logic: Either show the Empty State OR the Grid */}
            {allRequests.length === 0 ? (
                
                /* Centered, Middle-of-the-Page Empty State (Outside the grid) */
                <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8 mt-6 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
                    <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                        <PackageOpen className="w-7 h-7 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        No request found
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                        {status
                            ? `We couldn't find any request under the "${status}" status.`
                            : "Your inventory is completely empty. Start tracking your assets by adding your first piece of equipment."}
                    </p>
                </div>

            ) : (

                /* The actual Grid (only renders if items exist) */
                <div className="flex flex-col gap-2">
                    {
                        allRequests.map((request, index) => (
                            <RequestCard key={index} request={request}></RequestCard>
                        ))
                    }
                </div>
            )}
        </div>
    )
}