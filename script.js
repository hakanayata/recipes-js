// VARIABLES
const content = document.getElementById("content")
const cuisines = []
const flags = document.querySelectorAll(".flag")
const form = document.getElementById("form")

// fill cuisines array
document.querySelectorAll("li").forEach((li) => {
    cuisines.push(li.id)
})

const random_cuisine = get_random_cuisine()
let fetch_result = []
// -------------
// display random cuisine's meals
getCuisineData()
// style the flag of that cuisine
style_active_cuisine(random_cuisine)

// When a flag is clicked, show user that cuisine's meals
flags.forEach((flag) => {
    flag.addEventListener('click', () => {
        getCuisineData(flag.id)
    })
})

// SEARCH
form.addEventListener('input', (e) => {
    // displays searched element on each input
    const search_text = e.target.value.toLowerCase()
    const filtered_meals = fetch_result.filter(meal => meal.strMeal.toLowerCase().includes(search_text))

    displayCuisines(filtered_meals)

})

// FUNCTIONS
async function getCuisineData(cuisine = random_cuisine) {
    // gets data with fetch, calls display function
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`)
        if (!res.ok) { throw new Error("Could not fetch data") }
        const data = await res.json()
        fetch_result = data.meals
        // console.log(fetch_result)

        displayCuisines(fetch_result)
        style_active_cuisine(cuisine)
        // return fetch_result
    } catch (error) {
        console.log(error)
    }
}

function displayCuisines(meals) {
    // displays data on the page

    content.innerHTML = ''

    function format_name(str) {
        return str.split(" ").join("-")
    }

    meals.forEach(meal => {
        const meal_card = document.createElement("div")
        meal_card.setAttribute("class", "card card-shadow-lg")
        meal_card.setAttribute("style", "width: 18rem; height:26rem")

        const url = `https://www.themealdb.com/meal/${meal.idMeal}-${format_name(meal.strMeal)}-Recipe`

        meal_card.innerHTML = `
            <img src=${meal.strMealThumb} class="card-img-top" alt="food picture">
            <div class="card-body d-flex flex-column justify-content-around">
                <h5 class="card-title">${meal.strMeal}</h5>
                <a href=${url} class="btn btn-primary">See Details</a>
            </div>`

        content.appendChild(meal_card)

    })

}

function get_random_cuisine() {
    // returns random cuisine
    const index = Math.round(Math.random() * 4)
    return cuisines[index]
}

function style_active_cuisine(cuisine) {
    // gives a style to active list element
    flags.forEach(flag => {
        if (flag.classList.contains("active")) {
            flag.classList.remove("active")
        }
    })
    const active_cuisine = Array.from(flags).filter(f => f.id == cuisine)
    active_cuisine[0].classList.add("active")
}