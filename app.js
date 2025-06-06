function createCard(id, nombre, titre, rank, description, img) {
	const cardElement = document.createElement("div");
	const cardPrependElement = document.createElement("div");
	const cardAppendElement = document.createElement("div");
	const cardBoxElement = document.createElement("div");
	const spanNumberElement = document.createElement("span");
	const spanTitreElement = document.createElement("span");
	const spanRankElement = document.createElement("span");
	const imageElement = document.createElement("img");
	const pElement = document.createElement("p");
	const btnCloseElement = document.createElement("button");
	const btnEditElement = document.createElement("button");

	cardElement.classList.add("card");
	cardPrependElement.classList.add("card-prepend");
	cardBoxElement.classList.add("card-box");
	cardAppendElement.classList.add("card-append");

	spanNumberElement.classList.add("card-box", "bold");
	spanTitreElement.classList.add("card-box", "bold");
	spanRankElement.classList.add("card-box", "bold");

	pElement.classList.add("card-box", "card-description");

	btnCloseElement.classList.add("card-close");
	btnEditElement.classList.add("card-edit");

	imageElement.setAttribute("src", img);
	imageElement.setAttribute("alt", nombre);

	spanTitreElement.textContent = titre;
	spanRankElement.textContent = rank;
	spanNumberElement.textContent = nombre;
	pElement.textContent = description;
	btnCloseElement.textContent = "X";
	btnEditElement.textContent = "✏️";

	btnCloseElement.addEventListener("click", async () => {
		let x = await FetchDelete(API_URL, id);
		UpdateCards();
	});

	btnEditElement.addEventListener("click", async () => {
		EditCards(API_URL, id);
	});

	cardElement.appendChild(cardPrependElement);
	cardElement.appendChild(cardBoxElement);
	cardElement.appendChild(cardAppendElement);
	cardElement.appendChild(btnCloseElement);
	cardElement.appendChild(btnEditElement);

	cardPrependElement.appendChild(spanNumberElement);
	cardPrependElement.appendChild(spanTitreElement);
	cardPrependElement.appendChild(spanRankElement);

	cardBoxElement.appendChild(imageElement);

	cardAppendElement.appendChild(pElement);

	return cardElement;
}

function resetSectionGallery() {
	galleryElement.remove();

	galleryElement = document.createElement("section");
	galleryElement.classList.add("gallery");

	mainElement.appendChild(galleryElement);
}

function displayAllCards(cards) {
	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];

		const cardElement = createCard(
			card.id,
			card.number,
			card.name,
			card.rank,
			card.description,
			card.image
		);

		galleryElement.appendChild(cardElement);
	}
}

const API_URL = "http://192.168.1.97:3000/v1";

const mainElement = document.querySelector(".app");
const buttonAll = document.querySelector("#filter-all");
const buttonSS = document.querySelector("#filter-ss");
const buttonSMore = document.querySelector("#filter-s-more");
const inputSearch = document.querySelector("#filter-search");
const cardDialog = document.querySelector("#card-modal");
const openCardDialogBtn = document.querySelector("#open-card-modal");
const cardForm = document.querySelector("#card-form");
const cardEditModal = document.querySelector("#edit-card-form");
const cardEditForm = document.querySelector("#edit-card-modal");

let galleryElement = document.querySelector(".gallery");
let isFilterAll = true;
let isFilterSS = false;
let isFilterSOrMore = false;
let EditCardsId = 0;

cardForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	let Form = new FormData(cardForm);
	cardDialog.close();
	FetchPost(
		API_URL,
		Form.get("number"),
		Form.get("name"),
		Form.get("rank"),
		Form.get("description"),
		Form.get("isLegendary") != null,
		Form.get("image")
	);
	UpdateCards();
});

cardEditForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	let Form = new FormData(cardForm);
	cardEditForm.close();
	FetchPatch(
		API_URL,
		EditCardsId,
		Form.get("number"),
		Form.get("name"),
		Form.get("rank"),
		Form.get("description"),
		Form.get("isLegendary") != null,
		Form.get("image")
	);
	UpdateCards();
});

