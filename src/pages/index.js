import "./index.css";

import logoImage from "../images/logo.svg";

import avatarImage from "../images/avatar.jpg";

import pencilIcon from "../images/pencil-light.svg";

import Api from "../utils/Api.js";

import { setButtonText } from "../utils/helpers.js";

import { enableValidation, settings } from "../scripts/validation";

import { resetValidation } from "../scripts/validation";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "118ce25e-2b86-440f-b5e1-b0b2067a2396",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    cards.forEach((item) => {
      renderCard(item, "append");
    });
    avatarElement.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDesc.textContent = userInfo.about;
  })
  .catch(console.error);

//Images
const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;
const avatarElement = document.querySelector(".profile__avatar");
avatarElement.src = avatarImage;
const pencilLight = document.querySelector(".profile__pencil-light");
pencilLight.src = pencilIcon;

//Profile Modal
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["profile-form"];
const profModalCloseBtn = editModal.querySelector(".modal__prof-close-btn");
const profSubmitBtn = editModal.querySelector(".modal__button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");

//Card Modal
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");
const cardForm = document.querySelector(".modal__form_add_card");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__card-close-btn");
const addCardElement = cardModal.querySelector("#add-card-form");
const cardImageLinkInput = cardModal.querySelector("#add-card-link-input");
const cardCaptionInput = cardModal.querySelector("#add-card-caption-input");

//Image Modal
const imageModal = document.querySelector("#modal-preview");
const closeImageBtn = document.querySelector(".modal__close-btn_type_preview");
const cardImage = document.querySelector(".card__image");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const previewModalImageEl = imageModal.querySelector(".modal__image");
const previewModalCaption = imageModal.querySelector(".modal__caption");

//Avatar Modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarCancelBtn = avatarModal.querySelector(".modal__cancel-btn");

//Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteSubmitBtn = deleteModal.querySelector(".modal__button");

let selectedCard, selectedCardId;

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
  cardElement.isLiked = data.isLiked;

  if (data.isLiked == true) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  } else {
    cardLikeBtn.classList.remove("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", function () {
    handleLike(data, cardLikeBtn);
  });

  cardImgEl.addEventListener("click", () => {
    openModal(imageModal);
    previewModalImageEl.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

function handleLike(cardData, buttonElement) {
  api
    .toggleLike(cardData._id, cardData.isLiked)
    .then((data) => {
      cardData.isLiked = data.isLiked;
      buttonElement.classList.toggle("card__like-btn_liked", data.isLiked);
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
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
  setButtonText(profSubmitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDesc.textContent = data.about;

      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(profSubmitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  setButtonText(cardSubmitBtn, true);
  const inputValues = {
    name: cardCaptionInput.value,
    link: cardImageLinkInput.value,
  };
  api
    .addCards(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardList.prepend(cardElement);
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  setButtonText(avatarSubmitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatarElement.src = avatarInput.value;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false);
    });
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

const closeButtons = document.querySelectorAll(
  ".modal__close-btn, .modal__cancel-btn"
);

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

addCardElement.addEventListener("submit", handleAddCardSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardList[method](cardElement);
}

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

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  setButtonText(deleteSubmitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSubmitBtn, false, "Delete", "Deleting...");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
