import {createNewPost} from './objects/post.js';
import comment from './objects/comment.js';

const allPosts = [];

const editModal = document.querySelector('.edit-modal');
const editTitleInput = document.querySelector('.edit-title-input');
const editTextInput = document.querySelector('.edit-text-input');
const saveEditBtn = document.querySelector('.save-edit-btn');
const cancelEditBtn = document.querySelector('.cancel-edit-btn');

let postBeingEdited = null;
let postCardBeingEdited = null;

const postTitleInput = document.querySelector('.title');
const postTextInput = document.querySelector('.text');
const createBtn = document.querySelector('.create-post .primary');
const postList = document.querySelector('.post-list');

createBtn.addEventListener('click', () => {
    createNewPost({
        postTitleInput,
        postTextInput,
        postList,
        allPosts
    });
});

postList.addEventListener('click', handlePostActions);

function handlePostActions(event) {
    const postCard = event.target.closest('.post');

    if (!postCard) return;

    const targetId = Number(postCard.dataset.id);

    const targetPostObj = allPosts.find(post => {
        return post.postId === targetId;
    });

    if (!targetPostObj) return;

    if (event.target.classList.contains('flag-btn')) {
        targetPostObj.flagPost();
    }

    if (event.target.classList.contains('comment-btn')) {
        const commentInput = postCard.querySelector('.comment-input');
        const commentList = postCard.querySelector('.comment-list');

        const newComment = comment(commentInput.value);

        if (!newComment.validateComment()) return;

        targetPostObj.addComment(newComment);
        renderComments(targetPostObj, commentList);

        commentInput.value = '';
    }

    if (event.target.classList.contains('edit-comment-btn')) {
        const commentCard =
        event.target.closest('.comment');

        const commentId =
        Number(commentCard.dataset.id);

        const targetComment =
        targetPostObj.comments.find(comment => {
            return comment.commentId === commentId;
        });

        if (!targetComment) return;

        const newText = prompt(
        'Enter your new comment:',
        targetComment.text
        );

        if (!newText) return;

        targetComment.editComment(newText);

        const commentList =
        postCard.querySelector('.comment-list');

        renderComments(
        targetPostObj,
        commentList
        );
    }

    if (event.target.classList.contains('edit-post-btn')) {
        postBeingEdited = targetPostObj;
        postCardBeingEdited = postCard;

        editTitleInput.value = targetPostObj.title;
        editTextInput.value = targetPostObj.text;

        editModal.classList.remove('hidden');
    }

    saveEditBtn.addEventListener('click', () => {
    if (!postBeingEdited || !postCardBeingEdited) return;

    const wasEdited = postBeingEdited.editPost(
        editTitleInput.value,
        editTextInput.value
    );

    if (!wasEdited) return;

    const titleElement = postCardBeingEdited.querySelector('h3');
    const textElement = postCardBeingEdited.querySelector('.post-content');

    titleElement.textContent = postBeingEdited.title;
    textElement.textContent = postBeingEdited.text;

    closeEditModal();
});

cancelEditBtn.addEventListener('click', closeEditModal);

function closeEditModal() {
    editModal.classList.add('hidden');
    postBeingEdited = null;
    postCardBeingEdited = null;
}
}

function renderComments(postObj, commentList) {
    commentList.innerHTML = '';

    postObj.comments.forEach(comment => {
        const commentDiv = document.createElement('div');

        commentDiv.classList.add('comment');
        commentDiv.dataset.id = comment.commentId;

        commentDiv.innerHTML = `
            <strong>${comment.author}</strong>

            <p class="comment-text">
                ${comment.text}
            </p>

            <small>${comment.createdAt}</small>

            <button class="edit-comment-btn">
                Edit
            </button>
        `;

        commentList.appendChild(commentDiv);
    });
}