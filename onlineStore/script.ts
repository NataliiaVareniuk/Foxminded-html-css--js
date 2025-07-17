const emailId = document.getElementById('subscribe-btn') as HTMLElement;
const searchInput = document.querySelector('.form-search__input') as HTMLElement;
const emailValue = document.getElementById('id-email') as HTMLInputElement;
const notValidEmail = document.querySelector('.form__label') as HTMLElement;
const placeClick = document.querySelector('.filter') as HTMLElement;
const placeStore = document.querySelector('.body-allites__group') as HTMLElement; 
const showAllBtn = document.getElementById('allites-btn') as HTMLElement;
const searchBtn = document.getElementById('search-btn') as HTMLInputElement ; 
const searchValue = document.querySelector('.form-search__input') as HTMLInputElement;
const totalSumOutput = document.querySelector('.total-basket__total-sum') as HTMLInputElement;
const basketPlace = document.querySelector('.top-basket__commodities') as HTMLInputElement;
const openBasket = document.getElementById("open-basket") as HTMLButtonElement;
const submitBasket = document.getElementById("submitBtn") as HTMLButtonElement;
const closeBasket = document.getElementById('close-button') as HTMLElement;
const basket = document.querySelector('.basket') as HTMLElement;
const busketCount = document.querySelector('.shopping') as  HTMLElement;
let slider = document.getElementById("range") as HTMLInputElement;
let output = document.getElementById("value") as HTMLElement;
const getBasket = () : IProduct[] => JSON.parse(localStorage.getItem("order") || "[]");
const minAmountOnPage: number = 8;
const minimalPrice: number = 0;
let comparePrice: number = 0;
const tablet: number = 700;
let totalSum: number = 0;
let totalCountInBusket: number = getCountProducts();
let dataJson: IProduct[] = []; 
let dataJsonById: Record<string, IProduct> = {};
let basketProducts : IProduct[] = getBasket(); 

interface IProduct{
  article: string,
  img: string,
  title: string,
  price : number,
  category: string,
  rating : string,
  count?: number
}

(function(){
  	getOrder();
})();

document.addEventListener('click', menuClose);
document.addEventListener("click", menuOpen);
if(placeClick) placeClick.addEventListener('click', filterStore);
document.addEventListener('click', addClassActive);

window.addEventListener("resize", () => {
  document.documentElement.classList.remove('menu-open');
});

function menuOpen(event: Event): void  {
  const targetElement = event.target as HTMLElement;
  const currentMenu = targetElement.closest('.content-header__button-open') as HTMLElement;
   
  if (currentMenu) {
    if (window.innerWidth <= tablet){
      document.documentElement.classList.add('menu-open');
    }
   }
}

function menuClose(event: Event) : void {
  const targetElement = event.target as HTMLElement;
  if(!targetElement) return;
  const currentMenu = targetElement.closest('.content-header__button-close') as HTMLElement;
  
  if (currentMenu) {
    document.documentElement.classList.remove('menu-open');
  }
}

if(emailId){
  emailId.addEventListener('click', (event: Event) => {
    event.preventDefault();
    const valueEmpty : boolean = emptyValidate();
    const value : boolean = validateEmail();
    if (valueEmpty || !value) {
      notValidEmail.classList.add('not-valid');
    } else {
      notValidEmail.classList.remove('not-valid');
      emailValue.value == '';
    }  
  });
}

function emptyValidate(): boolean  {
  return !emailValue.value;
} 

function validateEmail(): boolean  {
  const emailPattern  = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/; 
  return (emailPattern.test(emailValue.value));
}

async function getOrder() {
	try {
		if(!dataJson.length){
			const response = await fetch('/data/products.json');
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			  }
			  dataJson = await response.json();
			  dataJsonById = dataJson.reduce((accum, item) => {
				accum[item.article] = item;
				return accum;
			}, {});
      showAllProfucts(dataJson, minAmountOnPage);
      if(busketCount) busketCount.style.setProperty('--product_count', `${totalCountInBusket}`);
    }
	 } catch (error) {
		 console.error("Read error:", error);
	}
}

if (output)  output.innerHTML = convert(slider.value);
if (slider) {
  slider.addEventListener('input', function (this: HTMLInputElement): void {
    const value: string = this.value;
    output.innerHTML = convert(value);
    progress(value);
    comparePrice = parseFloat(value)/10;
    filterStoreByPrice();
  });
}

function convert (value : string): string {
  return("$"+ parseFloat(value)/10 );
}

function  progress(valueProgress : string): void{
  let index =(parseFloat(valueProgress) /parseFloat(slider.max))*100 ;
  slider.style.background =`linear-gradient(to right, #d64200 ${index}%, #ffffff ${index}%)`;
}

function showAllProfucts(dataArray: IProduct[], amount: number) {
  if(!placeStore || !dataArray || !dataArray.length) return;
  placeStore.innerHTML = '';
   if(amount > dataArray.length) amount = dataArray.length;

  for  (let i = 0; i < amount; i++){
    addCardToStore(dataArray[i]);
  }
  addMark();
}

