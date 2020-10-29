let apiData;
let currData;

const tagFilter = document.getElementById("tags-filter");
const sortFilter = document.getElementById("sort-filter");
const searchBox = document.getElementById("searchBox");
const autoCompleteDiv = document.getElementById("auto-complete-div");
const clearBtn = document.querySelector(".clearBtn");
const homeBtn =document.querySelector("#homeBtn"); // to display default list items
const favBtn = document.querySelector("#favBtn"); // to display fav list items
let favList= new Array();                       // temporary storage variable 

let interval_Id; //for debouncing



const onTagChangeHandler = () => {

    const value=tagFilter.value;

    if(value == "All")
    {
        currData=apiData;
    }

    else
    {
        const filterData = apiData.filter( (item) => {

            flag=0;

            item.tags.forEach((tag) => {
                if(tag == value)
                flag=1;
            });

            if(flag)
            return item;

        });

        currData=filterData;
    }
    
    displayView(currData);
    
}

const sortFilterHandler = () => {

    let sortFilterProp=sortFilter.value;

    let sortData;

    if(sortFilterProp == 'rating')
         sortData = currData.sort((a, b) => b[sortFilterProp] - a[sortFilterProp] );

    else
         sortData = currData.sort((a, b) => a[sortFilterProp] - b[sortFilterProp]);


    currData=sortData;

    displayView(currData);

}

const getData = async () => {
    const res = await axios.get("https://raw.githubusercontent.com/Kalyan-1707/Food-Ordering-App/main/restaruants.json");

    apiData=res.data;
    currData=apiData;
    
    displayView(res.data);
    setTags(res.data);
    console.log(apiData);
}

const setTags = (data) => {

    let tags = new Set();

    data.forEach((item) => {

        item.tags.forEach((tag) => {
            tags.add(tag);
        });

    });

    let options='';

    options +=` <option value="none" selected disabled>Filter By</option>`

    options += `<option value="All" >All</option>`;

    tags.forEach((tag) => {
        options += ` <option value="${tag}" >${tag}</option>`
    });

    tagFilter.innerHTML=options;

} 

const displayView = (data) => {


    let div = document.getElementById("render-view");

    let view="";

    let tags="";

    data.forEach((item) => {

        tags="";

        item.tags.forEach((tag) => {
            tags +=`<span class="tag">${tag}</span>
                `;
        })

        view +=`<div class="card">
        
            <div class="card-img">
                <img src="${item.photo}" alt="burger king">
                <button class="fav" value="${item.id}"><i class="fas fa-heart"></i></button>
            </div>
            
            <div class="card-body">
                <div class="card-title">
                    <h1 class="title">${item.name}</h1>
                    ${tags}    
                </div>
            
                <div class="card-footer">
                    <p class="rating">${item.rating} <i class="fas fa-star"></i></p>
                    <p class="eta">${item.eta} min <i class="fas fa-stopwatch"></i></p>
                </div>
            </div>
        </div>`

    });

    div.innerHTML=view;

}

const updateAutoFillDiv = () => {

    console.log(apiData);

    const res = apiData.filter( (item) => {

        //console.log(item.name,searchBox.value);

        //console.log(item.name.toLowerCase().search(searchBox.value.toLowerCase()));

        if(item.name.toLowerCase().search(searchBox.value.toLowerCase()) >= 0){
            return true;
        }
    })

    //console.log(res);

    if(res.length == 0)
    {
        autoCompleteDiv.style.display="none";
        return;
    }

    let options="";

    res.forEach( (item) => {
        options+=` <div value="${item.name}" onclick="updateSearchBox(this)">${item.name}</div> `
    }) 

    autoCompleteDiv.innerHTML=options;

    autoCompleteDiv.style.display="block";

    console.log("updated",searchBox.value);

}

const debouncing = (delay,func) =>{

    console.log("called");

    if(interval_Id){
     clearTimeout(interval_Id);
    }

    interval_Id = setTimeout(() => {

        func();

    },delay);

}


function updateSearchBox(elt)
{
    searchBox.value=elt.getAttribute("value");

    autoCompleteDiv.style.display="none";

    const searchReslt = apiData.filter( (item) => {

        if(item.name.search(searchBox.value) >=0){
            return true;
        }

    })

    currData=searchReslt;

    console.log(currData);

    displayView(currData);

}

//api fetch
getData();

// to check for localstorage of favourites and store them if exists
if(!localStorage.getItem("favList"))
{
    localStorage.setItem("favList",JSON.stringify(new Array()));
}
else{
    favList=JSON.parse(localStorage.getItem("favList"));
}



//Event Handlers

searchBox.addEventListener('input',() => {
    debouncing(400,updateAutoFillDiv);
});

clearBtn.addEventListener('click',() => {
    searchBox.value = "";
    displayView(apiData);
    sortFilter.selectedIndex = 0;
    tagFilter.selectedIndex = 0;
    currData=apiData;
    displayView(apiData);
})

document.addEventListener('click',(event) => {
    if(!autoCompleteDiv.contains(event.target)){
        autoCompleteDiv.style.display="none";
    }
})

document.addEventListener('click',(event) =>{

    if(event.target.classList.contains("fav") || event.target.classList.contains("fa-heart")){
     if(! favList.includes(event.target.getAttribute("value"))){   
     favList.push(event.target.getAttribute("value"))
    }   
     localStorage.setItem("favList",JSON.stringify(favList));

     console.log(JSON.stringify(favList));

     console.log(localStorage.getItem(favList));
    }

})

favBtn.addEventListener('click',() => {

    const favItems = JSON.parse(localStorage.getItem("favList"));

    console.log(favItems);

    if(favItems.length == 0){
        displayView(new Array());
        return;
    }

    const favourites = apiData.filter( (item) => {
        if(favItems.includes(item.id.toString(10))){
            return true;
        }
    })

    console.log(favourites);

    currData=favourites;

    sortFilter.selectedIndex = 0;
    tagFilter.selectedIndex = 0;
    
    displayView(favourites);

})

homeBtn.addEventListener('click', () => {
    
    console.log('home view');

    currData=apiData;
    
    sortFilter.selectedIndex = 0;
    tagFilter.selectedIndex = 0;

    displayView(apiData);
    
})