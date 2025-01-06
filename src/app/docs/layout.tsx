import { Header } from '@/components/header'
import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { DocsTableOfContents } from '@/components/docs/docs-toc'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header className="fixed top-0 z-50 w-full border-b" />
      <div className="flex-1 pt-14">
        <div className="container relative flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr_200px] md:gap-6 lg:gap-10">
          {/* Mobile sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <DocsSidebar />
            </SheetContent>
          </Sheet>

          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <div className="fixed h-[calc(100vh-3.5rem)] pt-6">
              <div className="h-full w-[220px] lg:w-[240px] overflow-y-auto pr-4 pb-10">
                <DocsSidebar />
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid">
            <div className="mx-auto w-full min-w-0">
              {children}
            </div>
          </main>

          {/* Desktop table of contents */}
          <div className="hidden lg:block">
            <div className="fixed h-[calc(100vh-3.5rem)] pt-6">
              <div className="h-full w-[200px] overflow-y-auto pl-4 pb-10">
                <DocsTableOfContents />
              </div>
            </div>
          </div>

          {/* Mobile table of contents */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="fixed right-4 bottom-4 lg:hidden">
                On this page
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] sm:w-[350px]">
              <DocsTableOfContents />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
