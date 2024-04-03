const prompts = [
    {
        description: "STEP 1 Personal details | Question 1/4",
        questions: [
            { name: "Name", category: "Personal details" },
            { name: "Surname", category: "Personal details" },
            { name: "Age", category: "Personal details" },
            { name: "Gender", category: "Personal details" },
        ]
    },
    {
        description: "STEP 2 Qualifications | Question 1/4",
        questions: [
            { name: "Area of Study", category: "Qualifications" },
            { name: "Highest Level of Study", category: "Qualifications" },
            { name: "University/Institution", category: "Qualifications" },
            { name: "Achievements", category: "Qualifications" },
        ]
    },
    {
        description: "STEP 3 Availability and contact | Question 1/4",
        questions: [
            { name: "Availibility for volunteering", category: "Availability and contact" },
            { name: "Country", category: "Availability and contact" },
            { name: "Tel", category: "Availability and contact" },
            { name: "Email", category: "Availability and contact" }
        ]
    }
];

let currentPromptIndex = 0;
let currentQuestionIndex = 0;
let userResponses = [];
let currentCategory = "";
let isEditMode = false;

const startButton = document.getElementById("start-btn");
const descriptionElement = document.getElementById("description");
const promptInputElement = document.getElementById("prompt-input");
const outputContainerElement = document.getElementById("output-container");
const nextButton = document.getElementById("next-btn");
const skipButton = document.getElementById("skip-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const editButton = document.getElementById("edit-btn");

// Hide the input, buttons, and progress bar initially
promptInputElement.style.display = "none";
nextButton.style.display = "none";
skipButton.style.display = "none";
progressBar.style.display = "none";
editButton.style.display = "none";

// Add an event listener to the "Start" button
startButton.addEventListener("click", () => {
    // Reset userResponses array to clear all inserted data
    userResponses = [];

    // Reset currentPromptIndex and currentQuestionIndex to go back to the first prompt
    currentPromptIndex = 0;
    currentQuestionIndex = 0;

    // Clear the output container
    outputContainerElement.innerHTML = "";

    // Show the input, buttons, and progress bar
    promptInputElement.style.display = "block";
    nextButton.style.display = "inline-block";
    skipButton.style.display = "inline-block";
    progressBar.style.display = "block";

    // Call the displayPrompt function to start the questionnaire from the first prompt
    displayPrompt();

    // Reset progress bar
    progressBar.style.width = "0%";
    progressText.textContent = "Profile completed 0%";

    // Hide the edit button
    editButton.style.display = "none";
    isEditMode = false;
});

function displayPrompt() {
    const currentPrompt = prompts[currentPromptIndex];
    const currentQuestion = currentPrompt.questions[currentQuestionIndex];
    descriptionElement.textContent = updatePromptDescription(currentPrompt.description, currentQuestionIndex);
    const existingResponse = userResponses.find(response => response.name === currentQuestion.name);
    promptInputElement.value = existingResponse ? existingResponse.response : "";
    promptInputElement.placeholder = `${currentQuestion.name}:`;
}

function updatePromptDescription(description, currentQuestionIndex) {
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = prompts[currentPromptIndex].questions.length;
    return description.replace(/Question \d+\/\d+/, `Question ${questionNumber}/${totalQuestions}`);
}

function handleUserResponse() {
    const userResponse = promptInputElement.value.trim();
    const currentPrompt = prompts[currentPromptIndex];
    const currentQuestion = currentPrompt.questions[currentQuestionIndex];
    const existingResponse = userResponses.find(response => response.name === currentQuestion.name);

    if (existingResponse) {
        existingResponse.response = userResponse;
    } else {
        userResponses.push({ category: currentQuestion.category, name: currentQuestion.name, response: userResponse });
    }

    if (currentQuestion.category !== currentCategory) {
        currentCategory = currentQuestion.category;
        outputContainerElement.innerHTML += `<p class="category-heading">${currentCategory}</p>`;
    }

    outputContainerElement.innerHTML += `<p>${currentQuestion.name}: ${userResponse}</p>`;
    updateProgressBar();
    nextQuestion();
}

function editQuestion(questionName) {
    const response = userResponses.find(response => response.name === questionName);
    if (response) {
        const newValue = prompt(`Edit ${questionName}:`, response.response);
        if (newValue !== null) {
            response.response = newValue.trim();
            // Update the displayed value
            const element = document.getElementById(questionName);
            if (element) {
                element.textContent = newValue;
            }
        }
    } else {
        // If the question was skipped, insert the user's response
        const newValue = prompt(`Insert ${questionName}:`);
        if (newValue !== null) {
            userResponses.push({ category: getCategory(questionName), name: questionName, response: newValue.trim() });
            // Update the displayed value
            const element = document.getElementById(questionName);
            if (element) {
                element.textContent = newValue.trim();
            }
        }
    }
}

function getCategory(questionName) {
    for (const prompt of prompts) {
        const foundQuestion = prompt.questions.find(question => question.name === questionName);
        if (foundQuestion) {
            return foundQuestion.category;
        }
    }
    return "";
}

function nextQuestion() {
    const currentPrompt = prompts[currentPromptIndex];
    currentQuestionIndex++;
    if (currentQuestionIndex < currentPrompt.questions.length) {
        displayPrompt();
    } else {
        currentPromptIndex++;
        currentQuestionIndex = 0;
        if (currentPromptIndex < prompts.length) {
            displayPrompt();
        } else {
            completeProfile();
        }
    }
}

function updateProgressBar() {
    const totalQuestions = prompts.reduce((sum, prompt) => sum + prompt.questions.length, 0);
    const completedQuestions = userResponses.length;
    const progress = (completedQuestions / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Profile completed ${progress.toFixed(0)}%`;
}

function completeProfile() {
    let output = "";

    prompts.forEach(prompt => {
        output += `<p class="category-heading">${prompt.description}</p>`;
        prompt.questions.forEach(question => {
            const response = userResponses.find(response => response.name === question.name);
            if (response) {
                output += `<p><span>${question.name}:</span> <span id="${question.name}" contenteditable>${response.response}</span><button onclick="editQuestion('${question.name}')" class="edit-btn">Edit</button></p>`;
            } else {
                // For skipped questions, provide an empty response
                output += `<p><span>${question.name}:</span> <span id="${question.name}" contenteditable></span><button onclick="editQuestion('${question.name}')" class="edit-btn">Edit</button></p>`;
            }
        });
    });

    outputContainerElement.innerHTML = output;

    // Hide the prompt description (h2)
    const promptDescription = document.getElementById("description");
    promptDescription.style.display = "none";

    // Hide the input, buttons, and progress bar
    promptInputElement.style.display = "none";
    nextButton.style.display = "none";
    skipButton.style.display = "none";
    progressBar.style.width = "100%";
    progressText.textContent = "Profile completed 100%";

    // Hide the green and white edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        const computedStyle = window.getComputedStyle(button);
        const backgroundColor = computedStyle.backgroundColor;
        if (backgroundColor === "rgb(0, 123, 255)" || backgroundColor === "rgb(255, 255, 255)" || backgroundColor === "rgba(0, 123, 255, 0.5)" || backgroundColor === "rgba(255, 255, 255, 0.5)") {
            button.style.display = "none";
        }
    });
}



function skipQuestion() {
    const currentPrompt = prompts[currentPromptIndex];
    const currentQuestion = currentPrompt.questions[currentQuestionIndex];
    const skippedQuestionName = currentQuestion.name;

    if (currentQuestion.category !== currentCategory) {
        currentCategory = currentQuestion.category;
        outputContainerElement.innerHTML += `<p class="category-heading">${currentCategory}</p>`;
    }

    outputContainerElement.innerHTML += `<p>${skippedQuestionName}</p>`;

    nextQuestion();
}

function editProfile() {
    isEditMode = true;
    currentPromptIndex = 0;
    currentQuestionIndex = 0;
    currentCategory = "";

    // Clear the output container
    outputContainerElement.innerHTML = "";

    // Show the input, buttons, and progress bar
    promptInputElement.style.display = "block";
    nextButton.style.display = "inline-block";
    skipButton.style.display = "inline-block";
    progressBar.style.display = "block";

    // Call the displayPrompt function to start the questionnaire from the first prompt
    displayPrompt();

    // Reset progress bar
    progressBar.style.width = "0%";
    progressText.textContent = "Profile completed 0%";

    // Hide the edit button
    editButton.style.display = "none";
}

nextButton.addEventListener("click", handleUserResponse);
skipButton.addEventListener("click", skipQuestion);
editButton.addEventListener("click", editProfile);

// Add event listener for contenteditable elements
outputContainerElement.addEventListener("input", (event) => {
    if (event.target.isContentEditable) {
        const questionName = event.target.id;
        const updatedResponse = event.target.textContent;
        const existingResponse = userResponses.find(response => response.name === questionName);
        if (existingResponse) {
            existingResponse.response = updatedResponse;
        }
    }
});