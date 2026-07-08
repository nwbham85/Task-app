import { createNewPost, post, renderPost } from './objects/post.js';
import createComment from './objects/comment.js';
import storage from './objects/storage.js';
import moderator from './objects/moderator.js';

const allPosts = [];
const db = storage();

// DOM refs
const editModal = document.querySelector('.edit-modal');
const editTitleInput = document.querySelector('.edit-title-input');
const editTextInput = document.querySelector('.edit-text-input');
const saveEditBtn = document.querySelector('.save-edit-btn');
const cancelEditBtn = document.querySelector('.cancel-edit-btn');

const postTitleInput = document.querySelector('.title');
const postTextInput = document.querySelector('.text');
const createBtn = document.querySelector('.create-post .primary');
const postList = document.querySelector('.post-list');

let postBeingEdited = null;
let postCardBeingEdited = null;

init();

function init() {
    db.getPost().forEach(restorePost);

    createBtn.addEventListener('click', () => {
        createNewPost({ postTitleInput, postTextInput, postList, allPosts });
    });

    postList.addEventListener('click', handlePostActions);
    saveEditBtn.addEventListener('click', handleSaveEdit);
    cancelEditBtn.addEventListener('click', closeEditModal);
}

function restorePost(savedPost) {
    const restoredPost = post(savedPost.title, savedPost.text);
    restoredPost.postId = savedPost.postId;
    restoredPost.comments = savedPost.comments || [];

    allPosts.push(restoredPost);
    renderPost(restoredPost, postList);
    renderComments(restoredPost, getCommentList(restoredPost.postId));
}

// --- Click delegation -----------------------------------------------------

const actionHandlers = {
    'flag-btn': handleFlag,
    'comment-btn': handleAddComment,
    'edit-comment-btn': handleEditComment,
    'edit-post-btn': handleEditPostClick,
    'delete-post-btn': handleDeletePost
};

function handlePostActions(event) {
    const postCard = event.target.closest('.post');
    if (!postCard) return;

    const targetPost = findPost(Number(postCard.dataset.id));
    if (!targetPost) return;

    for (const [className, handler] of Object.entries(actionHandlers)) {
        if (event.target.classList.contains(className)) {
            handler(event, targetPost, postCard);
            return;
        }
    }
}

function handleFlag(event, targetPost) {
    targetPost.flagPost();
}

function handleAddComment(event, targetPost, postCard) {
    const commentInput = postCard.querySelector('.comment-input');
    const newComment = createComment(commentInput.value);

    if (!newComment.validateComment()) return;

    targetPost.addComment(newComment);
    renderComments(targetPost, getCommentList(postCard));

    db.savePost(allPosts);
    commentInput.value = '';
}

function handleEditComment(event, targetPost, postCard) {
    const commentCard = event.target.closest('.comment');
    const commentId = Number(commentCard.dataset.id);

    const targetComment = targetPost.comments.find(c => c.commentId === commentId);
    if (!targetComment) return;

    const newText = prompt('Enter your new comment:', targetComment.text);
    if (!newText) return;

    targetComment.editComment(newText);
    renderComments(targetPost, getCommentList(postCard));
}

function handleEditPostClick(event, targetPost, postCard) {
    postBeingEdited = targetPost;
    postCardBeingEdited = postCard;

    editTitleInput.value = targetPost.title;
    editTextInput.value = targetPost.text;

    editModal.classList.remove('hidden');
}

function handleDeletePost(event, targetPost, postCard) {
    if (!targetPost.deletePost()) return;

    const postIndex = allPosts.findIndex(p => p.postId === targetPost.postId);
    if (postIndex === -1) return;

    allPosts.splice(postIndex, 1);
    postCard.remove();
    db.savePost(allPosts);
}

// --- Edit modal -------------------------------------------------------------

function handleSaveEdit() {
    if (!postBeingEdited || !postCardBeingEdited) return;

    const wasEdited = postBeingEdited.editPost(editTitleInput.value, editTextInput.value);
    if (!wasEdited) return;

    postCardBeingEdited.querySelector('h3').textContent = postBeingEdited.title;
    postCardBeingEdited.querySelector('.post-content').textContent = postBeingEdited.text;

    db.savePost(allPosts);
    closeEditModal();
}

function closeEditModal() {
    editModal.classList.add('hidden');
    postBeingEdited = null;
    postCardBeingEdited = null;
}

// --- Helpers ----------------------------------------------------------------

function findPost(postId) {
    return allPosts.find(p => p.postId === postId);
}

function getCommentList(postCardOrId) {
    const postCard = postCardOrId instanceof Element
        ? postCardOrId
        : postList.querySelector(`[data-id="${postCardOrId}"]`);

    return postCard.querySelector('.comment-list');
}

function renderComments(postObj, commentList) {
    commentList.innerHTML = '';

    postObj.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.dataset.id = comment.commentId;

        commentDiv.innerHTML = `
            <strong>${comment.author}</strong>
            <p class="comment-text">${comment.text}</p>
            <small>${comment.createdAt}</small>
            <button class="edit-comment-btn">Edit</button>
        `;

        commentList.appendChild(commentDiv);
    });
}