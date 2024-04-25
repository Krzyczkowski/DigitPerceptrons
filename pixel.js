let width = document.querySelector(".row").querySelectorAll(".pixel").length;
let height = document.querySelectorAll(".row").length;
let bins = []; //saved binaries
let currentBinaryPanel = document.querySelector("#pixelsBinaryPanel");
let statsPanel = document.querySelector(".stats");
let pixels = document.querySelectorAll(".pixel");
let htmlPerceptrons = Array.from(document.querySelectorAll('#perceptrons > div'));
let mouseDown = false;

document.addEventListener('mousedown', function(event) {if (event.button === 0)  mouseDown = true;});
document.addEventListener('mouseup', function(event) { if (event.button === 0)  mouseDown = false});


pixels.forEach(pixel => {
    pixel.addEventListener('mouseover', function(e) {
        if (mouseDown) {
            e.target.classList.add("selected_pixel");
            currentBinaryPanel.innerHTML = '';
            updatePerceptrons();
            drawBinary(pixelsToBinary(), currentBinaryPanel);
        }
    });
});
pixels.forEach(pixel => {
    pixel.addEventListener('click', function(e) {
        if (!mouseDown) { // Only toggle if mouseDown is false to avoid duplicate toggle
            e.target.classList.toggle("selected_pixel");
            currentBinaryPanel.innerHTML = '';
            updatePerceptrons();
            drawBinary(pixelsToBinary(), currentBinaryPanel);
        }
    });
});

function clearPanel(){
	pixels.forEach(pixel=> {pixel.classList.remove("selected_pixel");
	updatePerceptrons();
})
}
window.clearPanel = clearPanel;

function pixelsToBinary(){
	let binary_pixels = [];
	let pixels = document.querySelectorAll(".pixel");
	pixels.forEach(pixel => {
		if(pixel.classList.contains("selected_pixel"))	binary_pixels.push(1);
		else binary_pixels.push(0);
	});
	return binary_pixels;
}

function updateDrawPanel(bin){
	pixels.forEach((pixel,index)=> {
		if(bin[index]==1)	pixel.classList.add("selected_pixel");
		else pixel.classList.remove("selected_pixel");
	});
}


function drawBinary(binary,place){
	place.innerHTML += ' <br> [ <br>';
	for(let y = 0; y<height; y++){
		for (let x = 0; x<width; x++){
			place.innerHTML += ` ${binary[y*width+x]}, `;			
		}
		place.innerHTML +="<br>";
	}
	place.innerHTML += '], <br> ';
}

function saveBinary(){
	let binary = pixelsToBinary();
	bins.push(binary);

	let savedBinaries = document.querySelector("#savedBinaries");
	let savedBinaryDiv = document.createElement("div");
	savedBinaryDiv.setAttribute("binaryId",bins.length);

	savedBinaries.appendChild(savedBinaryDiv);
	drawBinary(binary,savedBinaryDiv);
	
}
window.saveBinary = saveBinary;

function clearBinaries(){
	let savedBinaries = document.querySelector("#savedBinaries");
	savedBinaries.innerHTML = '';
	bins = [];
}
window.clearBinaries = clearBinaries;


function updatePerceptrons(){
	let perceptronOutputs = perceptronsActivation(pixelsToBinary());
	htmlPerceptrons.forEach((perceptron,index) =>{
		if(perceptronOutputs[index]==1)
			perceptron.classList.add("active");
		else
			perceptron.classList.remove("active");
	})
}

htmlPerceptrons.forEach((perceptron, index)=>{
	perceptron.addEventListener("click",(e)	 =>{
		let data = dataForDigit(index);
		let randomIndex = Math.floor(Math.random() * data.length);
		updateDrawPanel(data[randomIndex]);
		updatePerceptrons();
	})
})

function setStats(){
	let stats = getPerceptronsStatistics();
	console.log(stats);
	stats.forEach((stat,index)=>{
		let statDiv = document.createElement("div");
		statDiv.innerHTML = "p" +index+": " + stat * 100 + "%";
		statsPanel.appendChild(statDiv);
	})
}
setStats();

