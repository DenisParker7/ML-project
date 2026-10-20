import React from 'react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { ApiService } from '../../services/api';
import { Share2, Sliders, Info } from 'lucide-react';

export const CrossZoneGraphView: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZoneId, graphAlpha, setGraphAlpha, theme } = useGreenhouse();
  const isDark = theme === 'dark';
  const graph = ApiService.getDynamicGraph();

  const nodePositions: Record<string, { x: number; y: number; label: string }> = {
    'zone-1': { x: 100, y: 80, label: 'Zone 1 (A1)' },
    'zone-2': { x: 300, y: 80, label: 'Zone 2 (A2)' },
    'zone-3': { x: 100, y: 220, label: 'Zone 3 (B1)' },
    'zone-4': { x: 300, y: 220, label: 'Zone 4 (B2)' },
    'zone-5': { x: 100, y: 360, label: 'Zone 5 (C1)' },
    'zone-6': { x: 300, y: 360, label: 'Zone 6 (C2)' },
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] dark:border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#323232] dark:text-white" />
            <h3 className="text-base font-bold text-[#323232] dark:text-white tracking-tight">
              Dynamic Cross-Zone Relationship Graph (C3SI $G_t$)
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#777777] dark:text-[#AAAAAA] font-mono">
            Formulation: <span className="text-[#323232] dark:text-white font-bold">$w_{'{ij,t}'} = \alpha a_{'{ij}'} + (1-\alpha) s_{'{ij,t}'}$</span> (Physical Adjacency + Behavioral Similarity)
          </p>
        </div>

        {/* Alpha Parameter Slider */}
        <div className="flex items-center gap-3 rounded-full bg-[#F8F8F8] dark:bg-[#222222] px-5 py-2 border border-[#E5E5E5] dark:border-[#2D2D2D] shadow-sm">
          <Sliders className="w-4 h-4 text-[#323232] dark:text-white" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[#555555] dark:text-[#AAAAAA] font-semibold">Graph Weight $\alpha$:</span>
              <span className="font-mono font-bold text-[#323232] dark:text-white">{graphAlpha.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
              <span className="text-[#888888] dark:text-[#888888]">Behavioral ($s$)</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={graphAlpha}
                onChange={e => setGraphAlpha(parseFloat(e.target.value))}
                className="w-28 accent-[#323232] dark:accent-white cursor-pointer h-1.5 bg-[#E0E0E0] dark:bg-[#3D3D3D] rounded-lg"
              />
              <span className="text-[#888888] dark:text-[#888888]">Physical ($a$)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Graph Canvas */}
        <div className="lg:col-span-2 relative flex items-center justify-center rounded-2xl bg-[#F8F8F8] dark:bg-[#151515] border border-[#EAEAEA] dark:border-[#262626] p-4 min-h-[420px]">
          <svg className="w-full h-[400px]" viewBox="0 0 400 440">
            {/* Render Graph Edges */}
            {graph.edges.map(edge => {
              const p1 = nodePositions[edge.source];
              const p2 = nodePositions[edge.target];
              if (!p1 || !p2) return null;

              const dynamicWeight = graphAlpha * edge.physicalAdjacency + (1 - graphAlpha) * edge.behavioralSimilarity;
              const strokeWidth = Math.max(1.5, dynamicWeight * 4);
              const opacity = Math.max(0.25, dynamicWeight * 0.85);

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={`${edge.source}-${edge.target}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isDark ? '#EAEAEA' : '#323232'}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeDasharray={edge.physicalAdjacency < 0.5 ? '4 4' : 'none'}
                  />
                  {/* Weight label bubble */}
                  <rect
                    x={midX - 15}
                    y={midY - 9}
                    width={30}
                    height={18}
                    rx={4}
                    fill={isDark ? '#222222' : '#FFFFFF'}
                    stroke={isDark ? '#444444' : '#E0E0E0'}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isDark ? '#FFFFFF' : '#323232'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {dynamicWeight.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Render Graph Nodes */}
            {zones.map(zone => {
              const pos = nodePositions[zone.id];
              if (!pos) return null;
              const isSelected = zone.id === selectedZoneId;

              let fillColor = isDark ? '#2A2A2A' : '#323232';
              let strokeColor = isDark ? '#444444' : '#323232';
              if (zone.status === 'Critical') {
                fillColor = '#8A3324';
                strokeColor = '#8A3324';
              } else if (zone.status === 'Moderate') {
                fillColor = '#B57E36';
                strokeColor = '#B57E36';
              } else if (zone.status === 'Mild') {
                fillColor = '#666666';
                strokeColor = '#666666';
              }

              return (
                <g
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                >
                  {/* Selected / Critical Halo */}
                  {(isSelected || zone.status === 'Critical') && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={32}
                      fill="none"
                      stroke={isSelected ? (isDark ? '#FFFFFF' : '#111111') : strokeColor}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      className="opacity-70"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={24}
                    fill={fillColor}
                    stroke={isSelected ? '#FFFFFF' : strokeColor}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  {/* Zone Short Label */}
                  <text
                    x={pos.x}
                    y={pos.y - 1}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {zone.name.split(' ')[1]}
                  </text>

                  {/* Stress Type Under Node */}
                  <text
                    x={pos.x}
                    y={pos.y + 11}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8"
                    opacity={0.9}
                  >
                    {zone.currentStress === 'Healthy' ? 'Healthy' : zone.currentStress.split(' ')[0]}
                  </text>

                  {/* Zone Badge under */}
                  <text
                    x={pos.x}
                    y={pos.y + 38}
                    textAnchor="middle"
                    fill={isDark ? '#EAEAEA' : '#323232'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {pos.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Edge & Node Inspector */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#EAEAEA] dark:border-[#262626] p-5 shadow-clean">
          <div>
            <div className="flex items-center gap-2 border-b border-[#F0F0F0] dark:border-[#262626] pb-3">
              <Info className="w-4 h-4 text-[#323232] dark:text-white" />
              <h4 className="text-sm font-bold text-[#323232] dark:text-white tracking-tight">Zone Graph Inspector</h4>
            </div>

            {(() => {
              const selZone = zones.find(z => z.id === selectedZoneId) || zones[0];
              const connectedEdges = graph.edges.filter(
                e => e.source === selZone.id || e.target === selZone.id
              );

              return (
                <div className="mt-3 space-y-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#888888] dark:text-[#AAAAAA]">Inspecting Node:</span>
                    <p className="text-sm font-bold text-[#323232] dark:text-white">{selZone.name}</p>
                    <p className="text-xs text-[#555555] dark:text-[#CCCCCC]">
                      Crop: {selZone.cropType} ({selZone.cropStage})
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#222222] p-3 border border-[#EAEAEA] dark:border-[#2D2D2D] text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#707070] dark:text-[#AAAAAA]">Stress Status:</span>
                      <span className="font-bold text-[#323232] dark:text-white">{selZone.currentStress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707070] dark:text-[#AAAAAA]">Data Reliability ($q$):</span>
                      <span className="text-[#323232] dark:text-white font-bold">{(selZone.reliabilityScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707070] dark:text-[#AAAAAA]">Uncertainty:</span>
                      <span className="text-[#555555] dark:text-[#CCCCCC]">{selZone.uncertaintyScore.toFixed(3)}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#707070] dark:text-[#AAAAAA] mt-2 mb-1.5">
                      Adjacencies & Edge Weights ($w_{'{ij}'}$)
                    </h5>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {connectedEdges.map(edge => {
                        const neighborId = edge.source === selZone.id ? edge.target : edge.source;
                        const neighbor = zones.find(z => z.id === neighborId);
                        const dynamicWeight = graphAlpha * edge.physicalAdjacency + (1 - graphAlpha) * edge.behavioralSimilarity;

                        return (
                          <div
                            key={`${edge.source}-${edge.target}`}
                            className="flex items-center justify-between rounded-xl bg-[#F8F8F8] dark:bg-[#222222] p-2.5 text-xs border border-[#EAEAEA] dark:border-[#2D2D2D] hover:border-[#323232] dark:hover:border-white cursor-pointer transition-colors"
                            onClick={() => setSelectedZoneId(neighborId)}
                          >
                            <span className="font-semibold text-[#323232] dark:text-white">
                              {neighbor?.name.split(' - ')[0]}
                            </span>
                            <div className="text-right font-mono">
                              <span className="font-bold text-[#323232] dark:text-white">
                                w: {dynamicWeight.toFixed(2)}
                              </span>
                              <span className="block text-[10px] text-[#888888] dark:text-[#AAAAAA]">
                                (a: {edge.physicalAdjacency}, s: {edge.behavioralSimilarity})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#222222] p-3 text-[11px] text-[#555555] dark:text-[#AAAAAA] border border-[#EAEAEA] dark:border-[#2D2D2D]">
            Tip: Adjust the $\alpha$ slider above to balance physical pipe adjacency against real-time behavioral correlation.
          </div>
        </div>
      </div>
    </div>
  );
};