function addMark(): void{
  const listCard = document.querySelectorAll<HTMLElement>('.product__card')  ;
	
  listCard.forEach((element: HTMLElement) => {
	  let id = element.dataset.id;
	  if (!id) return;
    const resProduct = productIsInBasket(id);
    if (resProduct) {
      element.classList.add('in-basket');
    }
  });
}

function filterStore(event: Event): void {
  let target = event.target as HTMLElement;
  if(!target || target.tagName !== 'LI') return;
  const filterId: string = target.dataset['id'].trim().toLowerCase();
  searchValue.value = "";
  if(!filterId) return;
  let filteredArray1: IProduct[] = [];
  let filteredArray: IProduct[] = [];
  
  if (filterId === "all"){ 
    filteredArray = filterByPrice(dataJson); 
    showAllBtn.classList.add('hide');
  } else {
	  filteredArray = filterByPrice(filterByCategory(filterId)); 
	  showAllBtn.classList.remove('hide');
   }
  showAllProfucts(filteredArray, filteredArray.length);
}

function filterStoreByPrice(): void {
  const filterElement = document.querySelector('.active-sorting') as HTMLElement;
  let filteredArrayByCategegory: IProduct[] = [];
  let filteredArray: IProduct[] = [];
  
  if (filterElement === null){ 
    filteredArray = searchProduct();
    showAllBtn.classList.add('hide'); 
  }	else {
    const filterData: string = filterElement.textContent.trim().toLowerCase();
	  filteredArrayByCategegory = filterByCategory(filterData);
    filteredArray = filterByPrice(filteredArrayByCategegory); 
    showAllBtn.classList.remove('hide');
  }
  showAllProfucts(filteredArray, filteredArray.length);
}

function addClassActive(event: Event) {
	const targetElement = event.target as HTMLElement;
	const currActive = targetElement.closest<HTMLElement>('.active-sorting');

	if (currActive) {
		currActive.classList.remove('active-sorting');
		showAllProfucts(dataJson, dataJson.length); 
	} else if (targetElement.closest('.sorting__item')) {
	    clearAllActive();
		 const currElem = targetElement.closest<HTMLElement>('.sorting__item');
	     currElem.classList.add('active-sorting');
	  }
}

function clearAllActive(): void {
  const element = document.querySelector<HTMLElement>('.active-sorting');
  if (element) element.classList.remove('active-sorting');
}

if(showAllBtn){
  showAllBtn.addEventListener('click', () => {
    showAllProfucts(dataJson, dataJson.length);
    clearAllActive();
    showAllBtn.classList.add('hide');
  });
}

if(showAllBtn){
  searchBtn.addEventListener('click', searchProduct);
}

if(searchInput){
  searchInput.addEventListener ('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      searchProduct();
    }
  });
  searchInput.addEventListener('input', searchProduct);
  showAllBtn.classList.remove('hide');
}

function searchProduct(): IProduct[]{
  const searchElem: string = searchValue.value.trim().toLocaleLowerCase();
  let filteredArrayByCategegory: IProduct[] = [];
  let filteredArray: IProduct[] = [];

  if(!searchElem || searchElem === "") {
     filteredArray = filterByPrice(dataJson);
  }
  else{
    clearAllActive();
    filteredArrayByCategegory = searchByCategory(searchElem);
    filteredArray = filterByPrice(filteredArrayByCategegory);
  }
  showAllProfucts(filteredArray, filteredArray.length);
  return filteredArray;
}

function productIsInBasket(id: string):IProduct{
  return basketProducts.find((product) => product.article === id);
}

function filterByPrice(products: IProduct[]){
  let priceArr: IProduct[] = [];
  let sorted: IProduct[] = [];
  if(comparePrice > 0) {
    for (let i = 0; i < products.length; i++){
      if(products[i].price <= comparePrice) {
        priceArr.push(products[i]);
      }
    }
  sorted = bubbleSortArr(priceArr); 
  } 
  else sorted = bubbleSortArr(products); 
  return sorted;
}

function searchByCategory(searchData: string): IProduct[]{
  let categoryArr: IProduct[] = [];
 
  for (let i = 0; i < dataJson.length; i++){
	  const dataFromArray: string = dataJson[i].category.trim().toLowerCase();
    if(dataFromArray.includes(searchData)){ 
      categoryArr.push(dataJson[i]);
    }
  }
  return(categoryArr);
}

function filterByCategory(filterData: string): IProduct[]{
  let categoryArr: IProduct[] = [];
  if (filterData === 'all') return (dataJson);
  for (let i = 0; i < dataJson.length; i++){
	  const compareData: string = dataJson[i].category.trim().toLowerCase();
    if(filterData.includes(compareData)){ 
      categoryArr.push(dataJson[i]);
    }
  }
  return(categoryArr);
}

function bubbleSortArr(array: IProduct[]): IProduct[]{
  let isNotFinish: boolean = false; 
  let iterationCount = 0;
  do{ isNotFinish = false; 
    for (let i = 1; i < array.length; i++){
      if(array[i-1].price > array[i].price){
	      let tempVariable = array[i-1].price;
	      array[i-1].price = array[i].price;
	      array[i].price = tempVariable;
	      isNotFinish = true;
	      iterationCount++;
 	    }
    }
  }
  while(isNotFinish)
  return array;
}

