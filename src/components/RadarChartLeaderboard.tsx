'use client';

import React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RadarData {
  technicalAnalysis: number;
  riskManagement: number;
  psychology: number;
  discipline: number;
  knowledge: number;
}

interface RadarChartLeaderboardProps {
  data: RadarData;
  userName?: string;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

/**
 * RadarChart Component for Warrior Profile
 * 
 * Displays 5 dimensions of warrior performance:
 * 1. Technical Analysis - Trading technique knowledge
 * 2. Risk Management - Position sizing & stop loss discipline
 * 3. Psychology - Emotional control & mindset
 * 4. Discipline - Consistency in journaling & trading plan
 * 5. Knowledge - Learning progress from modules
 * 
 * Each dimension is scored 0-100
 */
export const RadarChartLeaderboard: React.FC<RadarChartLeaderboardProps> = ({
  data,
  userName = 'Warrior',
  size = 'medium',
  interactive = true
}) => {
  // Transform data for Recharts format
  const chartData = [
    {
      name: '📊 Technical\nAnalysis',
      value: data.technicalAnalysis,
      fullName: 'Technical Analysis'
    },
    {
      name: '⚠️ Risk\nManagement',
      value: data.riskManagement,
      fullName: 'Risk Management'
    },
    {
      name: '🧠 Psychology',
      value: data.psychology,
      fullName: 'Psychology'
    },
    {
      name: '🎯 Discipline',
      value: data.discipline,
      fullName: 'Discipline'
    },
    {
      name: '📚 Knowledge',
      value: data.knowledge,
      fullName: 'Knowledge'
    }
  ];

  // Determine size values
  const sizeConfig = {
    small: { height: 250, width: '100%' },
    medium: { height: 350, width: '100%' },
    large: { height: 450, width: '100%' }
  };

  // Determine dimension color
  const getDimensionColor = (score: number): string => {
    if (score >= 80) return '#22c55e'; // Green - Excellent
    if (score >= 60) return '#3b82f6'; // Blue - Good
    if (score >= 40) return '#f59e0b'; // Amber - Fair
    return '#ef4444'; // Red - Needs Improvement
  };

  // Custom tooltip
  const CustomTooltip = (props: any) => {
    if (!props.active || !props.payload || props.payload.length === 0) {
      return null;
    }

    const data = props.payload[0];
    const score = data.value;
    let level = '';

    if (score >= 80) level = '⭐⭐⭐ Excellent';
    else if (score >= 60) level = '⭐⭐ Good';
    else if (score >= 40) level = '⭐ Fair';
    else level = '⚠️ Needs Work';

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold text-sm">{data.payload.fullName}</p>
        <p className="text-amber-400 font-bold text-lg">{score}/100</p>
        <p className="text-gray-300 text-xs mt-1">{level}</p>
      </div>
    );
  };

  // Overall score
  const overallScore = Math.round(
    (data.technicalAnalysis +
      data.riskManagement +
      data.psychology +
      data.discipline +
      data.knowledge) / 5
  );

  // Determine overall level
  const getOverallLevel = (score: number): string => {
    if (score >= 80) return 'Master Trader';
    if (score >= 65) return 'Advanced Warrior';
    if (score >= 50) return 'Consistent Trader';
    if (score >= 35) return 'Learning Warrior';
    return 'Beginner';
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-100">{userName}'s Trading Profile</h3>
        
        {/* Overall Score Badge */}
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-lg p-3">
          <div>
            <p className="text-sm text-gray-300">Overall Performance</p>
            <p className="text-2xl font-bold text-amber-400">{overallScore}/100</p>
            <p className="text-xs text-gray-400 mt-1">{getOverallLevel(overallScore)}</p>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{overallScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 overflow-auto">
        <ResponsiveContainer width={sizeConfig[size].width} height={sizeConfig[size].height}>
          <RechartsRadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid 
              stroke="#374151" 
              strokeDasharray="5 5"
              gridType="polygon"
            />
            
            <PolarAngleAxis
              dataKey="name"
              tick={{ 
                fill: '#d1d5db',
                fontSize: 12,
                fontWeight: 500
              }}
              type="number"
            />
            
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              label={{ fill: '#9ca3af', fontSize: 10 }}
            />

            <Radar
              name="Score"
              dataKey="value"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.6}
              dot={{
                fill: '#fbbf24',
                r: 5,
                strokeWidth: 2,
                stroke: '#fff'
              }}
              activeDot={{
                r: 7,
                fill: '#fcd34d',
                stroke: '#fff',
                strokeWidth: 2
              }}
            />

            {interactive && (
              <>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </>
            )}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div 
            key={index}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-200">{item.fullName}</span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-gray-700 text-gray-100">
                {item.value}/100
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: getDimensionColor(item.value)
                }}
              />
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400">
              {item.value >= 80 && '✅ Excellent - Maintain this performance'}
              {item.value >= 60 && item.value < 80 && '👍 Good - Room for improvement'}
              {item.value >= 40 && item.value < 60 && '⚠️ Fair - Focus on this area'}
              {item.value < 40 && '🔴 Needs attention - Priority improvement'}
            </p>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 space-y-2">
        <h4 className="text-sm font-semibold text-blue-300">💡 Key Insights</h4>
        
        {(() => {
          const scores = [
            { name: 'Technical Analysis', value: data.technicalAnalysis },
            { name: 'Risk Management', value: data.riskManagement },
            { name: 'Psychology', value: data.psychology },
            { name: 'Discipline', value: data.discipline },
            { name: 'Knowledge', value: data.knowledge }
          ];

          const best = scores.reduce((a, b) => a.value > b.value ? a : b);
          const worst = scores.reduce((a, b) => a.value < b.value ? a : b);

          return (
            <>
              <p className="text-xs text-gray-300">
                <span className="font-semibold text-green-400">Strength:</span> {best.name} ({best.value}/100)
              </p>
              <p className="text-xs text-gray-300">
                <span className="font-semibold text-orange-400">Focus Area:</span> {worst.name} ({worst.value}/100)
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Recommendation: Allocate time to improve {worst.name} while maintaining {best.name} excellence.
              </p>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default RadarChartLeaderboard;
