import { Expense } from '../services/storage';

export const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportTransactionsToCSV = (expenses: Expense[]) => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Created At', 'Updated At'];
    const rows = expenses.map(e => [
        e.id,
        e.date,
        e.type,
        e.category,
        e.desc,
        e.amount,
        e.createdAt,
        e.updatedAt
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    downloadCSV(csvContent, `transactions-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportReportToCSV = (summary: any, categoryBreakdown: any[], budgets: any[], monthlySpending: any[]) => {
    const lines = [
        ['--- Summary Section ---'],
        ['Total Expenses', summary.expense],
        ['Total Income', summary.income],
        ['Net Balance', summary.income - summary.expense],
        ['Average Monthly Spend', summary.monthlyAverage],
        [''],
        ['--- Category Breakdown ---'],
        ['Category', 'Total Spend', 'Count', 'Percentage'],
        ...categoryBreakdown.map(c => [c.name, c.value, c.count || 0, c.percentage]),
        [''],
        ['--- Budget Statistics ---'],
        ['Category', 'Limit', 'Spent', 'Remaining', 'Utilization %', 'Status'],
        ...budgets.map(b => [b.category, b.limit, b.spent, b.limit - b.spent, b.percentage, b.percentage > 100 ? 'Exceeded' : 'Safe']),
        [''],
        ['--- Monthly Trend ---'],
        ['Month', 'Spending'],
        ...monthlySpending.map(m => [m.name, m.value])
    ];

    const csvContent = lines.map(l => l.join(',')).join('\n');
    downloadCSV(csvContent, `expense-report-${new Date().toISOString().split('T')[0]}.csv`);
};
