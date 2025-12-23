interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <table className="w-full text-left text-sm">
      {children}
    </table>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return <thead className="bg-neutral-50 border-b border-neutral-200">{children}</thead>;
}

interface TableBodyProps {
  children: React.ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-neutral-200">{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
}

export function TableRow({ children }: TableRowProps) {
  return <tr className="hover:bg-neutral-50 transition">{children}</tr>;
}

interface TableHeadProps {
  children: React.ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return <th className="px-6 py-4 font-semibold text-neutral-900">{children}</th>;
}

interface TableCellProps {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}

export function TableCell({ children, colSpan, className = '' }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-neutral-700 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}
