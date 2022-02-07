const form = document.getElementById('form');

var searchText = document.getElementById('search_text');
var searchTextValue;
const clearBtn = document.getElementById('clear_btn');

const searchBtn = document.getElementById('search_btn');

const result_container = document.getElementById('result_container');


searchText.addEventListener('blur', (e) => {
    searchTextValue = searchText.value;
    if (searchTextValue !== "") {
        clearBtn.style.visibility = "visible";
    }
    if (searchTextValue === "") {
        clearBtn.style.visibility = "hidden";
    }
    // searchTextValue = searchTextValue.replace(/\s+/g, ' ').trim();
})



// var URL = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;

const getMaxChars = () => {
    let maxChars;
    let width = window.innerWidth;
    if (width < 450) {
        maxChars = 75;
    } else if (width > 450 && width < 1400) {
        maxChars = 130;
    } else if (width > 1400) {
        maxChars = 160;
    }
    return maxChars;
}

const inputText = (text) => {
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}

const getData = async (text) => {
    text = inputText(text);
    let maxChars = getMaxChars();
    console.log("Text  : ", text)
    let response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${text}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`);

    let data = await response.json();

    console.log(typeof (data.query.pages));
    console.log(data.query.pages['7003']);

    var resultArray = [];
    for (let i in data.query.pages) {
        resultArray.push(data.query.pages[i]);
    }
    console.log(data.query.pages);
    console.log(resultArray);
    extractData(resultArray);
}

function extractData(arr) {
    var new_arr = arr.map((val) => {
        var heading = val.title;
        var content = val.extract;
        var pageId = val.pageid;
        var image = val.hasOwnProperty('thumbnail') ? val.thumbnail.source : null;

        return image ? { pageId, heading, image, content } :
            { pageId, heading, content }
    })
    console.log("New Card : ", new_arr);
    createCard(new_arr);
}

function createCard(arr) {
    var content = '';
    var href = '';
    console.log("card: ", arr);
    result_container.innerHTML = content;
    result_container.innerHTML = `<div class="displaying_result"> <span> Displaying ${arr.length} results. </span> </div>`
    for (let i = 0; i < arr.length; i++) {
        href = `https://en.wikipedia.org/?curid=${arr[i].pageId}`;
        content = `
        <div class="results">
        <div class="result_heading">
        <a href=${href}> ${arr[i].heading} </a>
        </div>
        ${arr[i].hasOwnProperty('image')?`<div class="image_content">
        <img class="result_image"
        src=${arr[i].image}
        alt=${arr[i].heading}>`:''}
        
        <div class="result_content"> ${arr[i].content} </div>
        </div>
        </div>
        `;
        result_container.innerHTML += content;
    }
    console.log("Content : ",content);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(searchTextValue);
    getData(searchTextValue);
})

searchText.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        e.preventDefault();
        console.log(searchTextValue);
        getData(searchTextValue);
        console.log("KeyCode : ",e.keyCode);
    }
})

