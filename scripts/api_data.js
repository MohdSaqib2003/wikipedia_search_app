const  API_data = async(text, max_chars)=>{
   
    let response = await axios(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${text}&gsrlimit=20&prop=pageimages|extracts&exchars=${max_chars}&exintro&explaintext&exlimit=max&format=json&origin=*`);

    console.log("response :  : : ",response);
    return response;
}

export {API_data};