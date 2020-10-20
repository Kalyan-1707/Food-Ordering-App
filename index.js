const getData = async () => {
    const res = await axios.get("https://raw.githubusercontent.com/Kalyan-1707/Food-Ordering-App/main/restaruants.json");

    console.log(res.data);
    displayView(res.data);
}

const displayView = (data) => {

    console.log(data);

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
            </div>
        
            <div class="card-title">
                <h1 class="title">${item.name}</h1>
                ${tags}    
            </div>
        
            <div class="card-body">
                <p class="rating">${item.rating}</p>
                <p class="eta">${item.eta} min</p>
            </div>
        
        </div>`

    });

    div.innerHTML=view;

}

getData();