


const taskForm = document.querySelector('.taskForm');
const title = document.querySelector('.title');
const description = document.querySelector('.description');
const button = document.querySelector('.taskBtn');

const assignTo = document.querySelector('.assignTo');

taskForm.addEventListener('submit', async (e) => {
    try {

    } catch (error) {
        console.log(error.name);
        console.log(error.message);
    }
})