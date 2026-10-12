import * as d3 from 'd3';

export function renderNetwork(svgElement, data) {
  const width = 1000;
  const height = 700;

  const svg = d3.select(svgElement)
    .attr('viewBox', `0 0 ${width} ${height}`);

  svg.selectAll('*').remove();

  const container = svg.append('g');

  const zoom = d3.zoom()
    .scaleExtent([0.05, 10])
    .on('zoom', event => {
      container.attr('transform', event.transform);
    });

  svg.call(zoom);

  const links = container.append('g')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', d => Math.sqrt(d.value));

  const nodes = container.append('g')
    .selectAll('circle')
    .data(data.nodes)
    .join('circle')
    .attr('r', 4)
    .attr('fill', '#782F40')
    .attr('fill-opacity', 0.7);

  nodes.append('title')
    .text(d => d.id);

  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links)
      .id(d => d.id)
      .distance(30))
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05));

  nodes.call(d3.drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    })
  );

  simulation.on('tick', () => {
    links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });

  let fitted = false;
  simulation.on('end', () => {
    // Fit once so dragging a node later doesn't reset the user's zoom.
    if (fitted || data.nodes.length === 0) return;
    fitted = true;

    const [minX, maxX] = d3.extent(data.nodes, d => d.x);
    const [minY, maxY] = d3.extent(data.nodes, d => d.y);
    const padding = 40;
    const scale = Math.min(
      (width - padding * 2) / Math.max(maxX - minX + 8, 1),
      (height - padding * 2) / Math.max(maxY - minY + 8, 1),
      10
    );

    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-(minX + maxX) / 2, -(minY + maxY) / 2);

    zoom.scaleExtent([Math.min(0.05, scale), 10]);
    svg.call(zoom.transform, transform);
  });
}
