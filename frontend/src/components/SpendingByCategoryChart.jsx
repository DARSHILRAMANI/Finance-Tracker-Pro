// import React, { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Tooltip,
//   Cell,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const SpendingByCategoryDonutChart = ({ categoryData }) => {
//   const [focusedCategory, setFocusedCategory] = useState(null);

//   const totalSpending = categoryData.reduce((sum, item) => sum + item.value, 0);

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(value);
//   };

//   const COLORS = categoryData.map((item) => item.color || "#3B82F6");

//   const handleLegendClick = (categoryName) => {
//     setFocusedCategory(focusedCategory === categoryName ? null : categoryName);
//   };

//   const filteredData = focusedCategory
//     ? categoryData.filter((item) => item.name === focusedCategory)
//     : categoryData;

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700 bg-opacity-90">
//           <p className="text-sm font-semibold">{data.name}</p>
//           <p className="text-xs">
//             Spending: {formatCurrency(data.value)} (
//             {((data.value / totalSpending) * 100).toFixed(1)}%)
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Custom label function for outside labels with lines and proper alignment
//   const renderCustomizedLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//     index,
//     name,
//   }) => {
//     const RADIAN = Math.PI / 180;
//     // position the label 20px outside the outerRadius
//     const radius = outerRadius + 20;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="#333"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         fontSize={14}
//         fontWeight="600"
//       >
//         {`${name}: ${(percent * 100).toFixed(1)}%`}
//       </text>
//     );
//   };

//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300 w-full">
//       <div className="mb-4 flex justify-between items-center">
//         <h3 className="text-2xl font-bold text-gray-900">
//           Spending by Category
//         </h3>
//         {focusedCategory && (
//           <button
//             onClick={() => setFocusedCategory(null)}
//             className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             Clear Filter
//           </button>
//         )}
//       </div>
//       <p className="text-lg text-gray-500 mb-6">
//         Total Spending: {formatCurrency(totalSpending)}
//       </p>

//       {categoryData.length === 0 ? (
//         <div className="text-center text-gray-600 py-12 text-xl">
//           No expense data available.
//         </div>
//       ) : (
//         <>
//           <ResponsiveContainer width="100%" height={450}>
//             <PieChart>
//               <Pie
//                 data={filteredData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={75}
//                 outerRadius={150}
//                 fill="#8884d8"
//                 paddingAngle={4}
//                 onClick={(entry) => handleLegendClick(entry.name)}
//                 isAnimationActive={true}
//                 cursor="pointer"
//                 labelLine={true} // show label lines
//                 label={renderCustomizedLabel} // use custom label renderer
//               >
//                 {filteredData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={entry.color || COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//               <Legend
//                 verticalAlign="bottom"
//                 height={48}
//                 onClick={(e) => handleLegendClick(e.value)}
//                 wrapperStyle={{ cursor: "pointer" }}
//                 formatter={(value) => (
//                   <span className="text-gray-700 font-semibold">{value}</span>
//                 )}
//               />
//             </PieChart>
//           </ResponsiveContainer>

//           <div className="flex flex-wrap gap-3 mt-6 justify-center">
//             {categoryData.map((category) => (
//               <button
//                 key={category.name}
//                 onClick={() => handleLegendClick(category.name)}
//                 className={`px-4 py-2 rounded-full text-base font-semibold transition-colors ${
//                   focusedCategory === category.name
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800"
//                 }`}
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SpendingByCategoryDonutChart;

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SpendingByCategoryChart = ({ categoryData }) => {
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
        <div className="bg-gray-800 text-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-700 bg-opacity-90">
          <p className="text-xs sm:text-sm font-semibold">{data.name}</p>
          <p className="text-xs">
            Spending: {formatCurrency(data.value)} (
            {((data.value / totalSpending) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function for outside labels - responsive
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
    // Adjust radius based on screen size
    const radius = outerRadius + (window.innerWidth < 640 ? 15 : 20);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Don't show labels on very small screens
    if (window.innerWidth < 480) return null;

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={window.innerWidth < 640 ? 10 : 12}
        fontWeight="600"
      >
        {window.innerWidth < 640
          ? `${(percent * 100).toFixed(1)}%`
          : `${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Mobile category list component
  const MobileCategoryList = () => (
    <div className="space-y-2 mb-4">
      {categoryData.map((category) => {
        const percentage = ((category.value / totalSpending) * 100).toFixed(1);
        const isSelected = focusedCategory === category.name;

        return (
          <div
            key={category.name}
            onClick={() => handleLegendClick(category.name)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
              isSelected
                ? "bg-blue-50 border-2 border-blue-200"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {category.name}
              </span>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-semibold ${
                  isSelected ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {formatCurrency(category.value)}
              </div>
              <div className="text-xs text-gray-500">{percentage}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Desktop category buttons
  const DesktopCategoryButtons = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 justify-center">
      {categoryData.map((category) => (
        <button
          key={category.name}
          onClick={() => handleLegendClick(category.name)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-colors ${
            focusedCategory === category.name
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 transition-transform duration-300 hover:scale-[1.01] w-full">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
            Spending by Category
          </h3>
          <p className="text-sm sm:text-lg text-gray-500 mt-1">
            Total Spending: {formatCurrency(totalSpending)}
          </p>
        </div>
        {focusedCategory && (
          <button
            onClick={() => setFocusedCategory(null)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-center"
          >
            Clear Filter
          </button>
        )}
      </div>

      {categoryData.length === 0 ? (
        <div className="text-center text-gray-600 py-12 text-lg sm:text-xl">
          No expense data available.
        </div>
      ) : (
        <>
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <MobileCategoryList />
            {focusedCategory && (
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={filteredData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      isAnimationActive={true}
                    >
                      {filteredData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={filteredData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={4}
                  onClick={(entry) => handleLegendClick(entry.name)}
                  isAnimationActive={true}
                  cursor="pointer"
                  labelLine={true}
                  label={renderCustomizedLabel}
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
                  height={36}
                  onClick={(e) => handleLegendClick(e.value)}
                  wrapperStyle={{ cursor: "pointer" }}
                  formatter={(value) => (
                    <span className="text-gray-700 font-semibold text-sm">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <DesktopCategoryButtons />
          </div>

          {/* Mobile Summary Stats */}
          <div className="block sm:hidden mt-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Categories:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    {categoryData.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Avg per category:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    {formatCurrency(totalSpending / categoryData.length)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Highest:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    {formatCurrency(
                      Math.max(...categoryData.map((c) => c.value))
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Lowest:</span>
                  <span className="ml-2 font-semibold text-gray-700">
                    {formatCurrency(
                      Math.min(...categoryData.map((c) => c.value))
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingByCategoryChart;
