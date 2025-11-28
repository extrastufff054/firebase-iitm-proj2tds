'use client';

import { useState, useEffect, type ReactNode, type ElementType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FlaskConical,
  GraduationCap,
  LayoutGrid,
  LogOut,
  PanelLeft,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

function Icon({ as, ...props }: { as: ElementType, [key: string]: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const IconComponent = as;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    const size = props.size || 24;
    const width = props.width || size;
    const height = props.height || size;
    return <div style={{ width, height }} />;
  }

  return <IconComponent {...props} />;
}


export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/quiz'}
                tooltip="Quiz"
              >
                <Link href="/quiz">
                  <Icon as={LayoutGrid} />
                  <span>Quiz</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/quiz/prompt-tester'}
                tooltip="Prompt Tester"
              >
                <Link href="/quiz/prompt-tester">
                  <Icon as={FlaskConical} />
                  <span>Prompt Tester</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/quiz/results'}
                tooltip="Results"
              >
                <Link href="/quiz/results">
                  <Icon as={GraduationCap} />
                  <span>Results</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <Link href="/">
                  <Icon as={LogOut} />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden">
              <Icon as={PanelLeft} />
            </SidebarTrigger>
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-2xl">
                    {pathname.includes('prompt-tester') ? 'Prompt Tester' : pathname.includes('results') ? 'Quiz Results' : 'Quiz Solver'}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
