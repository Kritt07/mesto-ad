export const likeCard = (likeButton, cardId, changeLikeCardStatus) => {
  // Проверяем, лайкнута ли карточка (есть ли класс is-active)
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  changeLikeCardStatus(cardId, isLiked)
    .then((data) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeButton.nextElementSibling.textContent = data.likes.length;
    })
    .catch((err) => {
      console.error("Ошибка при изменении статуса лайка:", err);
    });
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
  if (data.owner._id != currentUserId) {
    deleteButton.remove();
  }
  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement, data._id));
  }

  // Проверяем, лайкнул ли текущий пользователь эту карточку
  const isLikedByCurrentUser = data.likes.some(like => like._id === currentUserId);
  if (isLikedByCurrentUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      onLikeIcon(likeButton, data._id, data.likes.length)
      likeButton.nextElementSibling.textContent = data.likes.length;
    });
  }
  likeButton.nextElementSibling.textContent = data.likes.length;

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
