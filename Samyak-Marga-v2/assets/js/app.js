// ==========================
// HEADER SHRINK ON SCROLL
// ==========================

window.addEventListener("scroll", function () {

  const header = document.querySelector(".header");

  if (header) {
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

});

// ==========================
// MOBILE MENU
// ==========================

function openMenu() {

  document.getElementById("mobileMenu").classList.add("show");
  document.getElementById("menuOverlay").classList.add("show");

}

function closeMenu() {

  document.getElementById("mobileMenu").classList.remove("show");
  document.getElementById("menuOverlay").classList.remove("show");

}

// ==========================
// FADE UP ANIMATION
// ==========================

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }

  });

}, {
  threshold: 0.15
});

document.querySelectorAll(".fade-up").forEach((el) => {
  observer.observe(el);
});
// ==========================
// ACTIVE MENU
// ==========================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".main-nav a, .mobile-menu a").forEach(link => {

  const href = link.getAttribute("href");

  if (href === currentPage || (currentPage === "" && href === "#")) {

    link.classList.add("active");

  }

});
// ==========================
// DARK MODE
// ==========================

const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

});
// ==========================
// HEADER SEARCH
// ==========================

function toggleSearch(){

const box=document.querySelector(".search-container");

box.classList.toggle("active");

if(box.classList.contains("active")){

box.querySelector(".search-input").focus();

}

}
/* ==========================
   SCROLL REVEAL
========================== */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

reveals.forEach((item)=>{

const windowHeight = window.innerHeight;

const top = item.getBoundingClientRect().top;

if(top < windowHeight - 120){

item.classList.add("active");

}

});

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();
// ==========================
// YOUTUBE FEATURED VIDEO
// ==========================

const API_KEY = "AIzaSyBCIYTPjZZoJu-1s1dXwXfXMQAbuj41LuM";
const CHANNEL_ID = "UC2PmoieNwm0JlOGGWMetrGg";

async function loadFeaturedVideo(){

try{

const url =
`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=1&type=video`;

const response = await fetch(url);

const data = await response.json();

console.log(data.error);
const video = data.items[0];

if(!video) return;
const videoId = video.id.videoId;

const title = video.snippet.title;

const description = video.snippet.description;

const thumbnail =
video.snippet.thumbnails.high.url;

const link =
`https://www.youtube.com/watch?v=${videoId}`;

document.getElementById("featured-thumb").src =
thumbnail;

document.getElementById("featured-link").href =
link;

document.getElementById("featured-button").href =
link;

document.getElementById("featured-title").textContent =
title;

document.getElementById("featured-description").textContent =
description.substring(0,180)+"...";

}

catch(error){

console.log(error);

}

}

loadFeaturedVideo();
// ==========================
// LATEST VIDEOS
// ==========================

function formatViews(views){

    views = Number(views);

    if(views >= 1000000){
        return (views/1000000).toFixed(1)+"M";
    }

    if(views >= 1000){
        return (views/1000).toFixed(1)+"K";
    }

    return views;
}

function formatDuration(duration){

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const h = parseInt(match[1] || 0);

    const m = parseInt(match[2] || 0);

    const s = parseInt(match[3] || 0);

    if(h>0){
        return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    }

    return `${m}:${String(s).padStart(2,"0")}`;
}

async function loadLatestVideos(){

    try{

        const searchURL =
`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=viewCount&maxResults=3&type=video`;

        const searchResponse = await fetch(searchURL);

        const searchData = await searchResponse.json();

        if(searchData.error){
            console.log(searchData.error.message);
            return;
        }

        const ids = searchData.items
        .map(v => v.id.videoId)
        .join(",");

        const videoURL =
`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=contentDetails,statistics&id=${ids}`;

        const videoResponse = await fetch(videoURL);

        const videoData = await videoResponse.json();

        const container = document.getElementById("latestVideos");

        container.innerHTML="";
        searchData.items.forEach((video,index)=>{

            const details = videoData.items[index];

            const videoId = video.id.videoId;

            const title = video.snippet.title;

            const thumb = video.snippet.thumbnails.high.url;

            const views = formatViews(details.statistics.viewCount);

            const duration = formatDuration(details.contentDetails.duration);

            const publishDate = new Date(video.snippet.publishTime);

            const today = new Date();

            const diffDays = Math.floor(
                (today - publishDate)/(1000*60*60*24)
            );

            const isNew = false;

            const date = publishDate.toLocaleDateString("en-US",{

                day:"numeric",

                month:"short",

                year:"numeric"

            });

            container.innerHTML += `

            <div class="video-item">

                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">

                    <img src="${thumb}" alt="${title}">

                    <span class="video-play">
                        <i class="fa-solid fa-play"></i>
                    </span>

                    <span class="video-duration">
                        ${duration}
                    </span>

                    ${isNew ? `<span class="video-new">NEW</span>` : ``}

                </a>

                <div class="video-info">

                    <h3>${title}</h3>

                    <div class="video-meta">

                        <span>
                            <i class="fa-regular fa-eye"></i>
                            ${views}
                        </span>

                        <span>
                            <i class="fa-regular fa-calendar-days"></i>
                            ${date}
                        </span>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

loadLatestVideos();
// Premium Article Animation
const articleObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:0.2});

document.querySelectorAll(".sm-item").forEach(item=>{
  articleObserver.observe(item);
});
function openTab(tabId){

document.querySelectorAll(".tab-content").forEach(tab=>{
tab.classList.remove("active");
});

document.querySelectorAll(".tab-btn").forEach(btn=>{
btn.classList.remove("active");
});

document.getElementById(tabId).classList.add("active");

event.target.classList.add("active");
}
