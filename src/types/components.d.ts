declare module "@/components/empty-placeholder" {
  export const EmptyPlaceholder: React.FC<React.HTMLAttributes<HTMLDivElement>> & {
    Icon: React.FC<{ name: string } & React.SVGProps<SVGSVGElement>>;
    Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
    Description: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
  }
}

declare module "@/components/page-header" {
  interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    heading: string;
    description?: string;
    children?: React.ReactNode;
  }

  export const PageHeader: React.FC<PageHeaderProps>;
}
