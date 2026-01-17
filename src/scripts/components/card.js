export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, currentUserId }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  // Получаем id автора карточки (может быть объект owner._id или строка owner)
  const cardOwnerId = data.owner._id;

  // Показываем кнопку удаления только если карточка принадлежит текущему пользователю
  if (currentUserId && cardOwnerId === currentUserId) {
    // Кнопка видима (используем значение по умолчанию или удаляем скрытие)
    deleteButton.style.display = "";
    if (onDeleteCard) {
      deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
    }
  } else {
    // Скрываем кнопку удаления для чужих карточек
    deleteButton.style.display = "none";
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
