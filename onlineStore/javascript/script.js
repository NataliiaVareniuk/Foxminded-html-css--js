"use strict";
const emailId = document.getElementById('subscribe-btn');
const searchInput = document.querySelector('.form-search__input');
const emailValue = document.getElementById('id-email');
const notValidEmail = document.querySelector('.form__label');
const placeClick = document.querySelector('.filter');
const placeStore = document.querySelector('.body-allites__group');
const showAllBtn = document.getElementById('allites-btn');
const searchBtn = document.getElementById('search-btn');
const searchValue = document.querySelector('.form-search__input');
const totalSumOutput = document.querySelector('.total-basket__total-sum');
const basketPlace = document.querySelector('.top-basket__commodities');
const openBasket = document.getElementById("open-basket");
const submitBasket = document.getElementById("submitBtn");
const closeBasket = document.getElementById('close-button');
const basket = document.querySelector('.basket');
const busketCount = document.querySelector('.shopping');
let slider = document.getElementById("range");
let output = document.getElementById("value");
const minAmountOnPage = 8;
const minimalPrice = 0;
let comparePrice = 0;
const tablet = 700;
let totalSum = 0;
let totalCountInBusket = 0;
let dataJson = [];
let dataJsonById = {};
let basketProducts = [];
basketProducts = getBasket();
totalCountInBusket = getCountProducts();
(function () {
    getOrder();
})();
document.addEventListener('click', menuClose);
document.addEventListener("click", menuOpen);
if (placeClick)
    placeClick.addEventListener('click', filterStore);
document.addEventListener('click', addClassActive);
window.addEventListener("resize", () => {
    document.documentElement.classList.remove('menu-open');
});
function menuOpen(event) {
    const targetElement = event.target;
    const currentMenu = targetElement.closest('.content-header__button-open');
    if (currentMenu) {
        if (window.innerWidth <= tablet) {
            document.documentElement.classList.add('menu-open');
        }
    }
}
function menuClose(event) {
    const targetElement = event.target;
    if (!targetElement)
        return;
    const currentMenu = targetElement.closest('.content-header__button-close');
    if (currentMenu) {
        document.documentElement.classList.remove('menu-open');
    }
}
if (emailId) {
    emailId.addEventListener('click', (event) => {
        event.preventDefault();
        const valueEmpty = emptyValidate();
        const value = validateEmail();
        if (valueEmpty || !value) {
            notValidEmail.classList.add('not-valid');
        }
        else {
            notValidEmail.classList.remove('not-valid');
            emailValue.value == '';
        }
    });
}
function emptyValidate() {
    if (emailValue.value === '' || emailValue.value === null)
        return true;
    return false;
}
function validateEmail() {
    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    return (emailPattern.test(emailValue.value));
}
async function getOrder() {
    try {
        if (!dataJson.length) {
            const response = await fetch('http://localhost:5500/data/products.json');
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            dataJson = await response.json();
            dataJsonById = dataJson.reduce((accum, item) => {
                accum[item.article] = item;
                return accum;
            }, {});
            showAllProfucts(dataJson, minAmountOnPage);
            if (busketCount)
                busketCount.style.setProperty('--product_count', `"${totalCountInBusket}"`);
        }
    }
    catch (error) {
        console.error("Read error:", error);
    }
}
if (output)
    output.innerHTML = convert(slider.value);
