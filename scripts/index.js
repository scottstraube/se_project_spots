const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },

  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["profile-form"];
const profModalCloseBtn = editModal.querySelector(".modal__prof-close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

const cardForm = document.querySelector(".modal__form_add_card");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__card-close-btn");
const addCardElement = cardModal.querySelector("#add-card-form");
const cardImageLinkInput = cardModal.querySelector("#add-card-link-input");
const cardCaptionInput = cardModal.querySelector("#add-card-caption-input");

const imageModal = document.querySelector("#modal-preview");
const closeImageBtn = document.querySelector(".modal__close-btn_type_preview");
const cardImage = document.querySelector(".card__image");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const previewModalImageEl = imageModal.querySelector(".modal__image");
const previewModalCaption = imageModal.querySelector(".modal__caption");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEL = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEL.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () =>
    cardLikeBtn.classList.toggle("card__like-btn_liked")
  );

  cardImgEl.addEventListener("click", () => {
    openModal(imageModal);
    previewModalImageEl.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => cardElement.remove());

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDesc.textContent = editModalDescInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardCaptionInput.value,
    link: cardImageLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardList.prepend(cardElement);
  cardForm.reset();
  closeModal(cardModal);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescInput.value = profileDesc.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescInput],
    settings
  );
  openModal(editModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

addCardElement.addEventListener("submit", handleAddCardSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardList[method](cardElement);
}

initialCards.forEach((item) => {
  renderCard(item, "prepend");
});

const popups = document.querySelectorAll(".modal");

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
    if (evt.target.classList.contains("modal__close")) {
      closeModal(popup);
    }
  });
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}
