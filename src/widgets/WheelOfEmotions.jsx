import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const WheelOfEmotions = ({ data, size }) => {
  const ref = useRef();

  useEffect(() => {
    // console.log('Emotion data passed to WheelOfEmotions:', data); 
    if (data && data.length > 0) {
      drawChart();
    }
  }, [data, size]);

 

  const drawChart = () => {
    const width = size || 200; // Use the size passed from props or default to 200
    const height = size || 200;
    const padding = 50; // Adjust the padding based on your needs

    // Clear previous chart
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', width + padding * 2)
      .attr('height', height + padding * 2)
      .append('g')
      .attr('transform', `translate(${(width + padding * 2) / 2}, ${(height + padding * 2) / 2})`);

    const radius = Math.min(width, height) / 2;
    const outerRadius = radius;
    const labelRadius = outerRadius * 1.19;
    const fixedInnerRadius = radius * 0.09; // Fixed inner radius for all petals
    const fixedOuterRadius = radius; // Fixed outer radius for all petals

    const pie = d3.pie().value(() => 1); // Equal size for all slices

    // Draw the white petals (background)
    svg.selectAll('.petal-bg')
      .data(pie(data))
      .enter().append('path')
      .attr('class', 'petal-bg')
      .attr('d', d => createFixedPetalPath(d, fixedInnerRadius, fixedOuterRadius))
      .attr('fill', '#fff') // White background for all petals
      .attr('stroke', '#ccc') // Optional stroke for visibility
      .attr('stroke-width', '1px');

    // Define clip paths based on the emotion value to progressively fill the petals from the base
    svg.selectAll('.clip-path')
      .data(pie(data))
      .enter().append('clipPath')
      .attr('id', (d, i) => `clip-${i}`)
      .append('path')
      .attr('d', d => createProgressFilledPetalPath(d, fixedInnerRadius, fixedOuterRadius, d.data.value));

    // Draw the color-filled part based on the emotion value using the clipping paths
    svg.selectAll('.petal-fill')
      .data(pie(data))
      .enter().append('path')
      .attr('class', 'petal-fill')
      .attr('d', d => createFixedPetalPath(d, fixedInnerRadius, fixedOuterRadius)) // Use the full petal path
      .attr('fill', d => d.data.color) // Apply solid color
      .attr('clip-path', (d, i) => `url(#clip-${i})`) // Use clip-path to control the fill amount
      .attr('stroke', 'none'); // No stroke for the filled part

    // Add emotion labels
    svg.selectAll('.label')
      .data(pie(data))
      .enter().append('text')
      .attr('class', 'label')
      .attr('transform', d => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.cos(angle - Math.PI / 2) * labelRadius;
        const y = Math.sin(angle - Math.PI / 2) * labelRadius;
        const rotate = (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) ? angle * 180 / Math.PI + 180 : angle * 180 / Math.PI;
        return `translate(${x}, ${y}) rotate(${rotate})`;
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('alignment-baseline', 'middle')
      .text(d => d.data.emotion);
  };

  // Function to create fixed petal path (background white petal)
  const createFixedPetalPath = (d, innerRadius, outerRadius) => {
    const startAngle = d.startAngle - Math.PI / 2;
    const endAngle = d.endAngle - Math.PI / 2;
    const midAngle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

    // Start point at the inner radius (near the center)
    const sx = innerRadius * Math.cos(startAngle);
    const sy = innerRadius * Math.sin(startAngle);

    // End point at the inner radius (on the other side)
    const ex = innerRadius * Math.cos(endAngle);
    const ey = innerRadius * Math.sin(endAngle);

    // Control point for the Bezier curve (to create the tip of the petal)
    const tipX = outerRadius * Math.cos(midAngle);
    const tipY = outerRadius * Math.sin(midAngle);

    // Control points for smoothing the curve
    const controlPoint1X = outerRadius * 0.6 * Math.cos(startAngle);
    const controlPoint1Y = outerRadius * 0.6 * Math.sin(startAngle);

    const controlPoint2X = outerRadius * 0.6 * Math.cos(endAngle);
    const controlPoint2Y = outerRadius * 0.6 * Math.sin(endAngle);

    // Return the path using quadratic Bezier curves
    return `
      M ${sx},${sy} 
      Q ${controlPoint1X},${controlPoint1Y} ${tipX},${tipY} 
      Q ${controlPoint2X},${controlPoint2Y} ${ex},${ey} 
      Z`;
  };

  // Function to create the filled petal path with smooth progression but ending in a straight line
// const createProgressFilledPetalPath = (d, innerRadius, outerRadius, value) => {
//   // Calculate the fill radius based on the emotion value
//   const fillOuterRadius = innerRadius + (outerRadius - innerRadius) * value;

//   const startAngle = d.startAngle - Math.PI / 2;
//   const endAngle = d.endAngle - Math.PI / 2;
//   const midAngle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

//   // Start point at the inner radius (base of the petal)
//   const sx = innerRadius * Math.cos(startAngle);
//   const sy = innerRadius * Math.sin(startAngle);

//   // End point at the inner radius (other side of the petal base)
//   const ex = innerRadius * Math.cos(endAngle);
//   const ey = innerRadius * Math.sin(endAngle);

//   // Tip of the petal, where the fill will extend up to based on value (end as a straight line)
//   const tipStartX = fillOuterRadius * Math.cos(startAngle);
//   const tipStartY = fillOuterRadius * Math.sin(startAngle);

//   const tipEndX = fillOuterRadius * Math.cos(endAngle);
//   const tipEndY = fillOuterRadius * Math.sin(endAngle);

//   // Create the path with a straight line at the tip
//   const filledPath = `
//     M ${sx},${sy} 
//     L ${tipStartX},${tipStartY} 
//     L ${tipEndX},${tipEndY}
//     L ${ex},${ey} 
//     Z
//   `;

//   return filledPath;
// };


// // Function to create the filled petal path with smooth progression from the tip towards the base
// const createProgressFilledPetalPath = (d, innerRadius, outerRadius, value) => {
//   // Calculate the fill radius based on the emotion value (inverse direction)
//   const fillInnerRadius = outerRadius - (outerRadius - innerRadius) * value;

//   const startAngle = d.startAngle - Math.PI / 2;
//   const endAngle = d.endAngle - Math.PI / 2;
//   const midAngle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;
//   // Start point at the outer radius (tip of the petal)
//   const sx = outerRadius * Math.cos(startAngle);
//   const sy = outerRadius * Math.sin(startAngle);

//   // End point at the outer radius (other side of the petal tip)
//   const ex = outerRadius * Math.cos(endAngle);
//   const ey = outerRadius * Math.sin(endAngle);

//   // Control point for the Bezier curve (to create the tip of the petal)
//   const tipX = outerRadius * Math.cos(midAngle);
//   const tipY = outerRadius * Math.sin(midAngle);

//   // Fill towards the base, ending at the inner radius (which changes based on the value)
//   const baseStartX = fillInnerRadius * Math.cos(startAngle);
//   const baseStartY = fillInnerRadius * Math.sin(startAngle);

//   const baseEndX = fillInnerRadius * Math.cos(endAngle);
//   const baseEndY = fillInnerRadius * Math.sin(endAngle);

//   // Create the path with complete coverage of the tip by connecting the outer radius directly
//   const filledPath = `
//     M ${sx},${sy} 
//     L ${tipX},${tipY} 
//     L ${ex},${ey} 
//     L ${baseEndX},${baseEndY}
//     L ${baseStartX},${baseStartY} 
//     Z
//   `;

//   return filledPath;
// };


// // Function to create the filled petal path with a rounded tip based on the value
//   const createProgressFilledPetalPath = (d, innerRadius, outerRadius, value) => {
//     // Calculate the fill radius based on the emotion value
//     const fillOuterRadius = innerRadius + (outerRadius - innerRadius) * value;

//     const startAngle = d.startAngle - Math.PI / 2;
//     const endAngle = d.endAngle - Math.PI / 2;
//     const midAngle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

//     // Start point at the inner radius (base of the petal)
//     const sx = innerRadius * Math.cos(startAngle);
//     const sy = innerRadius * Math.sin(startAngle);

//     // End point at the inner radius (other side of the petal base)
//     const ex = innerRadius * Math.cos(endAngle);
//     const ey = innerRadius * Math.sin(endAngle);

//     // Tip of the petal, where the fill will extend up to based on value
//     const tipX = fillOuterRadius * Math.cos(midAngle);
//     const tipY = fillOuterRadius * Math.sin(midAngle);

//     // Control points for the curves
//     const controlPoint1X = fillOuterRadius * 0.6 * Math.cos(startAngle);
//     const controlPoint1Y = fillOuterRadius * 0.6 * Math.sin(startAngle);

//     const controlPoint2X = fillOuterRadius * 0.6 * Math.cos(endAngle);
//     const controlPoint2Y = fillOuterRadius * 0.6 * Math.sin(endAngle);

//     // Add a rounded tip arc
//     const roundedTipRadius = 10; // Adjust this for a smoother roundness
//     const roundedTipArc = `A ${roundedTipRadius},${roundedTipRadius} 0 0,1 ${tipX},${tipY}`;

//     // Create the full path with a rounded tip
//     const roundedTipPath = `
//       M ${sx},${sy}
//       Q ${controlPoint1X},${controlPoint1Y} ${tipX},${tipY}
//       ${roundedTipArc}
//       Q ${controlPoint2X},${controlPoint2Y} ${ex},${ey}
//       Z
//     `;

//     return roundedTipPath;
//   };

const createProgressFilledPetalPath = (d, innerRadius, outerRadius, value) => {

  // Scale the outer radius by the normalized emotion value (value)
  const scaledOuterRadius = innerRadius + (outerRadius - innerRadius) * value* 2;

  const startAngle = d.startAngle - Math.PI / 2;
  const endAngle = d.endAngle - Math.PI / 2;
  const midAngle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

  // Start point at the inner radius (base of the petal)
  const sx = innerRadius * Math.cos(startAngle);
  const sy = innerRadius * Math.sin(startAngle);

  // End point at the inner radius (other side of the petal base)
  const ex = innerRadius * Math.cos(endAngle);
  const ey = innerRadius * Math.sin(endAngle);

  // Tip of the petal, where the fill will extend up to based on the emotion value
  const tipX = scaledOuterRadius * Math.cos(midAngle);
  const tipY = scaledOuterRadius * Math.sin(midAngle);

  // Control points for the Bezier curves (smooth transitions)
  const controlPoint1X = scaledOuterRadius * 0.6 * Math.cos(startAngle);
  const controlPoint1Y = scaledOuterRadius * 0.6 * Math.sin(startAngle);
  const controlPoint2X = scaledOuterRadius * 0.6 * Math.cos(endAngle);
  const controlPoint2Y = scaledOuterRadius * 0.6 * Math.sin(endAngle);

  // Create the path for the filled portion of the petal
  return `
    M ${sx},${sy} 
    Q ${controlPoint1X},${controlPoint1Y} ${tipX},${tipY}
    Q ${controlPoint2X},${controlPoint2Y} ${ex},${ey}
    Z
  `;
};




  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg ref={ref}></svg>
    </div>
  );
};



export default WheelOfEmotions;