function addCardToBasket (data: IProduct): void{
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

function addCardToStore(data: IProduct): void{
  const template = ` <div data-id="${data.article}" class="product__card card">
                              <span class="card__add-mark ">Add</span>
                              <img src="${data.img}" alt="img product" class="card__img">
                              <div class="card__about ">
                                  <h5 class="card__title">${data.title}</h5>
                                  <span class="card__prise">$${data.price}</span>
                                  <img src="./img/icon/stars.svg" alt="img rating" class="card__rating-img">
                                  <span class="card__category">${data.category}</span>
                              </div>
                          </div>`

  placeStore.insertAdjacentHTML("beforeend",template);  
}

if(closeBasket){
  closeBasket.addEventListener('click', () => {
    basket.classList.remove('open-basket');
    saveBasket();
  });
}

if(openBasket){
  openBasket.addEventListener('click', () => {
    basket.classList.add('open-basket');
    showBasket();
  })
}

document.addEventListener('click', (e: Event) =>{
  const targetElement = e.target as HTMLElement;
  const currElem = targetElement.closest<HTMLElement>('.card__add-mark');
  
  if(currElem){
      const card = targetElement.closest<HTMLElement>('.product__card');
      if(!card) return;
      let idProduct = card.dataset.id;
      if(!idProduct) return;
      card.classList.add('in-basket');
      const product = dataJsonById[idProduct]; 
      if(!product) return;
            
      basketProducts.push({
       ...product,
       count: 1
      });
   }
  totalCountInBusket = getCountProducts(); 
  saveBasket();
  if(busketCount) busketCount.style.setProperty('--product_count', `"${totalCountInBusket}"`);
  
});

document.addEventListener('click', (e: Event) => {
	const targetElement = e.target as HTMLElement;
		
	if(targetElement.closest<HTMLElement>('.top-count__plus')){
	 	const card = targetElement.closest<HTMLElement>('.top-basket__commodity');
      if(!card) return;
	    const idProduct = card.dataset.id;
      if(!idProduct)return;
      const resProduct: IProduct = productIsInBasket(idProduct);
	   	if(resProduct){
        resProduct.count += 1;
        saveBasket();  
      }  
	 }else if(targetElement.closest('.top-count__minus')){
		   const card = targetElement.closest<HTMLElement>('.top-basket__commodity');
       if(!card) return;
		   const idProduct = card.dataset.id ;
       if(!idProduct)return;
       const resProduct: IProduct = productIsInBasket(idProduct);
       if (!resProduct) return;
       if( resProduct.count > 1){
          resProduct.count -= 1;
        } else {
          removeFromBasket(resProduct);
          removeMark(idProduct);
      }    
	}else if(targetElement.closest('.bottom-count__remove-btn')){
		const card = targetElement.closest<HTMLElement>('.top-basket__commodity');
    if(!card) return;

    const idProduct = card.dataset.id;
    if(!idProduct) return;

    const resProduct: IProduct = productIsInBasket(idProduct);
    if (!resProduct)  return;

    removeFromBasket(resProduct);
    removeMark(idProduct);		
 }
 totalCountInBusket = getCountProducts(); 
 saveBasket();
 if(busketCount) busketCount.style.setProperty('--product_count', `"${totalCountInBusket}"`);
 showBasket();
});

function removeFromBasket(delProduct: IProduct){
  const productIndex = basketProducts.findIndex(product => product.article === delProduct.article);
  if (productIndex !== -1) {
    basketProducts.splice(productIndex, 1);
  }
}

function showBasket(): void{
	basketPlace.innerHTML = "";
  totalSum = totalSumCalculate();

	if(totalSumOutput){
    totalSumOutput.value = totalSum.toString();
  }
  
  for(let i = 0; i < basketProducts.length; i++){
    addCardToBasket(basketProducts[i]);
  }  
}

function totalSumCalculate(): number{
  let totalSum: number = 0;
	
  for(let i in basketProducts){
	  totalSum += basketProducts[i].price * basketProducts[i].count;
  }
	return totalSum;
}

function saveBasket(): void{
	const basket = JSON.stringify(basketProducts);
	localStorage.clear();
	localStorage.setItem("order", basket);
}

function removeMark(idProduct: string): void{
	const listCard = document.querySelectorAll <HTMLElement> ('.product__card');
	
	listCard.forEach(element =>{
		if(element.dataset.id === idProduct)
			element.classList.remove('in-basket');
	})
}

function clearAllMark(): void{
	const listCard = document.querySelectorAll <HTMLElement> ('.product__card');
	
	listCard.forEach(element =>{
		element.classList.remove('in-basket');
	})
}

if (submitBasket){
  submitBasket.addEventListener('click', () => {
    totalSum = 0;
    clearAllMark();
    basketProducts.length = 0;
    localStorage.clear();
    showBasket();
 })
}
function getCountProducts(): number {
  return basketProducts.reduce((sum, el) => sum + el.count, 0);
}
