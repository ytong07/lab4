d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
	console.log('wealth', data);
	//data = data.sort((a, b) => d3.descending(a.Population, b.Population));
	console.log('wealth', data);

	//Set SVG for Scatter Plot
	const margin = ({top: 20, right: 20, bottom: 20, left: 20});
	const width = 650 - margin.left - margin.right;
	const height = 550 - margin.top - margin.bottom;
	const svg = d3.select(".chart")
		.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
	  	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	const xScale = d3
		.scaleLinear()
		.domain(d3.extent(data, d=>d.Income))
		.range([0,600]);
	
	const yScale = d3
		.scaleLinear()
		.domain(d3.extent(data, d=>d.LifeExpectancy))
		.range([510,0]);
		
	const xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(5, "s");

	const yAxis = d3.axisLeft()
		.scale(yScale);

	const ordScale = d3
		.scaleOrdinal(d3.schemeTableau10);


	//const pos = d3.pointer(event, window);
	
	// Draw the axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", `translate(0, ${height})`);
	
	svg.append("g")
		.attr("class", "axis y-axis")
		.call(yAxis);

	//Graphing
	//Draw a circle for each city
	svg.selectAll('circle')
        .data(data)
		.enter()
		.append('circle')
        .attr('r', function(d){
			if(d.Population<100000000){
				return 4
			}
			if(d.Population>100000000 && d.Population <1000000000){
				return 8
			}
			else{
				return 20
			}
		})
        .attr('cx', d=>xScale(d.Income))
		.attr('cy', d=>yScale(d.LifeExpectancy))
		.attr('fill','white')
		.attr('stroke','black')
		.attr('fill', (d)=>ordScale(d.Region))
		.attr('opacity', 0.85)
		//Tooltip
		.on('mouseenter', (event, d)=>{
			const pos = d3.pointer(event, window);
			d3.select('.tooltip').style('display', 'block')
				.style('left', pos[0].toString()+'px')
				.style("top", (pos[1]-80).toString()+'px')
				.html('Country: ' + d.Country.toString() + 
					  '<br>Region: ' + d.Region.toString() +
					  '<br>Population: ' + d3.format(',')(d.Population).toString() +
					  '<br>Income: ' + d3.format(',')(d.Income).toString() +
					  '<br>Life Expectancy: ' + d.LifeExpectancy.toString())
		})
		.on('mouseleave', (event, d)=>{
				document.querySelector('.tooltip').style.display ='none';
		});	
	
	//Axes Labels
	svg.append("text")
		.attr('x', width-80)
		.attr('y', height-5)
		.attr('font-size','12px')
		.style("text-anchor", "end")
		.text("Income");

	svg.append("text")
		.attr('x', 0)
		.attr('y', -5)
		.attr('font-size','12px')
		.attr("transform", "rotate(90)")
		.style("text-anchor", "front")
		.text("Life Expectancy");
	
	//console.log("DOMAIN: "+ordScale.domain())

	//Legend
	svg.selectAll('rect')
		.data(ordScale.domain())
		.enter()
		.append('rect')
		.attr('x', width-150)
		.attr('y', function(d,i){ return 300 + i*20})
		.attr('width', 15)
    	.attr('height', 15)
		.attr('fill', (d)=>ordScale(d));
	
	//const keys = ['Sub-Saharan Africa','South Asia','East Asia & Pacific','Middle East & North Africa','America,Europe & Central Asia'];
	
	svg.selectAll('label')
		.data(ordScale.domain())
		.enter()
		.append('text')
		.attr('x', width-130)
		.attr('y', function(d,i){ return 312 + i*20})
		.attr('font-size','12px')
		.text(d=>d);
});