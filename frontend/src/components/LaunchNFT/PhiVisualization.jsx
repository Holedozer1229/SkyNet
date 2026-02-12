import React, { useState, useEffect, useRef } from 'react';
import { useContract } from '../hooks/useContract';

/**
 * PhiVisualization Component
 * Real-time Φ computation chart with eigenvector particle flow
 * 
 * Formulas:
 * - Φ_total = Σ_i (w_i * φ_i) / N
 * - ΔS_total = ΔS_geom + ΔS_protocol
 * - M-shift optimization with eigenvector particle flow:
 *   x = ((rand-0.5)*200 + val*2) * eigenVector
 *   y = ((rand-0.5)*200 + val*1.5) * eigenVector
 *   z = ((rand-0.5)*200 + val*3) * eigenVector
 */
export const PhiVisualization = () => {
  const { computePhi, getPhiDetails } = useContract();
  const [phiData, setPhiData] = useState({
    total: 0,
    weights: [],
    values: [],
    eigenVectors: [],
    history: []
  });
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Fetch Φ data from API (fallback if contract not connected)
  const fetchPhiData = async () => {
    try {
      // Try contract first
      try {
        const phiTotal = await computePhi();
        const [weights, values, eigenVectors, total] = await getPhiDetails();
        
        setPhiData(prev => ({
          total: Number(total),
          weights: weights.map(w => Number(w)),
          values: values.map(v => Number(v)),
          eigenVectors: eigenVectors.map(e => Number(e)),
          history: [...prev.history.slice(-49), {
            timestamp: Date.now(),
            value: Number(total)
          }]
        }));
      } catch {
        // Fallback to API
        const response = await fetch('http://localhost:3001/api/phi/details');
        const data = await response.json();
        
        setPhiData(prev => ({
          total: Number(data.total),
          weights: data.weights.map(w => Number(w)),
          values: data.values.map(v => Number(v)),
          eigenVectors: data.eigenVectors.map(e => Number(e)),
          history: [...prev.history.slice(-49), {
            timestamp: Date.now(),
            value: Number(data.total)
          }]
        }));
      }
    } catch (error) {
      console.error('Error fetching Φ data:', error);
    }
  };

  // Generate particles based on eigenvector flow
  const generateParticles = () => {
    if (phiData.eigenVectors.length === 0) return;

    const newParticles = [];
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
      const eigenIndex = i % phiData.eigenVectors.length;
      const eigenVector = phiData.eigenVectors[eigenIndex] / 1000; // Normalize
      const val = phiData.values[eigenIndex] / 10000; // Normalize

      // M-shift optimization with eigenvector particle flow
      const x = ((Math.random() - 0.5) * 200 + val * 2) * eigenVector;
      const y = ((Math.random() - 0.5) * 200 + val * 1.5) * eigenVector;
      const z = ((Math.random() - 0.5) * 200 + val * 3) * eigenVector;

      newParticles.push({
        id: i,
        x: 400 + x,
        y: 300 + y,
        z,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 0.5,
        size: 3 + Math.random() * 3,
        color: `hsl(${180 + eigenIndex * 30}, 70%, 60%)`,
        life: 1.0
      });
    }

    setParticles(newParticles);
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(10, 15, 30, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        // Update position
        const newX = particle.x + particle.vx;
        const newY = particle.y + particle.vy;
        const newZ = particle.z + particle.vz;

        // Update velocity with eigenvector influence
        const eigenInfluence = 0.01;
        const newVx = particle.vx * 0.99 + (Math.random() - 0.5) * eigenInfluence;
        const newVy = particle.vy * 0.99 + (Math.random() - 0.5) * eigenInfluence;
        const newVz = particle.vz * 0.99;

        // Fade out
        const newLife = particle.life - 0.01;

        // Draw particle
        const scale = 1 + newZ / 200;
        const size = particle.size * scale;
        
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = newLife;
        ctx.beginPath();
        ctx.arc(newX, newY, size, 0, Math.PI * 2);
        ctx.fill();

        // Boundary wrapping
        let wrappedX = newX;
        let wrappedY = newY;
        if (newX < 0) wrappedX = canvas.width;
        if (newX > canvas.width) wrappedX = 0;
        if (newY < 0) wrappedY = canvas.height;
        if (newY > canvas.height) wrappedY = 0;

        return {
          ...particle,
          x: wrappedX,
          y: wrappedY,
          z: newZ,
          vx: newVx,
          vy: newVy,
          vz: newVz,
          life: newLife > 0 ? newLife : 1.0
        };
      });
    });

    ctx.globalAlpha = 1.0;
    animationRef.current = requestAnimationFrame(animate);
  };

  // Calculate ΔS_total
  const calculateDeltaS = () => {
    if (phiData.weights.length === 0) return { geom: 0, protocol: 0, total: 0 };

    const deltaS_geom = phiData.weights.reduce((sum, w, i) => {
      return sum + Math.sqrt(w * phiData.values[i]);
    }, 0);

    const deltaS_protocol = phiData.eigenVectors.reduce((sum, e) => sum + e, 0) / phiData.eigenVectors.length;
    
    return {
      geom: deltaS_geom,
      protocol: deltaS_protocol,
      total: deltaS_geom + deltaS_protocol
    };
  };

  // Initialize
  useEffect(() => {
    fetchPhiData();
    const interval = setInterval(fetchPhiData, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Update particles when data changes
  useEffect(() => {
    if (phiData.eigenVectors.length > 0) {
      generateParticles();
    }
  }, [phiData.eigenVectors]);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles]);

  const deltaS = calculateDeltaS();

  return (
    <div className="phi-visualization">
      <div className="phi-header">
        <h2>Φ (Phi) Computation Visualization</h2>
        <div className="phi-formula">
          <span>Φ_total = Σ_i (w_i × φ_i) / N</span>
        </div>
      </div>

      <div className="phi-content">
        <div className="phi-canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{
              background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f3e 100%)',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }}
          />
          <div className="canvas-overlay">
            <div className="phi-value">
              <span className="label">Current Φ:</span>
              <span className="value">{phiData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="phi-stats">
          <div className="stat-card">
            <h3>Φ Total</h3>
            <div className="stat-value">{phiData.total.toFixed(2)}</div>
            <div className="stat-label">Current Value</div>
          </div>

          <div className="stat-card">
            <h3>ΔS_geom</h3>
            <div className="stat-value">{deltaS.geom.toFixed(2)}</div>
            <div className="stat-label">Geometric Shift</div>
          </div>

          <div className="stat-card">
            <h3>ΔS_protocol</h3>
            <div className="stat-value">{deltaS.protocol.toFixed(2)}</div>
            <div className="stat-label">Protocol Shift</div>
          </div>

          <div className="stat-card">
            <h3>ΔS_total</h3>
            <div className="stat-value">{deltaS.total.toFixed(2)}</div>
            <div className="stat-label">ΔS_geom + ΔS_protocol</div>
          </div>
        </div>

        <div className="phi-parameters">
          <h3>Φ Parameters</h3>
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Weight (w_i)</th>
                <th>Value (φ_i)</th>
                <th>EigenVector</th>
              </tr>
            </thead>
            <tbody>
              {phiData.weights.map((weight, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{weight}</td>
                  <td>{phiData.values[i]}</td>
                  <td>{phiData.eigenVectors[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {phiData.history.length > 1 && (
          <div className="phi-history">
            <h3>Φ History</h3>
            <div className="history-chart">
              {phiData.history.map((point, i) => (
                <div
                  key={i}
                  className="history-bar"
                  style={{
                    height: `${(point.value / Math.max(...phiData.history.map(p => p.value))) * 100}%`,
                    background: `hsl(${180 + (i * 5)}, 70%, 60%)`
                  }}
                  title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.value}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
