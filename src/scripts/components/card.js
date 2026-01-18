export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement, cardId, deleteCardFromServer) => {
  // Удаляем карточку с сервера
  deleteCardFromServer({ cardId })
    .then(() => {
      // Если удаление на сервере успешно, удаляем элемент из DOM
      cardElement.remove();
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
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

  const cardOwnerId = data.owner._id;

  // Показываем кнопку удаления только если карточка принадлежит текущему пользователю
  if (cardOwnerId == currentUserId) {
    deleteButton.style.display = "";
    if (onDeleteCard) {
      deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data._id));
    }
  } else {
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
