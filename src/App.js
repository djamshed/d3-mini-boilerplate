import {
  axisBottom,
  axisLeft,
  extent,
  json,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
  select,
} from 'd3';

const WIDTH = 800;
const HEIGHT = 600;
const PADDING = 80;
const CHART_W = WIDTH - PADDING;
const CHART_H = HEIGHT - PADDING;

const scatterlot = (selector, data, {x, y, color}) => {
  const colorScale = scaleOrdinal()
    .domain(Array.from(new Set(data.map(d => d[color]))))
    .range(schemeCategory10)

  const xScale = scaleLinear()
    .domain(extent(data, d => d[x]))
    .range([PADDING, CHART_W]);

  const yScale = scaleLinear()
    .domain(extent(data, d => d[y]))
    .range([CHART_H, PADDING]);

  //create svg element
  const svg = selector
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  svg.selectAll('.circle-container')
    .data(data)
    .join(
      enter => enter.append('g').attr('class', 'circle-container')
    )
    .attr('transform', d => `translate(${xScale(d[x])}, ${yScale(d[y])})`)
    .append('circle')
      .attr('r', 5)
      .attr('fill-opacity', 0.5)
      .attr('fill', d => colorScale(d[color]))
      .attr('stroke', d => colorScale(d[color]))


  // axis
  const xAxis = axisBottom().ticks(8).scale(xScale);
  const yAxis = axisLeft().scale(yScale);
  //x axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${CHART_H})`)
    .call(xAxis);

  //y axis
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${PADDING}, 0)`)
    .call(yAxis);

}

export default async function App() {
  const data = await json('data.json');

  // #app is in index.html
  const container = select('#app');
  scatterlot(container, data, {x: 'sepalWidth', y: 'sepalLength', color: 'species'});
}