cardForm.addEventListener("submit", async (e) => {
	e.preventDefault();
});

openCardDialogBtn.addEventListener("click", () => {
	cardDialog.showModal();
});

buttonAll.addEventListener("click", async () => {
	buttonAll.classList.add("active");
	buttonSS.classList.remove("active");
	buttonSMore.classList.remove("active");

	isFilterAll = true;
	isFilterSS = false;
	isFilterSOrMore = false;

	UpdateCards();
});

buttonSMore.addEventListener("click", async () => {
	buttonAll.classList.remove("active");
	buttonSS.classList.remove("active");
	buttonSMore.classList.add("active");

	isFilterAll = false;
	isFilterSS = false;
	isFilterSOrMore = true;

	UpdateCards();
});

buttonSS.addEventListener("click", async () => {
	buttonAll.classList.remove("active");
	buttonSS.classList.add("active");
	buttonSMore.classList.remove("active");

	isFilterAll = false;
	isFilterSS = true;
	isFilterSOrMore = false;

	UpdateCards();
});

inputSearch.addEventListener("input", async (e) => {
	UpdateCards();
});

window.addEventListener("DOMContentLoaded", async () => {
	UpdateCards();
});

async function FetchGet(API, filter) {
	let URL = `${API}/cards`;
	if (filter != "") URL = URL + `?${filter}`;
	console.log(URL);
	const rep = await fetch(URL, {
		method: "GET",
	});
	const data = await rep.json();
	resetSectionGallery();
	displayAllCards(data);
}

async function FetchGet2(API, id) {
	const rep = await fetch(`${API}/cards/${id}`, {
		method: "GET",
	});
	const data = await rep.json();
	return data;
}

async function FetchPost(
	API,
	TxTnumber,
	TxTname,
	TxTrank,
	TxTdescription,
	TxTisLegendary,
	TxTimage
) {
	try {
		const rep = await fetch(`${API}/cards`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				number: TxTnumber,
				name: TxTname,
				rank: TxTrank,
				description: TxTdescription,
				isLegendary: TxTisLegendary,
				image: TxTimage,
			}),
		});
		const data = await rep.json();
	} catch (err) {
		console.error(err);
	}
}

async function FetchDelete(API, ID) {
	const rep = await fetch(`${API}/cards/${ID}`, {
		method: "DELETE",
	});
}

async function FetchPatch(
	API,
	ID,
	TxTnumber,
	TxTname,
	TxTrank,
	TxTdescription,
	TxTisLegendary,
	TxTimage
) {
	try {
		const rep = await fetch(`${API}/cards/${ID}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				number: TxTnumber,
				name: TxTname,
				rank: TxTrank,
				description: TxTdescription,
				isLegendary: TxTisLegendary,
				image: TxTimage,
			}),
		});
		const data = await rep.json();
	} catch (err) {
		console.error(err);
	}
}

async function EditCards(API, ID) {
	EditCardsId = ID;
	cardEditForm.showModal();
	let Data = await FetchGet2(API, ID);
	console.log(Data);
	cardEditForm.querySelector(`[name="name"]`).value = Data.name;
	cardEditForm.querySelector(`[name="number"]`).value = Data.number;
	cardEditForm.querySelector(`[name="rank"]`).value = Data.rank;
	cardEditForm.querySelector(`[name="description"]`).value = Data.description;
	console.log(Data.isLegendary);
	cardEditForm.querySelector(`[name="isLegendary"]`).cheked =
		Data.isLegendary;
	cardEditForm.querySelector(`[name="image"]`).value = Data.image;
}

function UpdateCards() {
	console.log(inputSearch.value.toLowerCase());
	if (isFilterAll == true) {
		if (inputSearch.value != "") {
			FetchGet(API_URL, `name=${inputSearch.value.toLowerCase()}`);
		} else {
			FetchGet(API_URL, "");
		}
	} else if (isFilterSS == true) {
		FetchGet(API_URL, `rank=ss`);
	} else if (isFilterSOrMore == true) {
		FetchGet(API_URL, `rank=s`);
	}
}
