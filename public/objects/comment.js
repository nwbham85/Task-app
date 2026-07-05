export function comment(text, author = 'nate') {

    return {
        commentId: Date.now(),
        author,
        text: text ? text.trim() : '',
        date: new Date().toLocaleDateString(),

        validateComment() {
            if(!this.text) {
                console.log('cannot post an empty comment.');
                return false;
            }

            if(this.text.length > 1000) {
                console.log('comment too long.');
                return false;
            }

            return true;
        },

        editComment(newText) {
            const cleanedText = newText ? newText.trim() : '';

            if(!cleanedText) {
                console.log('comment cannot be empty.');
                return false;
            }

            if(cleanedText.length > 1000) {
                console.log('comment is too long.');
                return false;
            }

            this.text = cleanedText;
            this.editedAt = new Date().toLocaleDateString();

            return this;

        }
    };
}

export default comment;