if (slider) {
    slider.addEventListener('input', function () {
        const value = this.value;
        output.innerHTML = convert(value);
        progress(value);
        comparePrice = parseFloat(value) / 10;
        filterStoreByPrice();
    });
}
function convert(value) {
    return ("$" + parseFloat(value) / 10);
}
function progress(valueProgress) {
    let index = (parseFloat(valueProgress) / parseFloat(slider.max)) * 100;
    slider.style.background = `linear-gradient(to right, #d64200 ${index}%, #ffffff ${index}%)`;
}
function showAllProfucts(dataArray, amount) {
    if (!placeStore)
        return;
    placeStore.innerHTML = '';
    if (!dataArray || !dataArray.length)
        return;
    if (amount > dataArray.length)
        amount = dataArray.length;
    for (let i = 0; i < amount; i++) {
        addCardToStore(dataArray[i]);
    }
    addMark();
}
function addMark() {
    const listCard = document.querySelectorAll('.product__card');
    listCard.forEach((element) => {
        let id = element.dataset.id;
        if (!id)
            return;
        const resProduct = thisInBasket(id);
        if (resProduct) {
            element.classList.add('in-basket');
        }
    });
}
function filterStore(event) {
    let target = event.target;
    if (!target || target.tagName !== 'LI')
        return;
    const filterId = target.dataset['id'].trim().toLowerCase();
    searchValue.value = "";
    if (!filterId)
        return;
    let filteredArray1 = [];
    let filteredArray = [];
    if (filterId === "all") {
        filteredArray = filterByPrice(dataJson);
        showAllBtn.classList.add('hide');
    }
    else {
        filteredArray1 = filterByCategory(filterId);
        filteredArray = filterByPrice(filteredArray1);
        showAllBtn.classList.remove('hide');
    }
    showAllProfucts(filteredArray, filteredArray.length);
}
function filterStoreByPrice() {
    const filterElement = document.querySelector('.active-sorting');
    let filteredArrayByCategegory = [];
    let filteredArray = [];
    if (filterElement === null) {
        filteredArray = searchProduct();
        showAllBtn.classList.add('hide');
    }
    else {
        const filterData = filterElement.textContent.trim().toLowerCase();
        filteredArrayByCategegory = filterByCategory(filterData);
        filteredArray = filterByPrice(filteredArrayByCategegory);
        showAllBtn.classList.remove('hide');
    }
    showAllProfucts(filteredArray, filteredArray.length);
}
function addClassActive(event) {
    const targetElement = event.target;
    const currActive = targetElement.closest('.active-sorting');
    if (currActive) {
        currActive.classList.remove('active-sorting');
        showAllProfucts(dataJson, dataJson.length);
    }
    else if (targetElement.closest('.sorting__item')) {
        clearAllActive();
        const currElem = targetElement.closest('.sorting__item');
        currElem.classList.add('active-sorting');
    }
}
function clearAllActive() {
    const element = document.querySelector('.active-sorting');
    if (element)
        element.classList.remove('active-sorting');
}
if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
        showAllProfucts(dataJson, dataJson.length);
        clearAllActive();
        showAllBtn.classList.add('hide');
    });
}
if (showAllBtn) {
    searchBtn.addEventListener('click', searchProduct);
}
if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchProduct();
        }
    });
    searchInput.addEventListener('input', searchProduct);
    showAllBtn.classList.remove('hide');
}
function searchProduct() {
    const searchElem = searchValue.value.trim().toLocaleLowerCase();
    let filteredArrayByCategegory = [];
    let filteredArray = [];
    if (!searchElem || searchElem === "") {
        filteredArray = filterByPrice(dataJson);
    }
    else {
        clearAllActive();
        filteredArrayByCategegory = searchByCategory(searchElem);
        filteredArray = filterByPrice(filteredArrayByCategegory);
    }
    showAllProfucts(filteredArray, filteredArray.length);
    return filteredArray;
}
function thisInBasket(id) {
    return basketProducts.find((product) => product.article === id);
}
function filterByPrice(products) {
    let priceArr = [];
    let sorted = [];
    if (comparePrice > 0) {
        for (let i = 0; i < products.length; i++) {
            if (products[i].price <= comparePrice) {
                priceArr.push(products[i]);
            }
        }
        sorted = bubbleSortArr(priceArr);
    }
    else
        sorted = bubbleSortArr(products);
    return sorted;
}
function searchByCategory(searchData) {
    let categoryArr = [];
    for (let i = 0; i < dataJson.length; i++) {
        const dataFromArray = dataJson[i].category.trim().toLowerCase();
        if (dataFromArray.includes(searchData)) {
            categoryArr.push(dataJson[i]);
        }
    }
    return (categoryArr);
}
function filterByCategory(filterData) {
    let categoryArr = [];
    if (filterData === 'all')
        return (dataJson);
    for (let i = 0; i < dataJson.length; i++) {
        const compareData = dataJson[i].category.trim().toLowerCase();
        if (filterData.includes(compareData)) {
            categoryArr.push(dataJson[i]);
        }
    }
    return (categoryArr);
}
function bubbleSortArr(array) {
    let notFinish = false;
    let iterationCount = 0;
    do {
        notFinish = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1].price > array[i].price) {
                let tempVariable = array[i - 1].price;
                array[i - 1].price = array[i].price;
                array[i].price = tempVariable;
                notFinish = true;
                iterationCount++;
            }
        }
    } while (notFinish);
    return array;
}
function addCardToBasket(data) {
    const template = ` <div data-id="${data.article}" class="top-basket__commodity commodity">
                             <div class="commodity__part-img img-commodity">
                                 <img class="img-commodity__img" src="${data.img}" alt="Image commodity">
                                 <div class="img-commodity__about">
                                     <h4 class="img-commodity__title">${data.title}</h4>
                                     <span class="img-commodity__price">$${data.price}</span>
                                 </div>
                             </div>
                             <div class="commodity__part-count count-commodity">
                                 <div class="count-commodity__top top-count">
                                     <span class="top-count__minus">-</span>
                                     <span id="basket-amount" class="top-count__number">${data.count}</span>
                                     <span class="top-count__plus">+</span>
                                 </div>
                                 <div class="count-commodity__bottom bottom-count">
                                     <span class="bottom-count__remove">Remove </span>
                                     <button id="remove-busket" class="bottom-count__remove-btn"></button>
                                 </div>
                             </div>
                         </div>`;
    basketPlace.insertAdjacentHTML("beforeend", template);
}
function addCardToStore(data) {
    const template = ` <div data-id="${data.article}" class="product__card card">
                              <span class="card__add-mark ">Add</span>
                              <img src="${data.img}" alt="img product" class="card__img">
                              <div class="card__about ">
                                  <h5 class="card__title">${data.title}</h5>
                                  <span class="card__prise">$${data.price}</span>
                                  <img src="./img/icon/stars.svg" alt="img rating" class="card__rating-img">
                                  <span class="card__category">${data.category}</span>
                              </div>
                          </div>`;
    placeStore.insertAdjacentHTML("beforeend", template);
}
if (closeBasket) {
    closeBasket.addEventListener('click', () => {
        basket.classList.remove('open-basket');
        saveBasket();
    });
}
if (openBasket) {
    openBasket.addEventListener('click', () => {
        basket.classList.add('open-basket');
        showBasket();
    });
}
document.addEventListener('click', (e) => {
    const targetElement = e.target;
    const currElem = targetElement.closest('.card__add-mark');
    if (currElem) {
        const card = targetElement.closest('.product__card');
        if (!card)
            return;
        let idProduct = card.dataset.id;
        if (!idProduct)
            return;
        card.classList.add('in-basket');
        const product = dataJsonById[idProduct];
        if (!product)
            return;
        basketProducts.push({
            ...product,
            count: 1
        });
    }
    totalCountInBusket = getCountProducts();
    saveBasket();
    if (busketCount)
        busketCount.style.setProperty('--product_count', `"${totalCountInBusket}"`);
});
document.addEventListener('click', (e) => {
    const targetElement = e.target;
    if (targetElement.closest('.top-count__plus')) {
        const card = targetElement.closest('.top-basket__commodity');
        if (!card)
            return;
        const idProduct = card.dataset.id;
        if (!idProduct)
            return;
        const resProduct = thisInBasket(idProduct);
        if (resProduct) {
            resProduct.count += 1;
            saveBasket();
        }
    }
    else if (targetElement.closest('.top-count__minus')) {
        const card = targetElement.closest('.top-basket__commodity');
        if (!card)
            return;
        const idProduct = card.dataset.id;
        if (!idProduct)
            return;
        const resProduct = thisInBasket(idProduct);
        if (!resProduct)
            return;
        if (resProduct.count > 1) {
            resProduct.count -= 1;
        }
        else {
            removeFromBasket(resProduct);
            removeMark(idProduct);
        }
    }
    else if (targetElement.closest('.bottom-count__remove-btn')) {
        const card = targetElement.closest('.top-basket__commodity');
        if (!card)
            return;
        const idProduct = card.dataset.id;
        if (!idProduct)
            return;
        const resProduct = thisInBasket(idProduct);
        if (!resProduct)
            return;
        removeFromBasket(resProduct);
        removeMark(idProduct);
    }
    totalCountInBusket = getCountProducts();
    saveBasket();
    if (busketCount)
        busketCount.style.setProperty('--product_count', `"${totalCountInBusket}"`);
    showBasket();
});
function removeFromBasket(delProduct) {
    const productIndex = basketProducts.findIndex(product => product.article === delProduct.article);
    if (productIndex !== -1) {
        basketProducts.splice(productIndex, 1);
    }
}
function showBasket() {
    basketPlace.innerHTML = "";
    totalSum = totalSumCalculate();
    if (totalSumOutput) {
        totalSumOutput.value = totalSum.toString();
    }
    for (let i = 0; i < basketProducts.length; i++) {
        addCardToBasket(basketProducts[i]);
    }
}
function totalSumCalculate() {
    let totalSum = 0;
    for (let i in basketProducts) {
        totalSum += basketProducts[i].price * basketProducts[i].count;
    }
    return totalSum;
}
function saveBasket() {
    const basket = JSON.stringify(basketProducts);
    localStorage.clear();
    localStorage.setItem("order", basket);
}
function getBasket() {
    const basket = localStorage.getItem("order") || "[]";
    return JSON.parse(basket);
}
function removeMark(idProduct) {
    const listCard = document.querySelectorAll('.product__card');
    listCard.forEach(element => {
        if (element.dataset.id === idProduct)
            element.classList.remove('in-basket');
    });
}
function clearAllMark() {
    const listCard = document.querySelectorAll('.product__card');
    listCard.forEach(element => {
        element.classList.remove('in-basket');
    });
}
if (submitBasket) {
    submitBasket.addEventListener('click', () => {
        totalSum = 0;
        clearAllMark();
        basketProducts.length = 0;
        localStorage.clear();
        showBasket();
    });
}
function getCountProducts() {
    let sum = 0;
    basketProducts.forEach((element) => {
        sum += element.count;
    });
    return sum;
}
//# sourceMappingURL=script.js.map