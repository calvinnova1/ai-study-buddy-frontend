'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ProgressChart({ data, type = 'line', title, height = 300 }) {
  
  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Sample data if none provided (for demo purposes)
  const sampleData = [
    { name: 'Quiz 1', score: 65 },
    { name: 'Quiz 2', score: 75 },
    { name: 'Quiz 3', score: 80 },
    { name: 'Quiz 4', score: 85 },
    { name: 'Quiz 5', score: 90 },
  ];

  const chartData = data && data.length > 0 ? data : sampleData;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-600">
            Score: <span className="font-semibold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      {/* Chart Header */}
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {/* Chart Container */}
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          {type === 'line' ? (
            // Line Chart - for tracking progress over time
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Quiz Score (%)"
              />
            </LineChart>
          ) : type === 'bar' ? (
            // Bar Chart - for comparing scores
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
              />
              <Bar 
                dataKey="score" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Quiz Score (%)"
              />
            </BarChart>
          ) : type === 'pie' ? (
            // Pie Chart - for category distribution
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : null}
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {chartData.length}
            </p>
            <p className="text-sm text-gray-600">Total Entries</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {chartData.length > 0 
                ? Math.max(...chartData.map(d => d.score || d.value || 0)) 
                : 0}%
            </p>
            <p className="text-sm text-gray-600">Highest Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {chartData.length > 0 
                ? Math.round(chartData.reduce((sum, d) => sum + (d.score || d.value || 0), 0) / chartData.length)
                : 0}%
            </p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">Showing Sample Data</p>
              <p className="text-xs text-yellow-700 mt-1">Complete quizzes to see your actual progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}