let API_KEY = "AIzaSyAjQhmvgUl_gT3Tz8wk06-E4sERAaBqoaY";
let API_KEY = "AIzaSyCO43SCw8o4VrTC72M0wdgr8Sshov4-sZI";
let API_KEY = "AIzaSyAblinAxL4_M8EW2EZdeFVyiNV238ioFAY";
let API_KEY = "AIzaSyDNZBDmYooRfOzZI31DvFh2GGrcoxuWNXw";
let API_KEY = "AIzaSyDeEu_SyZRpCY52pZv5AMkNLVMSl-BY5pE";
let API_KEY = "AIzaSyBM75GfcrEbkNqXDHJ99TtVwqtwMp9R62s";
let API_KEY = "AIzaSyDNNC7tbd8qj0oXl2Qzo3SJpWFXCyuiznc";
let API_KEY = "AIzaSyAMdROKeeHU7tf4tRN-IU8Sl5HLowoQgf4";
let API_KEY = "AIzaSyC0u6BRsbIZt3Y-A1L1pFVpulI4jxx7TCs";
let state = window.localStorage.getItem('selectApi') ? window.localStorage.getItem('selectApi') : "1";

export const apiKeys = [
    // kkp785216@gmail.com
    'AIzaSyCO43SCw8o4VrTC72M0wdgr8Sshov4-sZI',

    // kanhaiya277502@gmail.com
    'AIzaSyDo_0YDdRQ38vbVQ19Ng8bAHhRaNvyj_1s',
    'AIzaSyAblinAxL4_M8EW2EZdeFVyiNV238ioFAY',
    'AIzaSyDNZBDmYooRfOzZI31DvFh2GGrcoxuWNXw',
    'AIzaSyDeEu_SyZRpCY52pZv5AMkNLVMSl-BY5pE',
    'AIzaSyBM75GfcrEbkNqXDHJ99TtVwqtwMp9R62s',
    'AIzaSyDNNC7tbd8qj0oXl2Qzo3SJpWFXCyuiznc',
    'AIzaSyAMdROKeeHU7tf4tRN-IU8Sl5HLowoQgf4',
    'AIzaSyC0u6BRsbIZt3Y-A1L1pFVpulI4jxx7TCs',
]
const request = axios.create({
    baseURL: "https://youtube.googleapis.com/youtube/v3",
    headers: {},
    params: {
        key: apiKeys[parseInt(state) - 1]
        // key: apiKeys[25]
    }
});

export const searchreq = axios.create({
    baseURL: "https://youtube-clone-backend.vercel.app",
    headers: {},
    params: {}
});

//GETTING CLICKED VIDEO AND RELATED VIDEOS
MainVideo = JSON.parse(localStorage.getItem("mainVideo"));
recommened = JSON.parse(localStorage.getItem("relatedVideo"));

let channelDetail = document.querySelector(".channelDetails");

display(MainVideo, recommened);
function display(mainVideo, recommened) {
  console.log(mainVideo);

  var iframe = document.querySelector("iframe");
  let videoid;
  if (mainVideo.id.videoId) {
    videoid = mainVideo.id.videoId;
  } else {
    videoid = mainVideo.id;
  }
  iframe.src = `https://www.youtube.com/embed/${videoid}`;

  var h2 = document.querySelector("#title");
  h2.innerText = mainVideo.snippet.title;

  var channelImg = document.querySelector("#bigVideo__profile");

  //GETTING CHANNEL PROFILE IMG AND SUBSCIBER NUMBER
  var channelicon = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&key=${API_KEY}&id=${mainVideo.snippet.channelId}`;
  fetch(channelicon)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      channelImg.src = res.items[0].snippet.thumbnails.medium.url;
      document.querySelector("#viewsBig_video").innerText =
        res.items[0].statistics.viewCount + " views";
      document.querySelector(".bigVideo__Des").innerText =
        res.items[0].snippet.description;

      var subscriber = res.items[0].statistics.subscriberCount;
      if (subscriber >= 1000 && subscriber < 1000000) {
        subscriber = Math.floor(subscriber / 1000) + "K ";
      } else if (subscriber >= 1000000 && subscriber < 1000000000) {
        subscriber = Math.floor(subscriber / 1000000) + "M ";
      } else if (subscriber >= 1000000000 && subscriber < 1e12) {
        subscriber = Math.floor(subscriber / 1000000000) + "B ";
      }
      document.querySelector(
        ".bigVideo__title"
      ).innerHTML = `<span>${mainVideo.snippet.channelTitle}</span><span>${subscriber} subscribers</span>`;
    })
    .catch((err) => {
      console.log(err);
    });

  //RECOMMEND VIDEOS
  recommened.map((item) => {
    if (item.snippet.title != mainVideo.snippet.title) {
      var div = document.createElement("div");

      var videoImg = document.createElement("img");
      videoImg.src = item.snippet.thumbnails.medium.url;

      var title_and_Profile = document.createElement("div");
      title_and_Profile.setAttribute("class", "title_and_Profile");

      var divTitle = document.createElement("div");
      var title = document.createElement("p");
      title.innerText = item.snippet.title;

      var channelName = document.createElement("span");
      channelName.innerText = item.snippet.channelTitle;

      var views = document.createElement("span");
      divTitle.append(title, channelName, views);

      //GETTING CHANNEL PROFILE IMG
      var channelicon = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&key=${API_KEY}&id=${item.snippet.channelId}`;
      fetch(channelicon)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          viewvideo = res.items[0].statistics.viewCount;
          if (viewvideo >= 1000 && viewvideo < 1000000) {
            views.innerText = Math.floor(viewvideo / 1000) + "K views";
          } else if (viewvideo >= 1000000 && viewvideo < 1000000000) {
            views.innerText = Math.floor(viewvideo / 1000000) + "M views";
          } else if (viewvideo >= 1000000000 && viewvideo < 1e12) {
            views.innerText = Math.floor(viewvideo / 1000000000) + "B views";
          }
        })
        .catch((err) => {
          console.log(err);
        });

      title_and_Profile.append(divTitle);
      div.append(videoImg, title_and_Profile);

      document.querySelector(".recommend").append(div);

      div.addEventListener("click", function () {
        getVideo(item, recommened);
      });
    }
  });
}


function getVideo(item, items) {
  localStorage.setItem("mainVideo", JSON.stringify(item));
  localStorage.setItem("relatedVideo", JSON.stringify(items));
  window.location.href = "showvideo.html";
}


function SearchVideo__from_watch() {
  var value = document.querySelector("#video_search").value;
  localStorage.setItem("valueFromWatchvideo", value);
  window.location.href = "index.html";
}


function show_des() {
  let btn_text = document.querySelector("#btn_t");
  document.querySelector(".bigVideo__Des").classList.toggle("show_more");
  if (btn_text.innerText === "SHOW MORE") {
    btn_text.innerText = "SHOW LESS";
  } else {
    btn_text.innerText = "SHOW MORE";
  }
}
