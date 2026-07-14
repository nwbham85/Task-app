export function storage() {

    return {
        savePost(item) {
            const post = JSON.stringify(item);
            localStorage.setItem('posts', post);

        },
        getPost() {
            const getPost = localStorage.getItem('posts');
            return getPost ? JSON.parse(getPost) : [];
        }


    }

}

export default storage;