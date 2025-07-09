import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SpendingByCategoryDonutChart = ({ categoryData }) => {
  const [focusedCategory, setFocusedCategory] = useState(null);

  const totalSpending = categoryData.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = categoryData.map((item) => item.color || "#3B82F6");

  const handleLegendClick = (categoryName) => {
    setFocusedCategory(focusedCategory === categoryName ? null : categoryName);
  };

  const filteredData = focusedCategory
    ? categoryData.filter((item) => item.name === focusedCategory)
    : categoryData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 bg-opacity-90">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-xs">
            Spending: {formatCurrency(data.value)} (
            {((data.value / totalSpending) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function for outside labels with lines and proper alignment
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    // position the label 20px outside the outerRadius
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="600"
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300 w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">
          Spending by Category
        </h3>
        {focusedCategory && (
          <button
            onClick={() => setFocusedCategory(null)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>
      <p className="text-lg text-gray-500 mb-6">
        Total Spending: {formatCurrency(totalSpending)}
      </p>

      {categoryData.length === 0 ? (
        <div className="text-center text-gray-600 py-12 text-xl">
          No expense data available.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={150}
                fill="#8884d8"
                paddingAngle={4}
                onClick={(entry) => handleLegendClick(entry.name)}
                isAnimationActive={true}
                cursor="pointer"
                labelLine={true} // show label lines
                label={renderCustomizedLabel} // use custom label renderer
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={48}
                onClick={(e) => handleLegendClick(e.value)}
                wrapperStyle={{ cursor: "pointer" }}
                formatter={(value) => (
                  <span className="text-gray-700 font-semibold">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {categoryData.map((category) => (
              <button
                key={category.name}
                onClick={() => handleLegendClick(category.name)}
                className={`px-4 py-2 rounded-full text-base font-semibold transition-colors ${
                  focusedCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingByCategoryDonutChart;
