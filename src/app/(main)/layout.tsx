import BottomNav from '@/components/BottomNav'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#05050a] flex justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[800px] bg-accent-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[600px] bg-accent-gold/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-[430px] bg-bg min-h-screen relative shadow-2xl">
        <main className="pb-20">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
