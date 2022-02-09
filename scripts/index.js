const form = document.getElementById('form');
var searchText = document.getElementById('search_text');
const clearBtn = document.getElementById('clear_btn');
const searchBtn = document.getElementById('search_btn');
const result_container = document.getElementById('result_container');
var searchTextValue;


//Toggle clear button on input change
searchText.addEventListener('input', (e) => {
    searchTextValue = searchText.value;
    var text = removeSpace(searchText.value);
    if (text.length >= 0) {
        clearBtn.style.visibility = "visible";
        // console.log("Visible : ",e.target.value);
        // console.log("Length : ",text.length);
    }
    if(text.length <= 0){
        clearBtn.style.visibility = "hidden";
        // console.log("hide : ",e.target.value);
        // console.log("Length : ",text.length);
    }
})


//remove/hide clear button on click
clearBtn.addEventListener('click',()=>{
    clearBtn.style.visibility = "hidden";
})



// get max chars according to window size
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



// remove whitespace from input
const removeSpace = (text) => {
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}



//fetch data from API
const getData = async (text) => {
    text = removeSpace(text);
    let maxChars = getMaxChars();
    // console.log("Text  : ", text)

    let response = await axios(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${text}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`);

    let data = response.data.query.pages;

    var resultArray = [];
    for (let i in data) {
        resultArray.push(data[i]);
    }
    // console.log(data);
    // console.log(resultArray);
    extractData(resultArray);
}



//Extract only useful data from the data that API returns
function extractData(arr) {
    var new_arr = arr.map((val) => {
        var heading = val.title;
        var content = val.extract;
        var pageId = val.pageid;
        var image = val.hasOwnProperty('thumbnail') ? val.thumbnail.source : null;

        return image ? { pageId, heading, image, content } :
            { pageId, heading, content }
    })
    // console.log("New Card : ", new_arr);
    createCard(new_arr);
}



// Create dynamic card using result data
function createCard(arr) {
    var content = '';
    var href = '';
    // console.log("card: ", arr);
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
    // console.log("Content : ",content);
}


//On search button click this handler will  be called
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(searchTextValue);
    getData(searchTextValue);
})


//On enter button press, this handler will be called
searchText.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        e.preventDefault();
        // console.log(searchTextValue);
        getData(searchTextValue);
        // console.log("KeyCode : ",e.keyCode);
    }
})

