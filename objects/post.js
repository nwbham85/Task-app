import storage from '../objects/storage.js';


// init storage object
const db = storage();


export function post(title, text) {
    return {
        postId: null,
        title: title ? title.trim() : '',
        text: text ? text.trim() : '',
        comments: [],

        addComment(newComment) {
            this.comments.push(newComment);
            return newComment;
        },

        generateId(existingPosts = []) {
            let newId;
            let isDuplicate = true;

            while (isDuplicate) {
                newId = Math.floor(10000 + Math.random() * 90000);
                isDuplicate = existingPosts.some(post => post.postId === newId);
            }

            this.postId = newId;
            return newId;
        },

        flagPost() {
            console.log('you clicked flag');
        },

        validatePost() {
            if (!this.title || !this.text) {
                console.log('title or text fields cannot be empty.');
                return false;
            }

            if (this.text.length > 4000) {
                console.log('error - text exceeds max length');
                return false;
            }

            return true;
        },
        editPost(newTitle, newText) {
            const cleanedTitle = newTitle ? newTitle.trim() : '';
            const cleanedText = newText ? newText.trim() : '';

            if (!cleanedTitle || !cleanedText) {
            console.log('title and text cannot be empty.');
            return false;
            }

            if (cleanedText.length > 4000) {
            console.log('Error - text exceeds max length.');
            return false;
            }

            this.title = cleanedTitle;
            this.text = cleanedText;

            return true;
        },
        deletePost() {
           return true; 
        }
    };
}

export function createNewPost({
    postTitleInput,
    postTextInput,
    postList,
    allPosts
}) {
    const currentTitle = postTitleInput.value;
    const currentText = postTextInput.value;

    const newPost = post(currentTitle, currentText);

    if (!newPost.validatePost()) return;

    newPost.generateId(allPosts);
    allPosts.push(newPost);

    renderPost(newPost, postList);
    clearPostForm(postTitleInput, postTextInput);

    //save to storage
    db.savePost(allPosts);
        //verify the save worked
        console.log('current saved database', db.getPost());

}

export function clearPostForm(postTitleInput, postTextInput) {
    postTitleInput.value = '';
    postTextInput.value = '';
}

export function renderPost(newPost, postList) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    postDiv.dataset.id = newPost.postId;

    postDiv.innerHTML = `
        <div class="post-header">
            <div>
                <div class="post-author">Nathan Winslow</div>
                <div class="post-date">
                    Posted ${new Date().toLocaleDateString()} 
                    (ID: #${newPost.postId})
                </div>
            </div>
            <button class="warning flag-btn">Flag</button>
        </div>

        <h3>${newPost.title}</h3>
        <p class="post-content">${newPost.text}</p>

        <div class="btn-row">
            <button class="secondary edit-post-btn">Edit</button>
            <button class="primary">Share</button>
            <button class="danger delete-post-btn">Delete</button>
        </div>

        <div class="comments">
            <h4>Comments</h4>

            <div class="comment-list"></div>

            <div class="comment-box">
                <input 
                    class="comment-input" 
                    type="text" 
                    placeholder="Write a comment..." 
                />
                <button class="primary comment-btn">Comment</button>
            </div>
        </div>
    `;

    postList.prepend(postDiv);
}

export default post;