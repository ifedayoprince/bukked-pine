import { PinoResolver } from 'https://pino-sdk.vercel.app/core/pino-protocol.js';
import Pine from 'https://pino-sdk.vercel.app/core/pine.js';

let app = new Pine();
app.resolve(new PinoResolver(), startPine);
app.on('offline', showError);
// app.on('init', startPine);

function startPine() {
	// alert('Hello')
	handleSlide();
	handleUpdates();
} 

function showError() {
	alert('Offline')
}

async function handleUpdates() {
	let author_el = document.querySelector('.author');
	let title_el = document.querySelectorAll('.title');
	let slide_el = document.querySelector('swiper-container')
	let desc_el = document.querySelector('.desc');
	
	// let images = await app.fetch(`file.${app.params.imgs}`);
	let author = app.params.author;
	let desc = await app.fetch(`pine.notes.${app.params.desc}`);

	desc_el.innerHTML = desc.data.content;
	author_el.innerHTML = author;
	title_el.forEach((v)=>{
		v.innerHTML = app.params.title;
	});
	var out = "";
	for(var image of app.params.imgs) {
		let img = (await app.fetch(`file.${image}`)).data.url; 
		let slide = `<swiper-slide class="flex items-center h-full" lazy>
				<img loading="true" src="${img}" class="h-[96vh] rounded-lg" alt="Page ${app.params.imgs.indexOf(image)} of ${app.params.imgs.length}">
			</swiper-slide>` 
		out += slide;
	}
	slide_el.classList.remove('animate-pulse');
	slide_el.innerHTML = out;
}
function handleSlide() {
	let controls = document.querySelector('.overlay');
	let swip = document.querySelector('swiper-container');
	let buttons = document.querySelectorAll('.button');
	buttons.forEach((el)=>{
		el.onclick = ()=>{
			let swop = swip.swiper;
			if (el.classList.contains('left')) {
				swop.slidePrev();
				return;
			} 
			
			swop.slideNext();
		} 
	})
	swip.addEventListener('progress', (event) => {
    	const [_, progress] = event.detail;
    	let pb = document.querySelector('.progress div');
    	pb.style.width = progress*100+"%";
	});
	swip.addEventListener('click', ()=>{
		controls.style.display = 'flex'
		setTimeout(()=>{controls.style.display = 'none'}, 2000);
	});
	let info = document.querySelector('.info');
	let des = document.querySelector('.descS');
	let close = document.querySelector('.close');
	info.onclick = ()=>{
		des.style.display = "block";
	}
	close.onclick = ()=>{
		des.style.display = 'none'
	}
}
