import { BottomNav } from "@/components/BottomNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
