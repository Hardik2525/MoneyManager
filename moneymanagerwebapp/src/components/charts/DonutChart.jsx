import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../../util/format";

const DonutTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.name}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(item.value)}
            </p>
        </div>
    );
};

const DonutChart = ({ data, centerLabel, centerValue }) => (
    <div>
        <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="name"
                        innerRadius="68%"
                        outerRadius="95%"
                        paddingAngle={2}
                        stroke="none"
                    >
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-gray-500 dark:text-gray-400">{centerLabel}</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{centerValue}</p>
            </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}
                </div>
            ))}
        </div>
    </div>
);

export default DonutChart;
